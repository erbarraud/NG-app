"use client"

import { Separator } from "@/components/ui/separator"
import { useState, useMemo } from "react"
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
import { ChevronDown, ChevronUp, ListFilter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import type { DateRange } from "react-day-picker"

import { CompactOrderCard } from "./compact-order-card"
import { CompactPastOrderCard } from "./compact-past-order-card"
import { sampleOrders, type Order } from "@/data/sample-data"

type OrderStatus = "Active" | "Pending" | "Completed" | "Archived"

const statusFilters: OrderStatus[] = ["Active", "Pending", "Completed", "Archived"]
const speciesFilters = ["Soft Maple", "Hard Maple", "Oak", "Beech", "Walnut", "Spruce/Fir"]

// This component now solely displays the list and its filters.
// The button to trigger the new order form is managed by the parent page.
export function Orders() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<Set<OrderStatus>>(new Set(["Active", "Pending"]))
  const [selectedSpecies, setSelectedSpecies] = useState<Set<string>>(new Set())
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [showFilters, setShowFilters] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setOrders((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleRepeatOrder = (order: Order) => {
    // Create a copy of the order with new ID and reset status
    const newOrder: Order = {
      ...order,
      id: `ORD-${new Date().toISOString().slice(0, 10)}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      name: `${order.name} (Copy)`,
      status: "Pending",
      productionDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startTime: undefined,
      endTime: undefined,
      kpis: undefined,
      notes: undefined,
    }

    // Add the new order to the list
    setOrders((prev) => [newOrder, ...prev])

    // Here you would typically open the scheduling modal with pre-filled data
    console.log("Repeat order created:", newOrder)
  }

  const toggleStatusFilter = (status: OrderStatus) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(status)) {
        next.delete(status)
      } else {
        next.add(status)
      }
      return next
    })
  }

  const toggleSpeciesFilter = (species: string) => {
    setSelectedSpecies((prev) => {
      const next = new Set(prev)
      if (next.has(species)) {
        next.delete(species)
      } else {
        next.add(species)
      }
      return next
    })
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedStatuses(new Set(["Active", "Pending"]))
    setSelectedSpecies(new Set())
    setDateRange(undefined)
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearchTerm =
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(order.status as OrderStatus)
      const matchesSpecies = selectedSpecies.size === 0 || order.species.some((s) => selectedSpecies.has(s))
      const orderProdDate = new Date(order.productionDate)
      const matchesDate =
        !dateRange ||
        !dateRange.from ||
        (orderProdDate >= dateRange.from && (!dateRange.to || orderProdDate <= dateRange.to))

      return matchesSearchTerm && matchesStatus && matchesSpecies && matchesDate
    })
  }, [orders, searchTerm, selectedStatuses, selectedSpecies, dateRange])

  const activeOrders = filteredOrders.filter((order) => order.status === "Active" || order.status === "Pending")
  const pastOrders = filteredOrders.filter(
    (order) => order.status === "Completed" || order.status === "Cancelled" || order.status === "Interrupted",
  )

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <ListFilter className="mr-2 h-5 w-5" />
              Filter & Search Orders
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? "Hide Filters" : "Show Filters"}
              {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                placeholder="Search by Order ID, Name, Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:col-span-2 lg:col-span-1"
              />
              <div className="border p-2 rounded-md text-sm text-muted-foreground h-10 flex items-center">
                Date Range Picker (Placeholder)
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Status ({selectedStatuses.size || "Any"}) <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {statusFilters.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatuses.has(status)}
                      onCheckedChange={() => toggleStatusFilter(status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Species ({selectedSpecies.size || "Any"}) <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {speciesFilters.map((s) => (
                    <DropdownMenuCheckboxItem
                      key={s}
                      checked={selectedSpecies.has(s)}
                      onCheckedChange={() => toggleSpeciesFilter(s)}
                    >
                      {s}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={clearAllFilters} size="sm">
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Active & Pending Orders</h2>
      {activeOrders.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeOrders.map((o) => o.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {activeOrders.map((order) => (
                <CompactOrderCard key={order.id} order={order} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-muted-foreground text-center py-4">No active or pending orders match your filters.</p>
      )}

      <Separator className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">Past Orders</h2>
      {pastOrders.length > 0 ? (
        <div className="space-y-2">
          {pastOrders.map((order) => (
            <CompactPastOrderCard key={order.id} order={order} onRepeatOrder={handleRepeatOrder} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">No past orders match your filters.</p>
      )}
    </div>
  )
}
