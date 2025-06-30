"use client"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductionOrdersView } from "@/components/production-orders-view"
import { useRouter } from "next/navigation"

export default function OrdersPage() {
  const router = useRouter()

  const handleShowCreateForm = () => {
    router.push("/orders/new") // Navigates to your existing/new page for creating orders
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Orders</h1>
          <p className="text-muted-foreground">Monitor, manage, and interact with all production orders.</p>
        </div>
        <Button size="lg" onClick={handleShowCreateForm}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Schedule New Order
        </Button>
      </div>
      <ProductionOrdersView />
    </div>
  )
}
