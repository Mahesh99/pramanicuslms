import type { SupabaseClient } from "@supabase/supabase-js";

export type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  archived_at?: string | null;
};

type EnrollmentCourseJoin = {
  courses: CourseRow | CourseRow[] | null;
};

export function slugifyCourseTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "course";
}

export async function listAllCourses(supabase: SupabaseClient): Promise<CourseRow[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, archived_at")
    .order("title");

  if (error) throw error;
  return data ?? [];
}

export async function listActiveCourses(supabase: SupabaseClient): Promise<CourseRow[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, archived_at")
    .is("archived_at", null)
    .order("title");

  if (error) throw error;
  return data ?? [];
}

export async function listEnrolledCourses(
  supabase: SupabaseClient,
  userId: string,
  email?: string | null,
): Promise<CourseRow[]> {
  const normalizedEmail = email?.trim().toLowerCase();
  let query = supabase
    .from("enrollments")
    .select("courses(id, slug, title, description, archived_at)");

  if (normalizedEmail) {
    query = query.or(`user_id.eq.${userId},email.ilike.${normalizedEmail}`);
  } else {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const courses = (data ?? [])
    .flatMap((row) => {
      const joined = (row as EnrollmentCourseJoin).courses;
      if (!joined) return [];
      return Array.isArray(joined) ? joined : [joined];
    })
    .filter(
      (c): c is CourseRow =>
        Boolean(c?.id && c?.slug && c?.title) && !c.archived_at,
    );

  const seen = new Set<string>();
  return courses
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getCourseForUser(
  supabase: SupabaseClient,
  courseId: string,
): Promise<CourseRow | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, archived_at")
    .eq("id", courseId)
    .maybeSingle();

  if (error) throw error;
  if (data?.archived_at) return null;
  return data;
}

export async function allocateUniqueCourseSlug(
  service: SupabaseClient,
  title: string,
): Promise<string> {
  const base = slugifyCourseTitle(title);
  let candidate = base;
  let n = 2;

  for (;;) {
    const { data, error } = await service
      .from("courses")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}
