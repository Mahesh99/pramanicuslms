"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { getAdminEmails, isAdminEmail } from "@/lib/auth";

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
  const { data, error } = await service.from("courses").select("id").in("id", courseIds);
  if (error) return { error: error.message };
  if ((data ?? []).length !== courseIds.length) {
    return { error: "One or more selected courses were not found." };
  }
  return { ok: true as const };
}

function revalidateAdmin() {
  revalidatePath(ADMIN_PATH);
  revalidatePath("/admin/invites");
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

  const { error } = await admin.service.from("enrollments").upsert(
    {
      course_id: courseId,
      email,
      user_id: existing?.user_id ?? null,
      invited_by: admin.user.id,
      invited_at: new Date().toISOString(),
      joined_at: existing?.joined_at ?? (existing?.user_id ? new Date().toISOString() : null),
    },
    { onConflict: "course_id,email" },
  );

  if (error) return { error: error.message };

  revalidateAdmin();
  return { success: true as const };
}

export async function removeEnrollment(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const admin = await requireAdmin();
  if ("error" in admin) return;

  await admin.service.from("enrollments").delete().eq("id", id);
  revalidateAdmin();
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

/** @deprecated Use removeEnrollment */
export async function removeInvite(formData: FormData): Promise<void> {
  return removeEnrollment(formData);
}
