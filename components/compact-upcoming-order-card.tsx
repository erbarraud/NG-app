"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Edit3, Play, Slash, CalendarClock, TreePine, Thermometer } from "lucide-react"
import type { Order } from "@/data/sample-data"
import { cn } from "@/lib/utils"
import { formatShortDateTime } from "@/lib/utils"

interface CompactUpcomingOrderCardProps {
  order: Order
  onRunNow: () => void
  onEdit: () => void
  onCancel: () => void
}

export function CompactUpcomingOrderCard({ order, onRunNow, onEdit, onCancel }: CompactUpcomingOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  const isScheduled = order.status === "Scheduled"

  return (
    <Card ref={setNodeRef} style={style} className={cn("overflow-hidden shadow-sm hover:shadow-md transition-shadow")}>
      <CardHeader className="p-3 border-b bg-muted/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-grab active:cursor-grabbing flex-shrink-0"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate">{order.name}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground truncate">
                ID: {order.id} | Customer: {order.customer || "N/A"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              <CalendarClock className="mr-1 h-3 w-3" />
              {order.status}
            </Badge>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="h-3 w-3" />
              </Button>
              {isScheduled && (
                <Button variant="destructiveOutline" size="sm" onClick={onCancel}>
                  <Slash className="h-3 w-3" />
                </Button>
              )}
              <Button variant="success" size="sm" onClick={onRunNow}>
                <Play className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span
              className="truncate"
              title={formatShortDateTime(`${order.productionDate}T${order.productionTime || "00:00"}`)}
            >
              {formatShortDateTime(`${order.productionDate}T${order.productionTime || "00:00"}`)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TreePine className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate" title={order.species.join(", ")}>
              {order.species.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{order.dryStatus}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
