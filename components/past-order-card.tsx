"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  CalendarCheck2,
  TreePine,
  Thermometer,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { Order } from "@/data/sample-data"
import { OrderKpiDisplay } from "./order-kpi-display"
import { formatShortDateTime } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PastOrderCardProps {
  order: Order
}

export function PastOrderCard({ order }: PastOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = () => {
    switch (order.status) {
      case "Completed":
        return <CheckCircle className="mr-1.5 h-4 w-4 text-green-600" />
      case "Cancelled":
        return <XCircle className="mr-1.5 h-4 w-4 text-red-600" />
      case "Interrupted":
        return <AlertTriangle className="mr-1.5 h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusVariant = (): "success" | "destructive" | "warning" | "outline" => {
    switch (order.status) {
      case "Completed":
        return "success"
      case "Cancelled":
        return "destructive"
      case "Interrupted":
        return "warning"
      default:
        return "outline"
    }
  }

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="p-3 bg-muted/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">{order.name}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground truncate">
              ID:{" "}
              <Link href={`/order/${order.id}`} className="hover:underline text-primary">
                {order.id}
              </Link>{" "}
              | Customer: {order.customer || "N/A"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 px-2 text-xs hover:bg-muted/50"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Details
                </>
              )}
            </Button>
            <Badge variant={getStatusVariant()} className="capitalize text-xs whitespace-nowrap">
              {getStatusIcon()}
              {order.status}
            </Badge>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-1">
            <CalendarCheck2 className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Completed:</span>
            <span>
              {order.endTime ? formatShortDateTime(order.endTime) : formatShortDateTime(order.productionDate)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TreePine className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Species:</span>
            <span className="truncate max-w-[120px]" title={order.species.join(", ")}>
              {order.species.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Dry:</span>
            <span>{order.dryStatus}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {isExpanded && (
          <div className="pt-3 border-t">
            <OrderKpiDisplay kpis={order.kpis} type="completed" />
          </div>
        )}
        {order.notes && (
          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground italic">
            <strong>Notes:</strong> {order.notes}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
