import type { AdminUserRow } from "@/lib/admin-types";
import { createServiceClient } from "@/lib/supabase/admin";

export async function loadAdminUsers(): Promise<AdminUserRow[]> {
  const service = createServiceClient();
  const { data: enrollments } = await service
    .from("enrollments")
    .select("id, email, user_id, course_id, invited_at, joined_at, courses(title)")
    .order("email");

  return groupEnrollments(enrollments ?? []);
}

export async function loadAdminUserByEmail(email: string): Promise<AdminUserRow | null> {
  const normalized = email.trim().toLowerCase();
  const service = createServiceClient();
  const { data: enrollments } = await service
    .from("enrollments")
    .select("id, email, user_id, course_id, invited_at, joined_at, courses(title)")
    .ilike("email", normalized)
    .order("invited_at");

  const users = groupEnrollments(enrollments ?? []);
  return users.find((u) => u.email === normalized) ?? null;
}

function groupEnrollments(
  enrollments: Array<Record<string, unknown>>,
): AdminUserRow[] {
  const usersByEmail = new Map<string, AdminUserRow>();

  for (const row of enrollments) {
    const email = String(row.email).toLowerCase();
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

  return [...usersByEmail.values()].sort((a, b) => a.email.localeCompare(b.email));
}
