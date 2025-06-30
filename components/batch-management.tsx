"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Orders } from "@/components/orders" // Assuming Orders is the renamed SortingOrders
import { CreateOrderForm } from "@/components/create-order-form"
import type { OrderFormValues } from "@/lib/data/order-form-data" // Ensure this path is correct

// Mock data or fetching logic for orders would be here
// For now, let's assume Orders component handles its own data or receives it as props.
const sampleOrders = [
  // ... your sample orders data
]

export default function BatchManagement() {
  const [view, setView] = useState<"list" | "createForm">("list")

  const handleFormCancel = () => {
    setView("list")
  }

  const handleFormSubmitSuccess = (data: OrderFormValues) => {
    console.log("New order created from page context:", data)
    // Potentially refresh the list of orders or navigate
    setView("list")
    // Add a toast message here if desired
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {view === "list" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <Button onClick={() => setView("createForm")}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Schedule New Order
            </Button>
          </div>
          {/* Replace with your actual Orders component and its props */}
          <Orders orders={sampleOrders} />
        </>
      )}

      {view === "createForm" && (
        <div>
          <div className="mb-6">
            <Button variant="outline" onClick={() => setView("list")} className="mb-4">
              &larr; Back to Orders List
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Schedule New Order</h1>
            <p className="text-muted-foreground mt-1">Fill in the details below to create a new production order.</p>
          </div>
          <CreateOrderForm
            isPageContext={true}
            onFormSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  )
}
