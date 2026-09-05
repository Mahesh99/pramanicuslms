"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { getAdminEmails, isAdminEmail } from "@/lib/auth";
import { allocateUniqueCourseSlug } from "@/lib/courses";
import type { BulkRegisterRow } from "@/lib/bulk-register";
import { parseBulkEmails } from "@/lib/bulk-register";

const ADMIN_PATH = "/admin";

function generatePassword(length = 12): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return { error: "Only admins can perform this action." as const };
  }

  if (getAdminEmails().length === 0) {
    return { error: "ADMIN_EMAILS is not configured." as const };
  }

  return { user, service: createServiceClient() };
}

function parseCourseIds(formData: FormData): { courseIds: string[] } | { error: string } {
  const courseIds = [
    String(formData.get("courseId1") ?? "").trim(),
    String(formData.get("courseId2") ?? "").trim(),
  ].filter(Boolean);

  const unique = [...new Set(courseIds)];
  if (unique.length === 0) {
    return { error: "Select at least one course." };
  }
  if (unique.length > 2) {
    return { error: "You can select at most 2 courses." };
  }

  return { courseIds: unique };
}

async function validateCourseIds(service: ReturnType<typeof createServiceClient>, courseIds: string[]) {
  const { data, error } = await service
    .from("courses")
    .select("id, archived_at")
    .in("id", courseIds);
  if (error) return { error: error.message };
  if ((data ?? []).length !== courseIds.length) {
    return { error: "One or more selected courses were not found." };
  }
  if ((data ?? []).some((c) => c.archived_at)) {
    return { error: "Cannot enroll in an archived course. Restore it first." };
  }
  return { ok: true as const };
}

function revalidateAdmin() {
  revalidatePath(ADMIN_PATH);
  revalidatePath("/admin/invites");
  revalidatePath("/admin/users");
  revalidatePath("/admin/courses");
  revalidatePath("/dashboard");
}

export async function inviteStudent(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const admin = await requireAdmin();
  if ("error" in admin) return admin;

  const parsed = parseCourseIds(formData);
  if ("error" in parsed) return parsed;

  const valid = await validateCourseIds(admin.service, parsed.courseIds);
  if ("error" in valid) return valid;

  const now = new Date().toISOString();
  const rows = parsed.courseIds.map((courseId) => ({
    course_id: courseId,
    email,
    invited_by: admin.user.id,
    invited_at: now,
  }));

  const { error } = await admin.service.from("enrollments").upsert(rows, {
    onConflict: "course_id,email",
  });

  if (error) return { error: error.message };

  revalidateAdmin();
  return { success: true as const };
}

export async function createStudentUser(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const admin = await requireAdmin();
  if ("error" in admin) return admin;

  const parsed = parseCourseIds(formData);
  if ("error" in parsed) return parsed;

  const valid = await validateCourseIds(admin.service, parsed.courseIds);
  if ("error" in valid) return valid;

  const password = generatePassword();
  const { data: authUser, error: createError } = await admin.service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message.toLowerCase().includes("already")) {
      return { error: "An account with this email already exists. Use Invite instead." };
    }
    return { error: createError.message };
  }

  const now = new Date().toISOString();
  const rows = parsed.courseIds.map((courseId) => ({
    course_id: courseId,
    email,
    user_id: authUser.user.id,
    invited_by: admin.user.id,
    invited_at: now,
    joined_at: now,
  }));

  const { error: enrollError } = await admin.service.from("enrollments").upsert(rows, {
    onConflict: "course_id,email",
  });

  if (enrollError) return { error: enrollError.message };

  revalidateAdmin();
  return { success: true as const, email, password };
}

function isExistingUserError(message: string) {
  const lower = message.toLowerCase();
  return lower.includes("already") || lower.includes("exists");
}

async function loadAuthUsersByEmail(service: ReturnType<typeof createServiceClient>) {
  const byEmail = new Map<string, string>();
  let page = 1;
  for (;;) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return { error: error.message };
    const users = data.users ?? [];
    for (const user of users) {
      if (user.email) byEmail.set(user.email.toLowerCase(), user.id);
    }
    if (users.length < 1000) break;
    page += 1;
  }
  return { byEmail };
}

