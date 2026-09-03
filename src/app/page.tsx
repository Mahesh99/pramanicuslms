import { redirect } from "next/navigation";
import { ClassroomLoginShell } from "@/components/ClassroomLoginShell";
import { LoginForm } from "@/components/LoginForm";
import { ensureAnyEnrollmentClaimed } from "@/lib/auth";

function NotEnrolledPanel({ email }: { email: string }) {
  return (
    <div className="auth-card auth-card--flat">
      <h1>Access pending</h1>
      <p className="auth-sub">
        You&apos;re signed in as <strong>{email}</strong>, but this email has not been invited to
        the course yet.
      </p>
      <p className="auth-notice" role="status">
        Contact your instructor at Pramanicus Academy to request access, then sign in again with
        the invited email.
      </p>
      <form action="/auth/signout" method="post">
        <button type="submit" className="btn-primary">
          Sign out
        </button>
      </form>
    </div>
  );
}

export default async function HomePage() {
  const { user, enrolled } = await ensureAnyEnrollmentClaimed();

  if (user && enrolled) {
    redirect("/dashboard");
  }

  return (
    <ClassroomLoginShell>
      {user ? <NotEnrolledPanel email={user.email ?? ""} /> : <LoginForm />}
    </ClassroomLoginShell>
  );
}
