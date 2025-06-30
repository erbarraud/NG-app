import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "New":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          New
        </Badge>
      )
    case "In Review":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          In Review
        </Badge>
      )
    case "Approved":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Approved
        </Badge>
      )
    case "Declined":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Declined
        </Badge>
      )
    case "Closed":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Closed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
