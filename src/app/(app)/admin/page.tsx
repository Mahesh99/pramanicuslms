import { createServiceClient } from "@/lib/supabase/admin";
import { AdminInvitePanel } from "@/components/AdminInvitePanel";

export const maxDuration = 60;

export default async function AdminInvitePage() {
  const service = createServiceClient();
  const { data: courses } = await service
    .from("courses")
    .select("id, title")
    .is("archived_at", null)
    .order("title");

  const courseOptions = (courses ?? []).map((c) => ({
    id: c.id as string,
    title: c.title as string,
  }));

  return <AdminInvitePanel courses={courseOptions} />;
}
