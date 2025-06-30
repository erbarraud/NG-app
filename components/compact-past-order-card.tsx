"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Calendar,
  TreePine,
  Package,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { Order } from "@/data/sample-data"
import { useRouter } from "next/navigation"
import { formatShortDate } from "@/lib/utils"
import { useState } from "react"
import { OrderKpiDisplay } from "./order-kpi-display"
import Link from "next/link"

interface CompactPastOrderCardProps {
  order: Order
  onRepeatOrder: (order: Order) => void
}

export function CompactPastOrderCard({ order, onRepeatOrder }: CompactPastOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const getStatusIcon = () => {
    switch (order.status) {
      case "Completed":
        return <CheckCircle className="mr-1 h-3 w-3 text-green-600" />
      case "Cancelled":
        return <XCircle className="mr-1 h-3 w-3 text-red-600" />
      case "Interrupted":
        return <AlertTriangle className="mr-1 h-3 w-3 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusVariant = (): "default" | "destructive" | "warning" | "outline" => {
    switch (order.status) {
      case "Completed":
        return "default"
      case "Cancelled":
        return "destructive"
      case "Interrupted":
        return "warning"
      default:
        return "outline"
    }
  }

  const handleViewDetails = () => {
    router.push(`/order/${order.id}`)
  }

  const handleRepeatOrder = () => {
    onRepeatOrder(order)
  }

  // Mock sorts data - in real app this would come from order.sorts
  const sortsCount = Math.floor(Math.random() * 5) + 1

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          {/* Order ID & Name */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">{order.name}</h3>
              <Badge variant={getStatusVariant()} className="text-xs flex-shrink-0">
                {getStatusIcon()}
                {order.status}
              </Badge>
            </div>
            <Link href={`/order/${order.id}`} className="text-xs text-primary hover:underline">
              ID: {order.id}
            </Link>
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
            <span className="truncate max-w-[120px]">
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
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-7 px-2">
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleViewDetails} className="h-7 px-2">
              <Eye className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRepeatOrder} className="h-7 px-2" title="Repeat Order">
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Expanded KPI Section */}
        {isExpanded && order.kpis && (
          <div className="mt-3 pt-3 border-t">
            <OrderKpiDisplay kpis={order.kpis} type="completed" />
          </div>
        )}

        {/* Notes */}
        {isExpanded && order.notes && (
          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground italic">
            <strong>Notes:</strong> {order.notes}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
