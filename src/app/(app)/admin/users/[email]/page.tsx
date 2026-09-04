import { notFound } from "next/navigation";
import { AdminUserDetail } from "@/components/AdminUserDetail";
import { loadAdminUserByEmail } from "@/lib/admin-users";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email: raw } = await params;
  const email = decodeURIComponent(raw).trim().toLowerCase();
  if (!email || !email.includes("@")) notFound();

  const user = await loadAdminUserByEmail(email);
  if (!user) notFound();

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

  return <AdminUserDetail user={user} courses={courseOptions} />;
}
