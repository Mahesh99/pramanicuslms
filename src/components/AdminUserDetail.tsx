"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  addUserEnrollment,
  removeEnrollment,
  resetUserPassword,
  revokeUserAccess,
} from "@/app/actions/invites";
import type { AdminUserRow, CourseOption } from "@/lib/admin-types";

type ActionResult = { error?: string; success?: boolean; email?: string; password?: string };

function PasswordBanner({ email, password }: { email: string; password: string }) {
  return (
    <div
      className="auth-success"
      style={{
        padding: "0.75rem 1rem",
        borderRadius: 8,
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
      }}
    >
      <p style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>Credentials (shown once)</p>
      <p style={{ margin: "0 0 0.25rem", fontSize: "0.9rem" }}>
        Email: <code>{email}</code>
      </p>
      <p style={{ margin: 0, fontSize: "0.9rem" }}>
        Password: <code>{password}</code>
      </p>
    </div>
  );
}

export function AdminUserDetail({
  user,
  courses,
}: {
  user: AdminUserRow;
  courses: CourseOption[];
}) {
  const [resetState, resetAction, resetPending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await resetUserPassword(formData);
      if ("error" in result && result.error) return { error: result.error };
      if ("success" in result && result.success) {
        return { success: true, email: result.email, password: result.password };
      }
      return null;
    },
    null,
  );
  const [addState, addAction, addPending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await addUserEnrollment(formData);
      if ("error" in result && result.error) return { error: result.error };
      if ("success" in result && result.success) return { success: true };
      return null;
    },
    null,
  );

  const enrolledCourseIds = new Set(user.enrollments.map((e) => e.courseId));
  const availableCourses = courses.filter((c) => !enrolledCourseIds.has(c.id));
  const hasAccount = Boolean(user.userId);
  const status = user.enrollments.length > 0 ? (hasAccount ? "Active" : "Invited") : "No access";

  return (
    <div>
      <p style={{ marginBottom: "1rem" }}>
        <Link href="/admin/users" style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          ← All users
        </Link>
      </p>

      <header style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.35rem", margin: "0 0 0.35rem" }}>{user.email}</h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
          {status}
          {hasAccount ? " · Has account" : " · Invited only"}
        </p>
      </header>

      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem" }}>Enrollments</h3>
        {user.enrollments.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>No course enrollments</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {user.enrollments.map((enrollment) => (
              <li
                key={enrollment.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                <span style={{ flex: 1 }}>
                  {enrollment.courseTitle}
                  <span style={{ color: "#9ca3af", marginLeft: "0.5rem" }}>
                    {enrollment.joinedAt ? "Joined" : "Invited"}
                  </span>
                </span>
                <form action={removeEnrollment}>
                  <input type="hidden" name="id" value={enrollment.id} />
                  <input type="hidden" name="email" value={user.email} />
                  <button
                    type="submit"
                    style={{
                      border: "1px solid #fecaca",
                      background: "#fff1f2",
                      color: "#b91c1c",
                      borderRadius: 6,
                      padding: "0.2rem 0.5rem",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem" }}>Add course</h3>
        {availableCourses.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            No active courses left to add for this user.
          </p>
        ) : (
          <form action={addAction} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <input type="hidden" name="email" value={user.email} />
            <label style={{ margin: 0, flex: 1 }}>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Course</span>
              <select name="courseId" required defaultValue="">
                <option value="" disabled>
                  Select course
                </option>
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={addPending}
              className="btn-primary"
              style={{ padding: "0.45rem 0.9rem" }}
            >
              {addPending ? "Adding…" : "Add course"}
            </button>
          </form>
        )}
        {addState?.error && <p className="auth-error">{addState.error}</p>}
        {addState?.success && <p className="auth-success">Course added.</p>}
      </section>

      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          paddingTop: "1rem",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        {hasAccount && (
          <form action={resetAction}>
            <input type="hidden" name="email" value={user.email} />
            <button
              type="submit"
              disabled={resetPending}
              style={{
                border: "1px solid #d1d5db",
                background: "#fff",
                borderRadius: 6,
                padding: "0.45rem 0.85rem",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {resetPending ? "Resetting…" : "Reset password"}
            </button>
          </form>
        )}

        {user.enrollments.length > 0 && (
          <form action={revokeUserAccess}>
            <input type="hidden" name="email" value={user.email} />
            <button
              type="submit"
              style={{
                border: "1px solid #fecaca",
                background: "#fff1f2",
                color: "#b91c1c",
                borderRadius: 6,
                padding: "0.45rem 0.85rem",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Revoke access
            </button>
          </form>
        )}
      </section>

      {resetState?.error && <p className="auth-error">{resetState.error}</p>}
      {resetState?.success && resetState.email && resetState.password && (
        <div style={{ marginTop: "1rem" }}>
          <PasswordBanner email={resetState.email} password={resetState.password} />
        </div>
      )}
    </div>
  );
}
