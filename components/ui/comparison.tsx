"use client"

import type React from "react"
import { memo } from "react"
import { cn } from "@/lib/utils"

interface ComparisonProps {
  title?: string
  children: React.ReactNode
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function Comparison({ title, children, orientation = "horizontal", className }: ComparisonProps) {
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="bg-muted px-4 py-2 border-b">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
      <div
        className={cn("grid gap-4 p-4", orientation === "horizontal" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}
      >
        {children}
      </div>
    </div>
  )
}

interface ComparisonItemProps {
  title: string
  children: React.ReactNode
  className?: string
}

// Memoize the ComparisonItem component to prevent unnecessary re-renders
export const ComparisonItem = memo(({ title, children, className }: ComparisonItemProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="bg-muted/50 px-3 py-1 rounded text-sm font-medium">{title}</div>
      <div className="border rounded-md p-4 bg-card">{children}</div>
    </div>
  )
})

ComparisonItem.displayName = "ComparisonItem"
