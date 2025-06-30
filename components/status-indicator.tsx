import { cn } from "@/lib/utils"

type StatusType = "available" | "away" | "transfers" | "offline" | "error" | "warning" | "success" | "info"

interface StatusIndicatorProps {
  type: StatusType
  caption?: string
  className?: string
}

export function StatusIndicator({ type, caption, className }: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (type) {
      case "available":
      case "success":
        return "bg-green-500"
      case "away":
      case "warning":
        return "bg-orange-400"
      case "transfers":
      case "info":
        return "bg-blue-500"
      case "error":
        return "bg-red-500"
      case "offline":
      default:
        return "bg-gray-400"
    }
  }

  return <div className={cn("flex items-center gap-2", className)}></div>
}
