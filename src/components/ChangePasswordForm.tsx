"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/auth";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return changePassword(formData);
    },
    null,
  );

  return (
    <form action={action} className="auth-form">
      <label>
        New password
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </label>
      <label>
        Confirm password
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </label>
      {state?.error && <p className="auth-error">{state.error}</p>}
      {state?.success && <p className="auth-success">Password updated.</p>}
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
