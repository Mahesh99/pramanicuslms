"use client";

import { useActionState } from "react";
import { createStudentUser, inviteStudent, removeInvite } from "@/app/actions/invites";

type InviteRow = {
  id: string;
  email: string;
  invited_at: string;
  joined_at: string | null;
  user_id: string | null;
};

type CreateResult = { error?: string; success?: boolean; email?: string; password?: string };

export function InviteAdmin({ invites }: { invites: InviteRow[] }) {
  const [inviteState, inviteAction, invitePending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return inviteStudent(formData);
    },
    null,
  );

  const [createState, createAction, createPending] = useActionState(
    async (_prev: CreateResult | null, formData: FormData) => {
      return createStudentUser(formData);
    },
    null,
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Invite students</h1>
      <p style={{ color: "#4b5563", marginBottom: "1.5rem" }}>
        Add the student&apos;s email. They can then sign in with Google or email/password using
        that same address.
      </p>

      <form action={inviteAction} className="auth-form" style={{ marginBottom: "2.5rem" }}>
        <label>
          Student email
          <input type="email" name="email" required placeholder="student@gmail.com" />
        </label>
        {inviteState?.error && <p className="auth-error">{inviteState.error}</p>}
        {inviteState?.success && <p className="auth-success">Invite saved.</p>}
        <button type="submit" className="btn-primary" disabled={invitePending}>
          {invitePending ? "Saving…" : "Invite"}
        </button>
      </form>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Create account directly</h2>
      <p style={{ color: "#4b5563", marginBottom: "1rem", fontSize: "0.95rem" }}>
        Create a sign-in account with a random password. Share the password with the student
        securely — it is shown only once.
      </p>

      <form action={createAction} className="auth-form" style={{ marginBottom: "2rem" }}>
        <label>
          Student email
          <input type="email" name="email" required placeholder="student@gmail.com" />
        </label>
        {createState?.error && <p className="auth-error">{createState.error}</p>}
        {createState?.success && createState.email && createState.password && (
          <div
            className="auth-success"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 8,
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
            }}
          >
            <p style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>Account created</p>
            <p style={{ margin: "0 0 0.25rem", fontSize: "0.9rem" }}>
              Email: <code>{createState.email}</code>
            </p>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              Password: <code>{createState.password}</code>
            </p>
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={createPending}>
          {createPending ? "Creating…" : "Create account"}
        </button>
      </form>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Enrolled / invited</h2>
      {invites.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No invites yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {invites.map((row) => (
            <li
              key={row.id}
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                padding: "0.75rem 0",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{row.email}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  {row.user_id || row.joined_at ? "Joined" : "Invited"} ·{" "}
                  {new Date(row.invited_at).toLocaleString()}
                </div>
              </div>
              <form action={removeInvite}>
                <input type="hidden" name="id" value={row.id} />
                <button
                  type="submit"
                  style={{
                    border: "1px solid #fecaca",
                    background: "#fff1f2",
                    color: "#b91c1c",
                    borderRadius: 6,
                    padding: "0.35rem 0.7rem",
                    cursor: "pointer",
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
  );
}
