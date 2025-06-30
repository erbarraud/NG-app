"use client"

import type React from "react"
import type { OrderKpis } from "@/data/sample-data"
import { BarChart3, Box, Percent, Scissors, ThumbsDown, Timer, TimerOff } from "lucide-react"

interface OrderKpiDisplayProps {
  kpis?: OrderKpis
  type: "running" | "scheduled" | "completed"
}

const KpiItem: React.FC<{
  icon: React.ReactNode
  label: string
  value?: string | number | null
  unit?: string
  highlight?: boolean
}> = ({ icon, label, value, unit, highlight }) => {
  if (value === undefined || value === null || value === "") return null // Also check for empty string
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-background border">
      <div
        className={`p-1.5 rounded-md ${highlight ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
      >
        {icon}
      </div>
      <div>
        <p className={`text-xs ${highlight ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
        <p className={`text-sm font-semibold ${highlight ? "text-foreground" : "text-foreground"}`}>
          {value} {unit || ""}
        </p>
      </div>
    </div>
  )
}

export function OrderKpiDisplay({ kpis, type }: OrderKpiDisplayProps) {
  if (!kpis) return null

  const kpiItems = []

  if (type === "running") {
    if (kpis.totalBoardsScanned !== undefined)
      kpiItems.push(
        <KpiItem
          key="rbs"
          icon={<BarChart3 size={16} />}
          label="Boards Scanned"
          value={kpis.totalBoardsScanned}
          highlight
        />,
      )
    if (kpis.bundlesCreated !== undefined)
      kpiItems.push(
        <KpiItem key="rbc" icon={<Box size={16} />} label="Bundles Created" value={kpis.bundlesCreated} highlight />,
      )
    if (kpis.timeElapsed)
      kpiItems.push(<KpiItem key="rte" icon={<Timer size={16} />} label="Time Elapsed" value={kpis.timeElapsed} />)
    if (kpis.estimatedTimeRemaining)
      kpiItems.push(
        <KpiItem
          key="rtr"
          icon={<TimerOff size={16} />}
          label="Time Remaining (Est.)"
          value={kpis.estimatedTimeRemaining}
        />,
      )
  } else if (type === "scheduled") {
    if (kpis.estimatedDuration)
      kpiItems.push(
        <KpiItem key="sed" icon={<Timer size={16} />} label="Est. Duration" value={kpis.estimatedDuration} />,
      )
    if (kpis.totalBoardsScanned !== undefined && kpis.totalBoardsScanned > 0)
      // Only show if there's a target
      kpiItems.push(
        <KpiItem
          key="stb"
          icon={<BarChart3 size={16} />}
          label="Target Boards (Est.)"
          value={kpis.totalBoardsScanned}
        />,
      )
    if (kpis.bundlesCreated !== undefined && kpis.bundlesCreated > 0)
      // Only show if there's a target
      kpiItems.push(
        <KpiItem key="sbc" icon={<Box size={16} />} label="Target Bundles (Est.)" value={kpis.bundlesCreated} />,
      )
  } else if (type === "completed") {
    if (kpis.totalBoardsScanned !== undefined)
      kpiItems.push(
        <KpiItem
          key="cbs"
          icon={<BarChart3 size={16} />}
          label="Total Boards Scanned"
          value={kpis.totalBoardsScanned}
          highlight
        />,
      )
    if (kpis.yieldAchieved !== undefined)
      kpiItems.push(
        <KpiItem
          key="cya"
          icon={<Percent size={16} />}
          label="Yield Achieved"
          value={kpis.yieldAchieved}
          unit="%"
          highlight
        />,
      )
    if (kpis.bundlesCreated !== undefined)
      kpiItems.push(<KpiItem key="cbc" icon={<Box size={16} />} label="Bundles Created" value={kpis.bundlesCreated} />)
    if (kpis.piecesCut !== undefined)
      kpiItems.push(<KpiItem key="cpc" icon={<Scissors size={16} />} label="Pieces Cut" value={kpis.piecesCut} />)
    if (kpis.rejectedBoards !== undefined)
      kpiItems.push(
        <KpiItem key="crb" icon={<ThumbsDown size={16} />} label="Rejected Boards" value={kpis.rejectedBoards} />,
      )
    if (kpis.actualDuration)
      kpiItems.push(
        <KpiItem key="cad" icon={<Timer size={16} />} label="Actual Duration" value={kpis.actualDuration} />,
      )
    if (kpis.estimatedDuration)
      kpiItems.push(
        <KpiItem key="ced" icon={<TimerOff size={16} />} label="Est. Duration" value={kpis.estimatedDuration} />,
      )
  }

  if (kpiItems.length === 0) return null

  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-muted-foreground mb-1.5">Key Performance Indicators:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">{kpiItems}</div>
    </div>
  )
}
