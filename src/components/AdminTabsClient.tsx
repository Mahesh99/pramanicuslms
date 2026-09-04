"use client";

import { usePathname } from "next/navigation";
import { AdminTabs } from "@/components/AdminTabs";

export function AdminTabsClient() {
  const pathname = usePathname() || "/admin";
  return <AdminTabs pathname={pathname} />;
}
