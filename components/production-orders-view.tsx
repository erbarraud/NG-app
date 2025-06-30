"use client"

import { useState, useMemo, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { sampleOrders, type Order, type OrderStatus } from "@/data/sample-data"
import { RunningOrderCard } from "./running-order-card"
import { CompactUpcomingOrderCard } from "./compact-upcoming-order-card"
import { CompactPastOrderCard } from "./compact-past-order-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import type { DateRange } from "react-day-picker"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateOrderForm } from "./create-order-form"

export function ProductionOrdersView() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const { toast } = useToast()

  const [pastOrderSearchTerm, setPastOrderSearchTerm] = useState("")
  const [pastOrderStatusFilter, setPastOrderStatusFilter] = useState<OrderStatus | "all">("all")
  const [pastOrderSpeciesFilter, setPastOrderSpeciesFilter] = useState<string>("all")
  const [pastOrderDateRange, setPastOrderDateRange] = useState<DateRange | undefined>(undefined)

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmDialogContent, setConfirmDialogContent] = useState({ title: "", description: "", onConfirm: () => {} })

  const [showRepeatOrderModal, setShowRepeatOrderModal] = useState(false)
  const [orderToRepeat, setOrderToRepeat] = useState<Order | null>(null)

  const runningOrder = useMemo(() => orders.find((o) => o.status === "Running"), [orders])
  const upcomingOrders = useMemo(
    () =>
      orders
        .filter((o) => o.status === "Scheduled" || o.status === "Paused")
        .sort((a, b) => (a.priority || 0) - (b.priority || 0)),
    [orders],
  )
  const pastOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === "Completed" || o.status === "Cancelled" || o.status === "Interrupted")
      .filter((order) => {
        const matchesSearch =
          pastOrderSearchTerm === "" ||
          order.name.toLowerCase().includes(pastOrderSearchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(pastOrderSearchTerm.toLowerCase()) ||
          (order.customer && order.customer.toLowerCase().includes(pastOrderSearchTerm.toLowerCase()))

        const matchesStatus = pastOrderStatusFilter === "all" || order.status === pastOrderStatusFilter

        const matchesSpecies =
          pastOrderSpeciesFilter === "all" ||
          order.species.some((s) => s.toLowerCase() === pastOrderSpeciesFilter.toLowerCase())

        const orderProdDate = new Date(order.productionDate)
        const matchesDate =
          !pastOrderDateRange ||
          !pastOrderDateRange.from ||
          (orderProdDate >= pastOrderDateRange.from &&
            (!pastOrderDateRange.to || orderProdDate <= pastOrderDateRange.to))

        return matchesSearch && matchesStatus && matchesSpecies && matchesDate
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [orders, pastOrderSearchTerm, pastOrderStatusFilter, pastOrderSpeciesFilter, pastOrderDateRange])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleUpcomingDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        setOrders((items) => {
          const oldList = items.filter((o) => o.status === "Scheduled" || o.status === "Paused")
          const newList = items.filter((o) => o.status !== "Scheduled" && o.status !== "Paused")

          const oldIndex = oldList.findIndex((item) => item.id === active.id)
          const newIndex = oldList.findIndex((item) => item.id === over.id)
          const reorderedUpcoming = arrayMove(oldList, oldIndex, newIndex).map((item, index) => ({
            ...item,
            priority: index + 1,
          }))

          return [...newList, ...reorderedUpcoming]
        })
        toast({ title: "Order Priority Updated", description: "Upcoming orders reordered." })
      }
    },
    [toast],
  )

  const openConfirmation = (title: string, description: string, onConfirm: () => void) => {
    setConfirmDialogContent({ title, description, onConfirm })
    setShowConfirmDialog(true)
  }

  const handleUpdateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus, extraUpdates: Partial<Order> = {}) => {
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString(), ...extraUpdates } : o,
        ),
      )
      toast({ title: `Order ${orderId} status updated to ${newStatus}` })
    },
    [toast],
  )

  const handleStopRunningOrder = (orderId: string) => {
    openConfirmation(
      "Stop Order?",
      `Are you sure you want to stop order ${orderId}? This will mark it as Completed.`,
      () =>
        handleUpdateOrderStatus(orderId, "Completed", {
          endTime: new Date().toISOString(),
          progress: {
            ...runningOrder?.progress,
            percentageComplete: 100,
            currentStatusMessage: "Stopped and completed by operator",
          },
        }),
    )
  }

  const handleRunNowUpcoming = (orderId: string) => {
    if (runningOrder) {
      toast({
        title: "Cannot Start Order",
        description: `Order ${runningOrder.id} is already running. Please stop or complete it first.`,
        variant: "destructive",
      })
      return
    }
    openConfirmation("Run Order Now?", `Are you sure you want to start order ${orderId} immediately?`, () =>
      handleUpdateOrderStatus(orderId, "Running", {
        startTime: new Date().toISOString(),
        progress: {
          boardsScanned: 0,
          bundlesCreated: 0,
          percentageComplete: 0,
          currentStatusMessage: "Starting up...",
        },
      }),
    )
  }
  const handleEditUpcoming = (orderId: string) => {
    toast({ title: "Edit Order (Not Implemented)", description: `Triggered edit for order ${orderId}.` })
  }
  const handleCancelUpcoming = (orderId: string) => {
    openConfirmation("Cancel Upcoming Order?", `Are you sure you want to cancel scheduled order ${orderId}?`, () =>
      handleUpdateOrderStatus(orderId, "Cancelled", { notes: "Cancelled before starting by operator." }),
    )
  }

  const handleRepeatOrder = (order: Order) => {
    setOrderToRepeat(order)
    setShowRepeatOrderModal(true)
  }

  const handleRepeatOrderSubmit = (newOrderData: Partial<Order>) => {
    if (!orderToRepeat) return

    const newOrder: Order = {
      ...orderToRepeat,
      ...newOrderData,
      id: `ORD-${Date.now()}`,
      status: "Scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startTime: undefined,
      endTime: undefined,
      progress: undefined,
      kpis: undefined,
      notes: `Repeated from order ${orderToRepeat.id}`,
    }

    setOrders((prev) => [newOrder, ...prev])
    setShowRepeatOrderModal(false)
    setOrderToRepeat(null)
    toast({
      title: "Order Repeated Successfully",
      description: `New order ${newOrder.id} has been created and scheduled.`,
    })
  }

  const uniqueSpecies = useMemo(() => {
    const allSpecies = orders.flatMap((o) => o.species)
    return [...new Set(allSpecies)].sort()
  }, [orders])

  const currentOrdersCount = (runningOrder ? 1 : 0) + upcomingOrders.length
  const pastOrdersCount = pastOrders.length

  return (
    <div className="space-y-6">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Orders ({currentOrdersCount})</TabsTrigger>
          <TabsTrigger value="past">Past Orders ({pastOrdersCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-primary flex items-center">Running Order</h2>
            {runningOrder ? (
              <RunningOrderCard order={runningOrder} onStop={() => handleStopRunningOrder(runningOrder.id)} />
            ) : (
              <div className="text-center py-8 px-4 bg-muted rounded-lg">
                <p className="text-muted-foreground text-lg">No order is currently running.</p>
                {upcomingOrders.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Select an upcoming order and click "Run Now" to start.
                  </p>
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Upcoming Orders ({upcomingOrders.length})</h2>
            {upcomingOrders.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleUpcomingDragEnd}>
                <SortableContext items={upcomingOrders.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {upcomingOrders.map((order) => (
                      <CompactUpcomingOrderCard
                        key={order.id}
                        order={order}
                        onRunNow={() => handleRunNowUpcoming(order.id)}
                        onEdit={() => handleEditUpcoming(order.id)}
                        onCancel={() => handleCancelUpcoming(order.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <p className="text-muted-foreground text-center py-4">No orders scheduled or paused.</p>
            )}
          </section>
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-semibold">Past Orders ({pastOrders.length})</h2>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50 space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by ID, Name, Customer..."
                    value={pastOrderSearchTerm}
                    onChange={(e) => setPastOrderSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select
                  value={pastOrderStatusFilter}
                  onValueChange={(value) => setPastOrderStatusFilter(value as OrderStatus | "all")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Interrupted">Interrupted</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={pastOrderSpeciesFilter}
                  onValueChange={(value) => setPastOrderSpeciesFilter(value as string)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Species</SelectItem>
                    {uniqueSpecies.map((specie) => (
                      <SelectItem key={specie} value={specie}>
                        {specie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DatePickerWithRange
                  date={pastOrderDateRange}
                  onDateChange={setPastOrderDateRange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-start">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPastOrderSearchTerm("")
                    setPastOrderStatusFilter("all")
                    setPastOrderSpeciesFilter("all")
                    setPastOrderDateRange(undefined)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {pastOrders.length > 0 ? (
              <div className="space-y-2">
                {pastOrders.map((order) => (
                  <CompactPastOrderCard key={order.id} order={order} onRepeatOrder={handleRepeatOrder} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No past orders match your filters.</p>
            )}
          </section>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialogContent.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmDialogContent.onConfirm()
                setShowConfirmDialog(false)
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showRepeatOrderModal} onOpenChange={setShowRepeatOrderModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Repeat Order: {orderToRepeat?.name}</DialogTitle>
            <DialogDescription>
              Create a new order based on the configuration of order {orderToRepeat?.id}. You can modify the details
              before scheduling.
            </DialogDescription>
          </DialogHeader>
          {orderToRepeat && (
            <CreateOrderForm
              initialData={{
                name: `${orderToRepeat.name} (Copy)`,
                customer: orderToRepeat.customer,
                species: orderToRepeat.species,
                productionDate: new Date().toISOString().split("T")[0],
                targetVolume: orderToRepeat.targetVolume,
                priority: orderToRepeat.priority,
                notes: `Repeated from order ${orderToRepeat.id}`,
              }}
              onSubmit={handleRepeatOrderSubmit}
              onCancel={() => setShowRepeatOrderModal(false)}
              submitButtonText="Schedule Repeated Order"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
