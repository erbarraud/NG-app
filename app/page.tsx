import { Suspense } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardOverview } from "@/components/dashboard-overview"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { LAYOUT, TYPOGRAPHY } from "@/lib/design-system"
import { cn } from "@/lib/utils"

/**
 * Main Dashboard Page
 *
 * Entry point for the Neural Grader Dashboard application.
 * Displays key metrics, recent activity, and quick actions.
 */
export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className={cn(LAYOUT.patterns.page)}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={cn(TYPOGRAPHY.styles.h1, "mb-2")}>Neural Grader Dashboard</h1>
          <p className={cn(TYPOGRAPHY.styles.caption)}>
            Monitor lumber grading operations, track performance, and manage quality control
          </p>
        </div>

        {/* Main Dashboard Content */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner text="Loading dashboard..." />
            </div>
          }
        >
          <DashboardOverview />
        </Suspense>
      </div>
    </DashboardShell>
  )
}
