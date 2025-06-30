import { DashboardShell } from "@/components/dashboard-shell"
import { ProductionOrdersView } from "@/components/production-orders-view"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function BatchesPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Production Orders</h1>
        <Link href="/orders/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule New Order
          </Button>
        </Link>
      </div>
      <ProductionOrdersView />
    </DashboardShell>
  )
}
