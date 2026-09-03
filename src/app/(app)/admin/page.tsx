import { redirect } from "next/navigation";
import { AdminHub, type AdminUserRow } from "@/components/AdminHub";
import { getSessionUser, isAdminEmail } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const { user } = await getSessionUser();
  if (!user) redirect("/?next=/admin");
  if (!isAdminEmail(user.email)) redirect("/dashboard");

  const service = createServiceClient();

  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    service.from("courses").select("id, title").order("title"),
    service
      .from("enrollments")
      .select("id, email, user_id, course_id, invited_at, joined_at, courses(title)")
      .order("email"),
  ]);

  const courseOptions = (courses ?? []).map((c) => ({
    id: c.id as string,
    title: c.title as string,
  }));

  const usersByEmail = new Map<string, AdminUserRow>();

  for (const row of enrollments ?? []) {
    const email = (row.email as string).toLowerCase();
    const coursesJoin = row.courses as { title: string } | { title: string }[] | null;
    const courseTitle = Array.isArray(coursesJoin)
      ? (coursesJoin[0]?.title ?? "Unknown course")
      : (coursesJoin?.title ?? "Unknown course");

    const existing = usersByEmail.get(email) ?? {
      email,
      userId: (row.user_id as string | null) ?? null,
      enrollments: [],
    };

    if (row.user_id && !existing.userId) {
      existing.userId = row.user_id as string;
    }

    existing.enrollments.push({
      id: row.id as string,
      courseId: row.course_id as string,
      courseTitle: courseTitle as string,
      invitedAt: row.invited_at as string,
      joinedAt: row.joined_at as string | null,
    });

    usersByEmail.set(email, existing);
  }

  const users = [...usersByEmail.values()].sort((a, b) => a.email.localeCompare(b.email));

  return (
    <>
      <header className="site-header">
        <h1>Admin</h1>
        <p className="subtitle">Invite students, create accounts, and manage enrollments</p>
      </header>
      <AdminHub courses={courseOptions} users={users} />
    </>
  );
}
