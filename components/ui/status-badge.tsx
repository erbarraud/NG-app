import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getStatusClasses } from "@/lib/design-system"

type StatusType = "info" | "success" | "warning" | "error" | "neutral"
type SeverityLevel = "Minor" | "Moderate" | "Major" | "Severe"

interface StatusBadgeProps {
  status?: string
  severity?: SeverityLevel
  type?: StatusType
  label?: string
  className?: string
}

/**
 * StatusBadge Component
 *
 * A unified badge component for displaying status information with consistent styling.
 * Follows the Neural Grader design system for colors and typography.
 *
 * @param status - Status text (e.g., "active", "completed")
 * @param severity - Severity level for defects
 * @param type - Type of status (info, success, warning, error, neutral)
 * @param label - Custom label text (overrides status/severity)
 * @param className - Additional CSS classes
 */
export function StatusBadge({ status, severity, type, label, className }: StatusBadgeProps) {
  // Determine the badge type based on severity or status
  const getBadgeType = (): StatusType => {
    if (type) return type

    if (severity) {
      switch (severity) {
        case "Minor":
          return "info"
        case "Moderate":
          return "warning"
        case "Major":
          return "warning"
        case "Severe":
          return "error"
        default:
          return "neutral"
      }
    }

    if (status) {
      switch (status.toLowerCase()) {
        case "active":
        case "good":
        case "completed":
        case "approved":
          return "success"
        case "warning":
        case "in review":
          return "warning"
        case "error":
        case "critical":
        case "declined":
          return "error"
        case "new":
          return "info"
        default:
          return "neutral"
      }
    }

    return "neutral"
  }

  // Determine the display text
  const displayText = label || severity || status || ""
  const badgeType = getBadgeType()

  return (
    <Badge variant="outline" className={cn(getStatusClasses(badgeType), className)}>
      {displayText}
    </Badge>
  )
}
