"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Edit3, Trash2, Play, Pause, Square, Eye } from "lucide-react"
import type { Order } from "@/data/sample-data" // Assuming Order type is here
import { useRouter } from "next/navigation"
import { cn, formatShortDate } from "@/lib/utils"

interface SortableOrderCardProps {
  order: Order
  isDraggable?: boolean
  onEdit?: (orderId: string) => void
  onDelete?: (orderId: string) => void
  onStatusChange?: (orderId: string, newStatus: Order["status"]) => void
}

export function SortableOrderCard({
  order,
  isDraggable = true,
  onEdit,
  onDelete,
  onStatusChange,
}: SortableOrderCardProps) {
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("overflow-hidden shadow-sm hover:shadow-md transition-shadow", isDraggable && "cursor-grab")}
    >
      <CardHeader className="p-4 border-b bg-muted/30">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-grow">
            <CardTitle className="text-lg font-semibold flex items-center">
              {isDraggable && (
                <button
                  {...attributes}
                  {...listeners}
                  className="mr-2 p-1 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  <GripVertical className="h-5 w-5" />
                  <span className="sr-only">Drag to reorder</span>
                </button>
              )}
              <span className="truncate" title={order.name}>
                {order.name}
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              ID: {order.id} | Customer: {order.customer || "N/A"}
            </CardDescription>
          </div>
          <Badge variant={statusBadgeVariant(order.status)} className="capitalize text-xs whitespace-nowrap">
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="font-medium text-muted-foreground">Species</p>
          <p className="truncate" title={order.species.join(", ")}>
            {order.species.join(", ") || "N/A"}
          </p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Dry Status</p>
          <p>{order.dryStatus || "N/A"}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Production Date</p>
          <p>{order.productionDate ? formatShortDate(order.productionDate) : "N/A"}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Total Boards</p>
          <p>{order.totalBoards ?? "N/A"}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Target Volume</p>
          <p>{order.targetVolume ? `${order.targetVolume} m³` : "N/A"}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Operator</p>
          <p>{order.operator || "N/A"}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-wrap items-center justify-end gap-2 bg-muted/30">
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          View
        </Button>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(order.id)}>
            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
        )}
        {order.status === "Pending" && onStatusChange && (
          <Button variant="success" size="sm" onClick={() => onStatusChange(order.id, "Active")}>
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Start
          </Button>
        )}
        {order.status === "Active" && onStatusChange && (
          <>
            <Button variant="warning" size="sm" onClick={() => onStatusChange(order.id, "Pending")}>
              <Pause className="mr-1.5 h-3.5 w-3.5" />
              Pause
            </Button>
            <Button variant="destructiveOutline" size="sm" onClick={() => onStatusChange(order.id, "Completed")}>
              <Square className="mr-1.5 h-3.5 w-3.5" />
              Complete
            </Button>
          </>
        )}
        {onDelete && (
          <Button variant="destructiveOutline" size="sm" onClick={() => onDelete(order.id)}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
