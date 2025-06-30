"use client"

import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Orders } from "@/components/orders" // Component to display the list of orders
import { CreateOrderForm } from "@/components/create-order-form" // The inline form
import type { OrderFormValues } from "@/lib/data/order-form-data"
import { useToast } from "@/components/ui/use-toast"

// This component acts as the main content for the Orders page
export function OrdersPageContent() {
  // State to manage whether the list or the create form is visible
  const [currentView, setCurrentView] = useState<"list" | "createForm">("list")
  const { toast } = useToast()

  const handleShowCreateForm = () => {
    setCurrentView("createForm") // Switch view to show the form
  }

  const handleCancelCreateForm = () => {
    setCurrentView("list") // Switch view back to the list
  }

  const handleFormSubmitSuccess = (data: OrderFormValues) => {
    console.log("New order submitted from page context:", data)
    toast({
      title: "Order Scheduled Successfully!",
      description: `Order ID: ${data.orderId} has been scheduled.`,
    })
    // In a real app, you might re-fetch orders or update a shared state
    setCurrentView("list") // Return to the list view after successful submission
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Conditional rendering based on the currentView state */}
      {currentView === "list" && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Production Orders</h1>
              <p className="text-muted-foreground">Manage and track your ongoing and upcoming orders.</p>
            </div>
            {/* Button is visible at the top when viewing the list of orders */}
            <Button size="lg" onClick={handleShowCreateForm}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Schedule New Order
            </Button>
          </div>
          <Orders /> {/* The component that lists existing orders */}
        </>
      )}

      {currentView === "createForm" && (
        <div>
          <div className="mb-8">
            <Button variant="outline" onClick={handleCancelCreateForm} className="mb-6">
              &larr; Back to Orders List
            </Button>
            <header>
              {/* The new inline section is labeled "Create New Order" */}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create New Order</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Fill in the details below to schedule a new production order.
              </p>
            </header>
            <Separator className="my-8" />
          </div>
          {/* The CreateOrderForm is displayed inline, not in a modal */}
          <CreateOrderForm
            isPageContext={true} // Ensures form renders for inline page display
            onFormSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleCancelCreateForm}
          />
        </div>
      )}
    </div>
  )
}
