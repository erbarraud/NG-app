"use client"

import type React from "react"

import { FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * EmptyState Component
 *
 * A reusable component for displaying empty states in lists, tables, etc.
 *
 * @param title - Main message to display
 * @param description - Optional detailed description
 * @param icon - Optional custom icon
 * @param action - Optional action button configuration
 * @param className - Additional CSS classes
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <FolderOpen className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-md">{description}</p>}
      {action && (
        <Button variant="outline" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
