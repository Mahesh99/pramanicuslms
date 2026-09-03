import type { SupabaseClient } from "@supabase/supabase-js";

export type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
};

type EnrollmentCourseJoin = {
  courses: CourseRow | CourseRow[] | null;
};

export async function listAllCourses(supabase: SupabaseClient): Promise<CourseRow[]> {
  const service = supabase;
  const { data, error } = await service
    .from("courses")
    .select("id, slug, title, description")
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
  let query = supabase.from("enrollments").select("courses(id, slug, title, description)");

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
    .filter((c): c is CourseRow => Boolean(c?.id && c?.slug && c?.title));

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
    .select("id, slug, title, description")
    .eq("id", courseId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
