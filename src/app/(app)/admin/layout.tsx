import { redirect } from "next/navigation";
import { AdminTabsClient } from "@/components/AdminTabsClient";
import { getSessionUser, isAdminEmail } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getSessionUser();
  if (!user) redirect("/?next=/admin");
  if (!isAdminEmail(user.email)) redirect("/dashboard");

  return (
    <>
      <header className="site-header">
        <h1>Admin</h1>
        <p className="subtitle">Invite students, manage users, and courses</p>
      </header>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <AdminTabsClient />
        {children}
      </div>
    </>
  );
}
