"use client";

import { useActionState, useState } from "react";
import { bulkCreateStudentUsers, createStudentUser, inviteStudent } from "@/app/actions/invites";
import type { CourseOption } from "@/lib/admin-types";
import type { BulkRegisterRow } from "@/lib/bulk-register";
import { bulkResultsToCsv } from "@/lib/bulk-register";

type ActionResult = { error?: string; success?: boolean; email?: string; password?: string };
type BulkActionResult = { error?: string; success?: boolean; rows?: BulkRegisterRow[] };

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

export function AdminInvitePanel({ courses }: { courses: CourseOption[] }) {
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
    <div>
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Invite students</h2>
        <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
          Add a student email and select up to two courses. They sign in with that email once
          invited.
        </p>

        {courses.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Create an active course first on the Courses tab.</p>
        ) : (
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
        )}

        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>Create account directly</h3>
        <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
          Create a sign-in account with a random password for up to two courses.
        </p>

        {courses.length > 0 && (
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
        )}
      </section>

      <BulkCreateSection courses={courses} />
    </div>
  );
}

function statusLabel(status: BulkRegisterRow["status"]) {
  switch (status) {
    case "created":
      return "Created";
    case "enrolled":
      return "Already had account";
    case "invalid":
      return "Invalid email";
    case "error":
      return "Failed";
  }
}

function downloadResultsCsv(rows: BulkRegisterRow[]) {
  const blob = new Blob(["\uFEFF" + bulkResultsToCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "student-credentials.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function BulkCreateSection({ courses }: { courses: CourseOption[] }) {
  const [bulkState, bulkAction, bulkPending] = useActionState<BulkActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await bulkCreateStudentUsers(formData);
      if ("error" in result && result.error) return { error: result.error };
      if ("success" in result && result.success) return { success: true, rows: result.rows };
      return null;
    },
    null,
  );

  const rows = bulkState?.rows ?? [];
  const created = rows.filter((row) => row.status === "created").length;
  const enrolled = rows.filter((row) => row.status === "enrolled").length;
  const failed = rows.filter((row) => row.status === "invalid" || row.status === "error").length;

  return (
    <section>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Bulk create accounts</h2>
      <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
        Paste student emails, one per line. New accounts get a random password. Existing accounts
        are enrolled in the course and their password is left unchanged.
      </p>

      {courses.length === 0 ? (
        <p style={{ color: "#6b7280" }}>Create an active course first on the Courses tab.</p>
      ) : (
        <form action={bulkAction} className="auth-form">
          <label>
            Student emails
            <textarea
              name="emails"
              required
              placeholder={"student1@gmail.com\nstudent2@gmail.com"}
            />
          </label>
          <label>
            Course
            <select name="courseId" required defaultValue="">
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
          {bulkState?.error && <p className="auth-error">{bulkState.error}</p>}
          <button type="submit" className="btn-primary" disabled={bulkPending}>
            {bulkPending ? "Creating accounts…" : "Create accounts"}
          </button>
        </form>
      )}

      {rows.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "0.75rem",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#374151" }}>
              Created {created}, enrolled existing {enrolled}, failed {failed}. Passwords for new
              accounts are shown once — download the CSV now.
            </p>
            <button type="button" className="btn-primary" onClick={() => downloadResultsCsv(rows)}>
              Download CSV
            </button>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  <th style={{ padding: "0.6rem 0.75rem" }}>Email</th>
                  <th style={{ padding: "0.6rem 0.75rem" }}>Status</th>
                  <th style={{ padding: "0.6rem 0.75rem" }}>Password</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${index}-${row.email}`} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "0.55rem 0.75rem" }}>
                      <code>{row.email}</code>
                    </td>
                    <td style={{ padding: "0.55rem 0.75rem" }}>
                      {statusLabel(row.status)}
                      {row.error ? ` — ${row.error}` : ""}
                    </td>
                    <td style={{ padding: "0.55rem 0.75rem" }}>
                      {row.password ? <code>{row.password}</code> : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
