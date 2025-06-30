import { DashboardShell } from "@/components/dashboard-shell"
import { UserManagement } from "@/components/user-management"

export default function UsersPage() {
  return (
    <DashboardShell>
      <UserManagement />
    </DashboardShell>
  )
}
