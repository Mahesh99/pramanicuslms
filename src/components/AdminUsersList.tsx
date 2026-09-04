import Link from "next/link";
import type { AdminUserRow } from "@/lib/admin-types";

export function AdminUsersList({ users }: { users: AdminUserRow[] }) {
  return (
    <section>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Users</h2>
      <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
        Open a user to add courses, reset passwords, or revoke access.
      </p>

      {users.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No students yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                <th style={{ padding: "0.6rem 0.5rem", fontWeight: 500 }}>Email</th>
                <th style={{ padding: "0.6rem 0.5rem", fontWeight: 500 }}>Status</th>
                <th style={{ padding: "0.6rem 0.5rem", fontWeight: 500 }}>Courses</th>
                <th style={{ padding: "0.6rem 0.5rem", fontWeight: 500 }}>Account</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const status =
                  user.enrollments.length > 0
                    ? user.userId
                      ? "Active"
                      : "Invited"
                    : "No access";
                const href = `/admin/users/${encodeURIComponent(user.email)}`;
                return (
                  <tr key={user.email} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <Link href={href} style={{ fontWeight: 600, color: "#111827" }}>
                        {user.email}
                      </Link>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#4b5563" }}>{status}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#4b5563" }}>
                      {user.enrollments.length === 0
                        ? "—"
                        : user.enrollments.map((e) => e.courseTitle).join(", ")}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#4b5563" }}>
                      {user.userId ? "Has account" : "Invited only"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
