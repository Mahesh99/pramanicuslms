"use client";

import { useActionState, useState } from "react";
import {
  addUserEnrollment,
  createStudentUser,
  inviteStudent,
  removeEnrollment,
  resetUserPassword,
  revokeUserAccess,
} from "@/app/actions/invites";

export type CourseOption = {
  id: string;
  title: string;
};

export type EnrollmentRow = {
  id: string;
  courseId: string;
  courseTitle: string;
  invitedAt: string;
  joinedAt: string | null;
};

export type AdminUserRow = {
  email: string;
  userId: string | null;
  enrollments: EnrollmentRow[];
};

type ActionResult = { error?: string; success?: boolean; email?: string; password?: string };

function CoursePickers({
  courses,
  showSecond,
  onToggleSecond,
}: {
  courses: CourseOption[];
  showSecond: boolean;
  onToggleSecond: (show: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <label>
        Course
        <select name="courseId1" required defaultValue="">
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </label>
      {showSecond ? (
        <label>
          Second course
          <select name="courseId2" defaultValue="">
            <option value="">None</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <button
          type="button"
          onClick={() => onToggleSecond(true)}
          style={{
            alignSelf: "flex-start",
            background: "transparent",
            border: "1px dashed #d1d5db",
            borderRadius: 6,
            padding: "0.35rem 0.75rem",
            cursor: "pointer",
            fontSize: "0.85rem",
            color: "#4b5563",
          }}
        >
          + Add another course
        </button>
      )}
    </div>
  );
}

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

function UserRow({
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
  const status = user.enrollments.length > 0 ? "Active" : "No access";

  return (
    <li
      style={{
        padding: "1rem 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 200px" }}>
          <div style={{ fontWeight: 600 }}>{user.email}</div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>
            {status}
            {hasAccount ? " · Has account" : " · Invited only"}
          </div>
        </div>
        <div style={{ flex: "2 1 280px" }}>
          {user.enrollments.length === 0 ? (
            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>No course enrollments</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {user.enrollments.map((enrollment) => (
                <li
                  key={enrollment.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.35rem",
                    fontSize: "0.9rem",
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
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginTop: "0.75rem",
          alignItems: "flex-end",
        }}
      >
        {availableCourses.length > 0 && (
          <form action={addAction} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <input type="hidden" name="email" value={user.email} />
            <label style={{ margin: 0 }}>
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Add course</span>
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
              style={{
                border: "1px solid #d1d5db",
                background: "#fff",
                borderRadius: 6,
                padding: "0.35rem 0.7rem",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              {addPending ? "Adding…" : "Add"}
            </button>
          </form>
        )}

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
                padding: "0.35rem 0.7rem",
                cursor: "pointer",
                fontSize: "0.8rem",
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
                padding: "0.35rem 0.7rem",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Revoke access
            </button>
          </form>
        )}
      </div>

      {addState?.error && <p className="auth-error">{addState.error}</p>}
      {resetState?.error && <p className="auth-error">{resetState.error}</p>}
      {resetState?.success && resetState.email && resetState.password && (
        <div style={{ marginTop: "0.75rem" }}>
          <PasswordBanner email={resetState.email} password={resetState.password} />
        </div>
      )}
    </li>
  );
}

export function AdminHub({ courses, users }: { courses: CourseOption[]; users: AdminUserRow[] }) {
  const [showSecondInvite, setShowSecondInvite] = useState(false);
  const [showSecondCreate, setShowSecondCreate] = useState(false);

  const [inviteState, inviteAction, invitePending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await inviteStudent(formData);
      if ("error" in result && result.error) return { error: result.error };
      if ("success" in result && result.success) return { success: true };
      return null;
    },
    null,
  );

  const [createState, createAction, createPending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await createStudentUser(formData);
      if ("error" in result && result.error) return { error: result.error };
      if ("success" in result && result.success) {
        return { success: true, email: result.email, password: result.password };
      }
      return null;
    },
    null,
  );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Invite students</h2>
        <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
          Add a student email and select up to two courses. They sign in with that email once
          invited.
        </p>

        <form action={inviteAction} className="auth-form" style={{ marginBottom: "2rem" }}>
          <label>
            Student email
            <input type="email" name="email" required placeholder="student@gmail.com" />
          </label>
          <CoursePickers
            courses={courses}
            showSecond={showSecondInvite}
            onToggleSecond={setShowSecondInvite}
          />
          {inviteState?.error && <p className="auth-error">{inviteState.error}</p>}
          {inviteState?.success && <p className="auth-success">Invite saved.</p>}
          <button type="submit" className="btn-primary" disabled={invitePending}>
            {invitePending ? "Saving…" : "Invite"}
          </button>
        </form>

        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>Create account directly</h3>
        <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
          Create a sign-in account with a random password for up to two courses.
        </p>

        <form action={createAction} className="auth-form">
          <label>
            Student email
            <input type="email" name="email" required placeholder="student@gmail.com" />
          </label>
          <CoursePickers
            courses={courses}
            showSecond={showSecondCreate}
            onToggleSecond={setShowSecondCreate}
          />
          {createState?.error && <p className="auth-error">{createState.error}</p>}
          {createState?.success && createState.email && createState.password && (
            <PasswordBanner email={createState.email} password={createState.password} />
          )}
          <button type="submit" className="btn-primary" disabled={createPending}>
            {createPending ? "Creating…" : "Create account"}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Users & enrollments</h2>
        <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
          Manage course access, reset passwords, or revoke all enrollments for a student.
        </p>

        {users.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No students yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {users.map((user) => (
              <UserRow key={user.email} user={user} courses={courses} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
