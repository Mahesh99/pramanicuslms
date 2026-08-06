import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Sign-in failed</h1>
        <p className="auth-sub">
          The authentication link was invalid or expired. Please try again.
        </p>
        <Link href="/" className="btn-primary" style={{ display: "inline-block", textAlign: "center" }}>
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
