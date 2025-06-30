import { CreateOrderForm } from "@/components/create-order-form"
import { Separator } from "@/components/ui/separator"
import { DashboardShell } from "@/components/dashboard-shell"

export default function NewOrderPage() {
  return (
    <DashboardShell>
      <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create New Production Order</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Fill in the details below to schedule a new order. You can link existing sort templates or define custom
            sorts specific to this order.
          </p>
        </header>
        <Separator className="mb-10" />

        <CreateOrderForm isPageContext={true} />
      </div>
    </DashboardShell>
  )
}
