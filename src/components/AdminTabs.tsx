import Link from "next/link";

const TABS = [
  { href: "/admin", label: "Invite", match: (p: string) => p === "/admin" || p === "/admin/invites" },
  { href: "/admin/users", label: "Users", match: (p: string) => p.startsWith("/admin/users") },
  { href: "/admin/courses", label: "Courses", match: (p: string) => p.startsWith("/admin/courses") },
] as const;

export function AdminTabs({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Admin sections"
      style={{
        display: "flex",
        gap: "0.25rem",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "1.75rem",
      }}
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: "0.65rem 1rem",
              marginBottom: -1,
              borderBottom: active ? "2px solid #111827" : "2px solid transparent",
              color: active ? "#111827" : "#6b7280",
              fontWeight: active ? 600 : 500,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
