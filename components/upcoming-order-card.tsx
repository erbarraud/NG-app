"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Edit3, Play, Slash, CalendarClock, TreePine, Thermometer, PauseCircle } from "lucide-react"
import type { Order } from "@/data/sample-data"
import { OrderKpiDisplay } from "./order-kpi-display"
import { cn } from "@/lib/utils"
import { formatShortDateTime } from "@/lib/utils"

interface UpcomingOrderCardProps {
  order: Order
  onRunNow: () => void
  onEdit: () => void
  onCancel: () => void
}

export function UpcomingOrderCard({ order, onRunNow, onEdit, onCancel }: UpcomingOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  const isPaused = order.status === "Paused"

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        isPaused && "border-yellow-500/50 bg-yellow-500/5",
      )}
    >
      <CardHeader className="p-4 border-b bg-muted/30">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-grow flex items-center">
            <button
              {...attributes}
              {...listeners}
              className="mr-2 p-1 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div>
              <CardTitle className="text-lg font-semibold">{order.name}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                ID: {order.id} | Customer: {order.customer || "N/A"}
              </CardDescription>
            </div>
          </div>
          <Badge variant={isPaused ? "warning" : "outline"} className="capitalize text-xs whitespace-nowrap">
            {isPaused ? <PauseCircle className="mr-1.5 h-3 w-3" /> : <CalendarClock className="mr-1.5 h-3 w-3" />}
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-sm">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="font-medium text-xs text-muted-foreground">Scheduled</p>
            <p>{formatShortDateTime(`${order.productionDate}T${order.productionTime || "00:00"}`)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TreePine className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="font-medium text-xs text-muted-foreground">Species</p>
            <p className="truncate" title={order.species.join(", ")}>
              {order.species.join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="font-medium text-xs text-muted-foreground">Dry Status</p>
            <p>{order.dryStatus}</p>
          </div>
        </div>
        <div className="col-span-full sm:col-span-2 md:col-span-3">
          <OrderKpiDisplay kpis={order.kpis} type="scheduled" />
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t flex flex-wrap items-center justify-end gap-2 bg-muted/30">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit3 className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
        <Button variant="destructiveOutline" size="sm" onClick={onCancel}>
          <Slash className="mr-1.5 h-3.5 w-3.5" />
          Cancel
        </Button>
        <Button variant="success" size="sm" onClick={onRunNow}>
          <Play className="mr-1.5 h-3.5 w-3.5" />
          {isPaused ? "Resume Now" : "Run Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
