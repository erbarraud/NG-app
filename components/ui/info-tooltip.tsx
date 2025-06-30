import type React from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

/**
 * InfoTooltip Component
 *
 * A reusable component for displaying informational tooltips or messages.
 *
 * @param children - The content to display inside the tooltip
 * @param icon - Custom icon (defaults to Info icon)
 * @param className - Additional CSS classes
 */
export function InfoTooltip({ children, icon, className }: InfoTooltipProps) {
  return (
    <div className={cn("p-4 bg-muted/50 rounded-lg border", className)}>
      <div className="flex items-start gap-2">
        {icon || <Info className="h-5 w-5 text-muted-foreground mt-0.5" />}
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
