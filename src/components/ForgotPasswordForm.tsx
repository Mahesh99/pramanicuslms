"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { authCallbackUrl } from "@/lib/auth-redirect";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: authCallbackUrl("/auth/reset-password"),
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }

    setMessage("Check your email for a password reset link. It expires in about an hour.");
  }

  return (
    <div className="auth-card auth-card--flat">
      <h1>Reset password</h1>
      <p className="auth-sub">
        Enter your account email. We&apos;ll send a link to choose a new password.
      </p>

      <form onSubmit={onSubmit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="auth-footer">
        <Link href="/">Back to sign in</Link>
      </p>
    </div>
  );
}
