import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { ensureEnrollmentClaimed } from "@/lib/auth";

export default async function ProfilePage() {
  const { user, enrolled } = await ensureEnrollmentClaimed();
  if (!user) redirect("/?next=/profile");
  if (!enrolled) redirect("/?denied=1");

  return (
    <>
      <header className="site-header">
        <h1>Account</h1>
        <p className="subtitle">Manage your sign-in details</p>
      </header>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <p style={{ color: "#4b5563", marginBottom: "1.5rem" }}>
          Signed in as <strong>{user.email}</strong>
        </p>

        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Change password</h2>
        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1rem" }}>
          Choose a new password for your classroom account.
        </p>
        <ChangePasswordForm />
      </div>
    </>
  );
}