export async function bulkCreateStudentUsers(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "").trim();
  if (!courseId) return { error: "Select a course." };

  const parsed = parseBulkEmails(String(formData.get("emails") ?? ""));
  if (parsed.error) return { error: parsed.error };
  if (parsed.emails.length === 0 && parsed.invalid.length === 0) {
    return { error: "Paste at least one email address." };
  }

  const admin = await requireAdmin();
  if ("error" in admin) return admin;

  const valid = await validateCourseIds(admin.service, [courseId]);
  if ("error" in valid) return valid;

  const rows: BulkRegisterRow[] = parsed.invalid.map((email) => ({
    email,
    status: "invalid" as const,
    error: "Not a valid email.",
  }));

  if (parsed.emails.length === 0) {
    return { success: true as const, rows };
  }

  const authUsers = await loadAuthUsersByEmail(admin.service);
  if ("error" in authUsers) return authUsers;
  const byEmail = authUsers.byEmail;

  const { data: existingEnrollments } = await admin.service
    .from("enrollments")
    .select("email, user_id, joined_at")
    .eq("course_id", courseId)
    .in("email", parsed.emails);

  const enrollmentByEmail = new Map(
    (existingEnrollments ?? []).map((row) => [
      String(row.email).toLowerCase(),
      row as { email: string; user_id: string | null; joined_at: string | null },
    ]),
  );

  const now = new Date().toISOString();

  for (const email of parsed.emails) {
    try {
      let userId = byEmail.get(email) ?? enrollmentByEmail.get(email)?.user_id ?? null;
      let password: string | undefined;
      let status: BulkRegisterRow["status"] = "enrolled";

      if (!userId) {
        password = generatePassword();
        const { data: authUser, error: createError } = await admin.service.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

        if (createError) {
          if (!isExistingUserError(createError.message)) {
            rows.push({ email, status: "error", error: createError.message });
            continue;
          }
          const refresh = await loadAuthUsersByEmail(admin.service);
          if ("error" in refresh) {
            rows.push({ email, status: "error", error: refresh.error });
            continue;
          }
          userId = refresh.byEmail.get(email) ?? null;
          password = undefined;
          status = "enrolled";
          if (!userId) {
            rows.push({
              email,
              status: "error",
              error: "Account already exists but could not be looked up.",
            });
            continue;
          }
          byEmail.set(email, userId);
        } else {
          userId = authUser.user.id;
          byEmail.set(email, userId);
          status = "created";
        }
      }

      const existing = enrollmentByEmail.get(email);
      const { error: enrollError } = await admin.service.from("enrollments").upsert(
        {
          course_id: courseId,
          email,
          user_id: userId,
          invited_by: admin.user.id,
          invited_at: now,
          joined_at: existing?.joined_at ?? now,
        },
        { onConflict: "course_id,email" },
      );

      if (enrollError) {
        rows.push({ email, status: "error", error: enrollError.message });
        continue;
      }

      rows.push(
        status === "created" && password
          ? { email, status, password }
          : { email, status: "enrolled" },
      );
    } catch (e) {
      rows.push({
        email,
        status: "error",
        error: e instanceof Error ? e.message : "Failed to register this email.",
      });
    }
  }

  revalidateAdmin();
  return { success: true as const, rows };
}

export async function addUserEnrollment(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const courseId = String(formData.get("courseId") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }
  if (!courseId) {
    return { error: "Select a course." };
  }

  const admin = await requireAdmin();
  if ("error" in admin) return admin;

  const valid = await validateCourseIds(admin.service, [courseId]);
  if ("error" in valid) return valid;

  const { data: existing } = await admin.service
    .from("enrollments")
    .select("user_id, joined_at")
    .eq("course_id", courseId)
    .ilike("email", email)
    .maybeSingle();

  const { data: anyUser } = await admin.service
    .from("enrollments")
    .select("user_id")
    .ilike("email", email)
    .not("user_id", "is", null)
    .limit(1)
    .maybeSingle();

  const userId = (existing?.user_id as string | null) ?? (anyUser?.user_id as string | null) ?? null;

  const { error } = await admin.service.from("enrollments").upsert(
    {
      course_id: courseId,
      email,
      user_id: userId,
      invited_by: admin.user.id,
      invited_at: new Date().toISOString(),
      joined_at: existing?.joined_at ?? (userId ? new Date().toISOString() : null),
    },
    { onConflict: "course_id,email" },
  );

  if (error) return { error: error.message };

  revalidateAdmin();
  revalidatePath(`/admin/users/${encodeURIComponent(email)}`);
  return { success: true as const };
}

export async function removeEnrollment(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const admin = await requireAdmin();
  if ("error" in admin) return;

  await admin.service.from("enrollments").delete().eq("id", id);
  revalidateAdmin();
  if (email) revalidatePath(`/admin/users/${encodeURIComponent(email)}`);
}

export async function revokeUserAccess(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) return;

  const admin = await requireAdmin();
  if ("error" in admin) return;

  await admin.service.from("enrollments").delete().ilike("email", email);
  revalidateAdmin();
  revalidatePath(`/admin/users/${encodeURIComponent(email)}`);
}

export async function resetUserPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) return { error: "Email is required." };

  const admin = await requireAdmin();
  if ("error" in admin) return admin;

  const { data: enrollment } = await admin.service
    .from("enrollments")
    .select("user_id")
    .ilike("email", email)
    .not("user_id", "is", null)
    .limit(1)
    .maybeSingle();

  let authUserId = enrollment?.user_id as string | undefined;

  if (!authUserId) {
    const { data: listed, error: listError } = await admin.service.auth.admin.listUsers();
    if (listError) return { error: listError.message };
    authUserId = listed.users.find((u) => u.email?.toLowerCase() === email)?.id;
  }

  if (!authUserId) {
    return { error: "No sign-in account exists for this email. The student may only be invited." };
  }

  const password = generatePassword();
  const { error } = await admin.service.auth.admin.updateUserById(authUserId, { password });
  if (error) return { error: error.message };

  return { success: true as const, email, password };
}

export async function createCourse(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!title) return { error: "Title is required." };

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  try {
    const slug = await allocateUniqueCourseSlug(admin.service, title);
    const { error } = await admin.service.from("courses").insert({
      title,
      description,
      slug,
    });
    if (error) return { error: error.message };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create course." };
  }

  revalidateAdmin();
  return { success: true as const };
}

export async function updateCourse(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!id) return { error: "Course id is required." };
  if (!title) return { error: "Title is required." };

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const { error } = await admin.service
    .from("courses")
    .update({ title, description })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateAdmin();
  return { success: true as const };
}

export async function archiveCourse(formData: FormData): Promise<{ error?: string; success?: true }> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Course id is required." };

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const { error } = await admin.service
    .from("courses")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateAdmin();
  return { success: true as const };
}

export async function restoreCourse(formData: FormData): Promise<{ error?: string; success?: true }> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Course id is required." };

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };

  const { error } = await admin.service
    .from("courses")
    .update({ archived_at: null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateAdmin();
  return { success: true as const };
}

/** @deprecated Use removeEnrollment */
export async function removeInvite(formData: FormData): Promise<void> {
  return removeEnrollment(formData);
}
