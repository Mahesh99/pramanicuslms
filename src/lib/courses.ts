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

export async function listEnrolledCourses(
  supabase: SupabaseClient,
  userId: string,
): Promise<CourseRow[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select("courses(id, slug, title, description)")
    .eq("user_id", userId);

  if (error) throw error;

  const courses = (data ?? [])
    .flatMap((row) => {
      const joined = (row as EnrollmentCourseJoin).courses;
      if (!joined) return [];
      return Array.isArray(joined) ? joined : [joined];
    })
    .filter((c): c is CourseRow => Boolean(c?.id && c?.slug && c?.title));

  return courses.sort((a, b) => a.title.localeCompare(b.title));
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
