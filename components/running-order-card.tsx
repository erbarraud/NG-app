"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, PlayCircle, Power, Tag, TreePine, Zap } from "lucide-react"
import type { Order } from "@/data/sample-data"
import { OrderKpiDisplay } from "./order-kpi-display"
import { formatShortDateTime } from "@/lib/utils"

interface RunningOrderCardProps {
  order: Order
  onStop: () => void
}

export function RunningOrderCard({ order, onStop }: RunningOrderCardProps) {
  return (
    <Card className="border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl text-primary">{order.name}</CardTitle>
              <CardDescription className="text-sm">
                ID: {order.id} | Customer: {order.customer || "N/A"}
              </CardDescription>
            </div>
          </div>
          <Badge variant="success" className="text-sm px-3 py-1 capitalize">
            <PlayCircle className="mr-1.5 h-4 w-4" />
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Species</p>
              <p className="text-muted-foreground">
                {order.species.join(", ")} ({order.dryStatus})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Scheduled Start</p>
              <p className="text-muted-foreground">
                {formatShortDateTime(`${order.productionDate}T${order.productionTime || "00:00"}`)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Operator</p>
              <p className="text-muted-foreground">{order.operator || "N/A"}</p>
            </div>
          </div>
        </div>

        <OrderKpiDisplay kpis={order.kpis} type="running" />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t">
        <Button onClick={onStop} variant="destructiveOutline" size="sm">
          <Power className="mr-2 h-4 w-4" /> Stop & Complete
        </Button>
      </CardFooter>
    </Card>
  )
}
