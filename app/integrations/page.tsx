import { DashboardShell } from "@/components/dashboard-shell"
import { IntegrationsApi } from "@/components/integrations-api"

export default function IntegrationsPage() {
  return (
    <DashboardShell>
      <IntegrationsApi />
    </DashboardShell>
  )
}
