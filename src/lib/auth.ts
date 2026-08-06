import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

export const COURSE_SLUG = "python-training";

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

/**
 * Claims any pending invite matching the signed-in user's email, then reports
 * enrollment status for that course. Returns the authenticated Supabase
 * client + course id so callers can immediately query course content
 * (e.g. `modules`) without a second round-trip to resolve the course.
 */
export async function ensureEnrollmentClaimed(courseSlug = COURSE_SLUG) {
  const { supabase, user } = await getSessionUser();
  if (!user?.email || !supabase) {
    return { supabase: null, user: null, enrolled: false, isAdmin: false, courseId: null };
  }

  const email = user.email.toLowerCase();
  const isAdmin = isAdminEmail(email);

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (!course) {
    return { supabase, user, enrolled: isAdmin, isAdmin, courseId: null };
  }

  // Admins bypass the app-level enrollment check, but RLS on `modules` only
  // allows reads for enrolled users — ensure admins have an enrollment row.
  if (isAdmin) {
    const service = createServiceClient();
    await service.from("enrollments").upsert(
      {
        course_id: course.id,
        email,
        user_id: user.id,
        joined_at: new Date().toISOString(),
      },
      { onConflict: "course_id,email" },
    );
  }

  await supabase
    .from("enrollments")
    .update({ user_id: user.id, joined_at: new Date().toISOString() })
    .eq("course_id", course.id)
    .eq("email", email)
    .is("user_id", null);

  const { data: enrolled } = await supabase.rpc("is_enrolled_in_course", {
    p_course_slug: courseSlug,
  });

  return {
    supabase,
    user,
    enrolled: Boolean(enrolled) || isAdmin,
    isAdmin,
    courseId: course.id as string,
  };
}

/**
 * Resolves a course UUID to its slug, then reuses {@link ensureEnrollmentClaimed}.
 * Uses the service client when RLS hides the course (e.g. admin before enrollment).
 */
export async function ensureEnrollmentClaimedByCourseId(courseId: string) {
  const { supabase, user } = await getSessionUser();
  if (!user?.email || !supabase) {
    return { supabase: null, user: null, enrolled: false, isAdmin: false, courseId: null };
  }

  const { data: visible } = await supabase
    .from("courses")
    .select("slug")
    .eq("id", courseId)
    .maybeSingle();

  let slug = visible?.slug as string | undefined;

  if (!slug) {
    const service = createServiceClient();
    const { data: course } = await service
      .from("courses")
      .select("slug")
      .eq("id", courseId)
      .maybeSingle();
    slug = course?.slug as string | undefined;
  }

  if (!slug) {
    const isAdmin = isAdminEmail(user.email);
    return { supabase, user, enrolled: isAdmin, isAdmin, courseId: null };
  }

  return ensureEnrollmentClaimed(slug);
}
