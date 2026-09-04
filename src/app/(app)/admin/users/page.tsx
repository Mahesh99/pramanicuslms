import { AdminUsersList } from "@/components/AdminUsersList";
import { loadAdminUsers } from "@/lib/admin-users";

export default async function AdminUsersPage() {
  const users = await loadAdminUsers();
  return <AdminUsersList users={users} />;
}
