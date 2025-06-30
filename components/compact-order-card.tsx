"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Edit3, Play, Pause, Square, Eye, Calendar, TreePine, Package } from "lucide-react"
import type { Order } from "@/data/sample-data"
import { useRouter } from "next/navigation"
import { cn, formatShortDate } from "@/lib/utils"

interface CompactOrderCardProps {
  order: Order
  isDraggable?: boolean
  onEdit?: (orderId: string) => void
  onDelete?: (orderId: string) => void
  onStatusChange?: (orderId: string, newStatus: Order["status"]) => void
}

export function CompactOrderCard({
  order,
  isDraggable = true,
  onEdit,
  onDelete,
  onStatusChange,
}: CompactOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id,
    disabled: !isDraggable,
  })

  const router = useRouter()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  const statusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "Active":
        return "success"
      case "Pending":
        return "warning"
      case "Completed":
        return "default"
      case "Archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  const handleViewDetails = () => {
    router.push(`/order/${order.id}`)
  }

  // Mock sorts data - in real app this would come from order.sorts
  const sortsCount = Math.floor(Math.random() * 5) + 1
  const mockSorts = Array.from({ length: sortsCount }, (_, i) => `Sort ${i + 1}`).join(", ")

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("overflow-hidden shadow-sm hover:shadow-md transition-shadow", isDraggable && "cursor-grab")}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          {isDraggable && (
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm flex-shrink-0"
            >
              <GripVertical className="h-4 w-4" />
              <span className="sr-only">Drag to reorder</span>
            </button>
          )}

          {/* Order ID & Name */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">{order.name}</h3>
              <Badge variant={statusBadgeVariant(order.status)} className="text-xs flex-shrink-0">
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">ID: {order.id}</p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0 flex-shrink-0">
            <Calendar className="h-3 w-3" />
            <span>{formatShortDate(order.productionDate)}</span>
          </div>

          {/* Species */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0 flex-shrink-0">
            <TreePine className="h-3 w-3" />
            <span className="truncate max-w-[100px]" title={order.species.join(", ")}>
              {order.species.join(", ")}
            </span>
          </div>

          {/* Sorts */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0 flex-shrink-0">
            <Package className="h-3 w-3" />
            <span className="truncate max-w-[120px]" title={mockSorts}>
              {sortsCount} sort{sortsCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Volume */}
          <div className="text-xs text-muted-foreground flex-shrink-0">
            <span className="font-medium">{order.targetVolume || "N/A"}</span>
            {order.targetVolume && <span className="ml-1">m³</span>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={handleViewDetails} className="h-7 px-2">
              <Eye className="h-3 w-3" />
            </Button>
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(order.id)} className="h-7 px-2">
                <Edit3 className="h-3 w-3" />
              </Button>
            )}
            {order.status === "Pending" && onStatusChange && (
              <Button variant="ghost" size="sm" onClick={() => onStatusChange(order.id, "Active")} className="h-7 px-2">
                <Play className="h-3 w-3" />
              </Button>
            )}
            {order.status === "Active" && onStatusChange && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStatusChange(order.id, "Pending")}
                  className="h-7 px-2"
                >
                  <Pause className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStatusChange(order.id, "Completed")}
                  className="h-7 px-2"
                >
                  <Square className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
