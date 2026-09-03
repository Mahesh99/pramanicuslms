import Link from "next/link";
import { getNavSession, isAdminEmail } from "@/lib/auth";

export async function SiteHeader({
  active,
}: {
  active?: "home" | "dashboard" | "playground" | "admin" | "profile" | "login";
}) {
  const { user, enrolled, isAdmin } = await getNavSession();
  const homeHref = user ? "/dashboard" : "/";

  return (
    <nav className="topnav" aria-label="Main navigation">
      <div className="topnav-inner">
        <Link href={homeHref} className="topnav-logo">
          Pramanicus LMS
        </Link>
        {!user && (
          <Link href="/" className={active === "home" ? "active" : undefined}>
            Home
          </Link>
        )}
        {user && enrolled && (
          <>
            <Link href="/dashboard" className={active === "dashboard" ? "active" : undefined}>
              Courses
            </Link>
            <Link
              href="/playground"
              className={`topnav-playground${active === "playground" ? " active" : ""}`}
            >
              ▶ Playground
            </Link>
          </>
        )}
        {isAdmin && (
          <Link href="/admin" className={active === "admin" ? "active" : undefined}>
            Admin
          </Link>
        )}
        {user && enrolled && (
          <Link href="/profile" className={active === "profile" ? "active" : undefined}>
            Account
          </Link>
        )}
        <span style={{ flex: 1 }} />
        {user ? (
          <form action="/auth/signout" method="post" style={{ display: "inline" }}>
            <button
              type="submit"
              style={{
                background: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                padding: "0.35rem 0.75rem",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Sign out ({user.email})
            </button>
          </form>
        ) : (
          <Link href="/" className={active === "login" ? "active" : undefined}>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}

export function isAdminFromEmail(email?: string | null) {
  return isAdminEmail(email);
}
