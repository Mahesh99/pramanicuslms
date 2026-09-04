import { AdminCoursesPanel } from "@/components/AdminCoursesPanel";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminCoursesPage() {
  const service = createServiceClient();
  const { data: courses } = await service
    .from("courses")
    .select("id, slug, title, description, archived_at")
    .order("title");

  const rows = (courses ?? []).map((c) => ({
    id: c.id as string,
    slug: c.slug as string,
    title: c.title as string,
    description: (c.description as string | null) ?? null,
    archivedAt: (c.archived_at as string | null) ?? null,
  }));

  return <AdminCoursesPanel courses={rows} />;
}
