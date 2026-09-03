import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

export const COURSE_SLUG = "python-training";

/** Links pending (or stale) enrollment rows to the signed-in user. */
async function claimEnrollmentsForUser(user: User) {
  const email = user.email?.trim().toLowerCase();
  if (!email) return;

  const patch = {
    user_id: user.id,
    joined_at: new Date().toISOString(),
  };

  try {
    const service = createServiceClient();
    await service
      .from("enrollments")
      .update(patch)
      .ilike("email", email)
      .or(`user_id.is.null,user_id.neq.${user.id}`);
    return;
  } catch {
    // Fall back to the user-scoped client when service role is unavailable.
  }

  const supabase = await createClient();
  await supabase
    .from("enrollments")
    .update(patch)
    .ilike("email", email)
    .or(`user_id.is.null,user_id.neq.${user.id}`);
}

async function userHasAnyEnrollment(supabase: Awaited<ReturnType<typeof createClient>>, user: User) {
  const email = user.email?.toLowerCase();
  const { count, error } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .or(`user_id.eq.${user.id}${email ? `,email.ilike.${email}` : ""}`);

  if (error) throw error;
  return (count ?? 0) > 0;
}

async function userEnrolledInCourse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User,
  courseId: string,
) {
  const email = user.email?.toLowerCase();
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .or(`user_id.eq.${user.id}${email ? `,email.ilike.${email}` : ""}`)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

async function ensureAdminEnrollment(user: User, courseId: string) {
  const email = user.email?.toLowerCase();
  if (!email) return;

  try {
    const service = createServiceClient();
    await service.from("enrollments").upsert(
      {
        course_id: courseId,
        email,
        user_id: user.id,
        joined_at: new Date().toISOString(),
      },
      { onConflict: "course_id,email" },
    );
  } catch {
    // Admin access still works via isAdmin when service role is missing.
  }
}

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export async function getSessionUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { supabase: null, user: null };
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { supabase, user };
  } catch {
    return { supabase: null, user: null };
  }
}

/** Lightweight session for nav — no enrollment claiming or admin upserts. */
export async function getNavSession() {
  const { supabase, user } = await getSessionUser();
  if (!user?.email || !supabase) {
    return { user: null, enrolled: false, isAdmin: false };
  }

  const isAdmin = isAdminEmail(user.email);
  if (isAdmin) {
    return { user, enrolled: true, isAdmin: true };
  }

  const enrolled = await userHasAnyEnrollment(supabase, user);
  return { user, enrolled, isAdmin: false };
}

/**
 * Claims pending invites, then checks whether the user is enrolled in any course.
 * Use on login gate and dashboard — not on every page via the header.
 */
export async function ensureAnyEnrollmentClaimed() {
  const { supabase, user } = await getSessionUser();
  if (!user?.email || !supabase) {
    return { supabase: null, user: null, enrolled: false, isAdmin: false };
  }

  const isAdmin = isAdminEmail(user.email);
  await claimEnrollmentsForUser(user);

  const enrolled = isAdmin || (await userHasAnyEnrollment(supabase, user));
  return { supabase, user, enrolled, isAdmin };
}

/**
 * Checks enrollment for a specific course by ID. Claims pending invites only when
 * the user is not yet enrolled.
 */
export async function ensureEnrollmentClaimedByCourseId(courseId: string) {
  const { supabase, user } = await getSessionUser();
  if (!user?.email || !supabase) {
    return { supabase: null, user: null, enrolled: false, isAdmin: false, courseId: null };
  }

  const isAdmin = isAdminEmail(user.email);
  let enrolled = isAdmin || (await userEnrolledInCourse(supabase, user, courseId));

  if (!enrolled) {
    await claimEnrollmentsForUser(user);
    enrolled = isAdmin || (await userEnrolledInCourse(supabase, user, courseId));
  }

  if (isAdmin) {
    await ensureAdminEnrollment(user, courseId);
  }

  return { supabase, user, enrolled, isAdmin, courseId };
}

/** @deprecated Use ensureEnrollmentClaimedByCourseId or ensureAnyEnrollmentClaimed */
export async function ensureEnrollmentClaimed(courseSlug = COURSE_SLUG) {
  const { supabase, user } = await getSessionUser();
  if (!user?.email || !supabase) {
    return { supabase: null, user: null, enrolled: false, isAdmin: false, courseId: null };
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (!course) {
    const isAdmin = isAdminEmail(user.email);
    return { supabase, user, enrolled: isAdmin, isAdmin, courseId: null };
  }

  const result = await ensureEnrollmentClaimedByCourseId(course.id);
  return { ...result, courseId: course.id as string };
}
