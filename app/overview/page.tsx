import { Suspense } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardOverview } from "@/components/dashboard-overview"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { LAYOUT, TYPOGRAPHY } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export default function OverviewPage() {
  return (
    <DashboardShell>
      <div className={cn(LAYOUT.patterns.page)}>
        <div className="mb-8">
          <h1 className={cn(TYPOGRAPHY.styles.h1, "mb-2")}>Overview</h1>
          <p className={cn(TYPOGRAPHY.styles.caption)}>Key metrics and operational status at a glance.</p>
        </div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner text="Loading overview..." />
            </div>
          }
        >
          <DashboardOverview />
        </Suspense>
      </div>
    </DashboardShell>
  )
}
