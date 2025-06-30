"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Clock, X } from "lucide-react"

interface ClaimTimelineEvent {
  date: string
  action: string
  user: string
}

interface Claim {
  id: string
  customer: string
  batchId: string
  dateSubmitted: string
  issueType: string
  status: string
  description: string
  contactName: string
  contactEmail: string
  contactPhone: string
  photos: string[]
  timeline: ClaimTimelineEvent[]
}

interface ClaimDetailViewProps {
  claim: Claim
  onClose: () => void
  onStatusChange: (claimId: string, newStatus: string) => void
}

export function ClaimDetailView({ claim, onClose, onStatusChange }: ClaimDetailViewProps) {
  // Get status badge color
  const getStatusBadge = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Customer Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Customer:</span>
              <p className="font-medium">{claim.customer}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Contact Name:</span>
              <p className="font-medium">{claim.contactName}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Contact Email:</span>
              <p className="font-medium">{claim.contactEmail}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Contact Phone:</span>
              <p className="font-medium">{claim.contactPhone}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Claim Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Batch ID:</span>
              <p className="font-medium">{claim.batchId}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Date Submitted:</span>
              <p className="font-medium">{claim.dateSubmitted}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Issue Type:</span>
              <p className="font-medium">{claim.issueType}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status:</span>
              <div className="mt-1">{getStatusBadge(claim.status)}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Issue Description</h3>
        <p className="text-sm border rounded-md p-3 bg-muted/30">{claim.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Photos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {claim.photos.map((photo, index) => (
            <div key={index} className="border rounded-md overflow-hidden">
              <img src={photo || "/placeholder.svg"} alt={`Claim photo ${index + 1}`} className="w-full h-auto" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Claim Timeline</h3>
        <div className="border rounded-md divide-y">
          {claim.timeline.map((event, index) => (
            <div key={index} className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{event.action}</p>
                <p className="text-sm text-muted-foreground">By: {event.user}</p>
              </div>
              <div className="text-sm text-muted-foreground">{event.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {claim.status === "New" && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onStatusChange(claim.id, "In Review")}
          >
            <Clock className="h-4 w-4" />
            Mark as In Review
          </Button>
        )}
        {(claim.status === "New" || claim.status === "In Review") && (
          <>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
              onClick={() => onStatusChange(claim.id, "Declined")}
            >
              <X className="h-4 w-4" />
              Decline Claim
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
              onClick={() => onStatusChange(claim.id, "Approved")}
            >
              <Check className="h-4 w-4" />
              Approve Claim
            </Button>
          </>
        )}
        {claim.status !== "Closed" && (
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => onStatusChange(claim.id, "Closed")}
          >
            <Check className="h-4 w-4" />
            Close Claim
          </Button>
        )}
      </div>
    </div>
  )
}
