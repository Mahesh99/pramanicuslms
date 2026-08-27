"use server";

import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { COURSE_SLUG, getAdminEmails, isAdminEmail } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function generatePassword(length = 12): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function inviteStudent(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return { error: "Only admins can invite students." };
  }

  if (getAdminEmails().length === 0) {
    return { error: "ADMIN_EMAILS is not configured." };
  }

  const service = createServiceClient();

  const { data: course, error: courseError } = await service
    .from("courses")
    .select("id")
    .eq("slug", COURSE_SLUG)
    .single();

  if (courseError || !course) {
    return { error: "Course not found. Run supabase/schema.sql first." };
  }

  const { error } = await service.from("enrollments").upsert(
    {
      course_id: course.id,
      email,
      invited_by: user.id,
      invited_at: new Date().toISOString(),
    },
    { onConflict: "course_id,email" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/invites");
  return { success: true };
}

export async function createStudentUser(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return { error: "Only admins can create student accounts." };
  }

  if (getAdminEmails().length === 0) {
    return { error: "ADMIN_EMAILS is not configured." };
  }

  const service = createServiceClient();
  const password = generatePassword();

  const { data: authUser, error: createError } = await service.auth.admin.createUser({
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

  const { data: course, error: courseError } = await service
    .from("courses")
    .select("id")
    .eq("slug", COURSE_SLUG)
    .single();

  if (courseError || !course) {
    return { error: "Course not found. Run supabase/schema.sql first." };
  }

  const { error: enrollError } = await service.from("enrollments").upsert(
    {
      course_id: course.id,
      email,
      user_id: authUser.user.id,
      invited_by: user.id,
      invited_at: new Date().toISOString(),
      joined_at: new Date().toISOString(),
    },
    { onConflict: "course_id,email" },
  );

  if (enrollError) {
    return { error: enrollError.message };
  }

  revalidatePath("/admin/invites");
  return { success: true as const, email, password };
}

export async function removeInvite(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return;
  }

  const service = createServiceClient();
  await service.from("enrollments").delete().eq("id", id);
  revalidatePath("/admin/invites");
}
