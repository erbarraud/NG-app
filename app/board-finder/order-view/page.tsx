import { DashboardShell } from "@/components/dashboard-shell"
import { ZoomProvider } from "@/contexts/zoom-context"

export default function OrderViewPage() {
  return (
    <DashboardShell>
      <ZoomProvider>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold tracking-tight">Order View</h1>
          <p className="text-muted-foreground">
            This is a placeholder for the order view page. It will display all boards in a specific order.
          </p>
        </div>
      </ZoomProvider>
    </DashboardShell>
  )
}
