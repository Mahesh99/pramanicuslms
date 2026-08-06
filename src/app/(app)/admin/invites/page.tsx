import { redirect } from "next/navigation";
import { InviteAdmin } from "@/components/InviteAdmin";
import { ensureEnrollmentClaimed } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/admin";
import { COURSE_SLUG } from "@/lib/auth";

export default async function AdminInvitesPage() {
  const { user, isAdmin } = await ensureEnrollmentClaimed();
  if (!user) redirect("/?next=/admin/invites");
  if (!isAdmin) redirect("/dashboard");

  const service = createServiceClient();
  const { data: course } = await service
    .from("courses")
    .select("id")
    .eq("slug", COURSE_SLUG)
    .single();

  const { data: invites } = course
    ? await service
        .from("enrollments")
        .select("id, email, invited_at, joined_at, user_id")
        .eq("course_id", course.id)
        .order("invited_at", { ascending: false })
    : { data: [] };

  return (
    <>
      <header className="site-header">
        <h1>Admin · Invites</h1>
        <p className="subtitle">Manage who can access Python Training</p>
      </header>
      <InviteAdmin invites={invites ?? []} />
    </>
  );
}
