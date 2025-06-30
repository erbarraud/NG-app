"use client"

import { useState, useMemo } from "react"
import { Check, Clock, FileText, Filter, Link, MoreHorizontal, Plus, RefreshCw, Search, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add these type definitions at the top of the file
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

// Sample data for claims
const claimsData = [
  {
    id: "CLM-2023-001",
    customer: "Northland Lumber Co.",
    batchId: "BATCH-4872",
    dateSubmitted: "2023-11-15",
    issueType: "Grade Dispute",
    status: "New",
    description:
      "Customer received batch with 15% of boards graded lower than expected. Requesting review of grading process.",
    contactName: "John Peterson",
    contactEmail: "jpeterson@northlandlumber.com",
    contactPhone: "555-123-4567",
    photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    timeline: [
      { date: "2023-11-15", action: "Claim submitted", user: "John Peterson" },
      { date: "2023-11-15", action: "Claim received", user: "System" },
    ],
  },
  {
    id: "CLM-2023-002",
    customer: "Pacific Coast Timber",
    batchId: "BATCH-4865",
    dateSubmitted: "2023-11-12",
    issueType: "Delivery Damage",
    status: "In Review",
    description: "Significant water damage to approximately 20% of the order. Boards warped and stained.",
    contactName: "Sarah Williams",
    contactEmail: "swilliams@pctimber.com",
    contactPhone: "555-987-6543",
    photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    timeline: [
      { date: "2023-11-12", action: "Claim submitted", user: "Sarah Williams" },
      { date: "2023-11-12", action: "Claim received", user: "System" },
      { date: "2023-11-13", action: "Assigned to Mike Johnson", user: "Admin" },
      { date: "2023-11-14", action: "Photos reviewed", user: "Mike Johnson" },
    ],
  },
  {
    id: "CLM-2023-003",
    customer: "Eastwood Building Supply",
    batchId: "BATCH-4810",
    dateSubmitted: "2023-11-08",
    issueType: "Quantity Discrepancy",
    status: "Approved",
    description: "Order received was short by approximately 200 board feet compared to invoice.",
    contactName: "Robert Chen",
    contactEmail: "rchen@eastwoodsupply.com",
    contactPhone: "555-456-7890",
    photos: ["/placeholder.svg?height=300&width=400"],
    timeline: [
      { date: "2023-11-08", action: "Claim submitted", user: "Robert Chen" },
      { date: "2023-11-08", action: "Claim received", user: "System" },
      { date: "2023-11-09", action: "Assigned to Lisa Parker", user: "Admin" },
      { date: "2023-11-10", action: "Inventory checked", user: "Lisa Parker" },
      { date: "2023-11-14", action: "Claim approved", user: "Lisa Parker" },
    ],
  },
  {
    id: "CLM-2023-004",
    customer: "Mountain Ridge Contractors",
    batchId: "BATCH-4795",
    dateSubmitted: "2023-11-05",
    issueType: "Grade Dispute",
    status: "Declined",
    description: "Customer claims 30% of boards were below specified grade. Requesting partial refund.",
    contactName: "David Martinez",
    contactEmail: "dmartinez@mountainridge.com",
    contactPhone: "555-789-0123",
    photos: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    timeline: [
      { date: "2023-11-05", action: "Claim submitted", user: "David Martinez" },
      { date: "2023-11-05", action: "Claim received", user: "System" },
      { date: "2023-11-06", action: "Assigned to James Wilson", user: "Admin" },
      { date: "2023-11-08", action: "Sample boards re-graded", user: "James Wilson" },
      { date: "2023-11-10", action: "Grading verified as accurate", user: "Quality Control" },
      { date: "2023-11-12", action: "Claim declined", user: "James Wilson" },
    ],
  },
  {
    id: "CLM-2023-005",
    customer: "Riverside Lumber Yard",
    batchId: "BATCH-4782",
    dateSubmitted: "2023-11-01",
    issueType: "Delivery Damage",
    status: "Closed",
    description: "Edge damage to approximately 50 boards during shipping. Requesting replacement or credit.",
    contactName: "Jennifer Lopez",
    contactEmail: "jlopez@riversidelumber.com",
    contactPhone: "555-234-5678",
    photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    timeline: [
      { date: "2023-11-01", action: "Claim submitted", user: "Jennifer Lopez" },
      { date: "2023-11-01", action: "Claim received", user: "System" },
      { date: "2023-11-02", action: "Assigned to Thomas Brown", user: "Admin" },
      { date: "2023-11-03", action: "Photos reviewed", user: "Thomas Brown" },
      { date: "2023-11-05", action: "Shipping company contacted", user: "Thomas Brown" },
      { date: "2023-11-08", action: "Partial credit approved", user: "Thomas Brown" },
      { date: "2023-11-10", action: "Credit issued", user: "Accounting" },
      { date: "2023-11-10", action: "Claim closed", user: "Thomas Brown" },
    ],
  },
]

export default function ClaimsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isNewClaimDialogOpen, setIsNewClaimDialogOpen] = useState(false)

  // Filter claims based on selected tab and search query
  const filteredClaims = useMemo(() => {
    return claimsData.filter((claim) => {
      const matchesTab =
        selectedTab === "all" ||
        (selectedTab === "new" && claim.status === "New") ||
        (selectedTab === "in-review" && claim.status === "In Review") ||
        (selectedTab === "approved" && claim.status === "Approved") ||
        (selectedTab === "declined" && claim.status === "Declined") ||
        (selectedTab === "closed" && claim.status === "Closed")

      const matchesSearch =
        searchQuery === "" ||
        claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.issueType.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesTab && matchesSearch
    })
  }, [selectedTab, searchQuery])

  // Count claims by status
  const newCount = claimsData.filter((claim) => claim.status === "New").length
  const inReviewCount = claimsData.filter((claim) => claim.status === "In Review").length
  const approvedCount = claimsData.filter((claim) => claim.status === "Approved").length
  const declinedCount = claimsData.filter((claim) => claim.status === "Declined").length
  const closedCount = claimsData.filter((claim) => claim.status === "Closed").length

  // Handle claim selection
  const handleClaimSelect = (claim) => {
    setSelectedClaim(claim)
    setIsDetailViewOpen(true)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Claims Management</h1>
          <p className="text-muted-foreground mt-1">Review and process customer claims for lumber batches</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" className="flex items-center gap-2" onClick={() => setIsShareModalOpen(true)}>
            <Share2 className="h-4 w-4" />
            Share Claim Link
          </Button>
          <Button variant="default" className="flex items-center gap-2" onClick={() => setIsNewClaimDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Claim
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Open Claims</CardTitle>
            <CardDescription>Claims requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{newCount + inReviewCount}</div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-sm">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>New: {newCount}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span>In Review: {inReviewCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Resolution Rate</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">87%</div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-sm">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Approved: {approvedCount}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>Declined: {declinedCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Average Resolution Time</CardTitle>
            <CardDescription>Time to close claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">3.2 days</div>
              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{closedCount} closed this month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claims by ID, customer, or batch..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Claims Tabs and Table */}
      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Claims</TabsTrigger>
          <TabsTrigger value="new">New ({newCount})</TabsTrigger>
          <TabsTrigger value="in-review">In Review ({inReviewCount})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
          <TabsTrigger value="declined">Declined ({declinedCount})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedCount})</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            <Table aria-label="Claims management table">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Claim ID</TableHead>
                  <TableHead scope="col">Customer</TableHead>
                  <TableHead scope="col">Batch ID</TableHead>
                  <TableHead scope="col">Date Submitted</TableHead>
                  <TableHead scope="col">Issue Type</TableHead>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col" className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No claims found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClaims.map((claim) => (
                    <TableRow
                      key={claim.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleClaimSelect(claim)}
                      aria-label={`Claim ${claim.id} for ${claim.customer}`}
                    >
                      <TableCell className="font-medium">{claim.id}</TableCell>
                      <TableCell>{claim.customer}</TableCell>
                      <TableCell>{claim.batchId}</TableCell>
                      <TableCell>{claim.dateSubmitted}</TableCell>
                      <TableCell>{claim.issueType}</TableCell>
                      <TableCell>{getStatusBadge(claim.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              aria-label={`Actions for claim ${claim.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleClaimSelect(claim)
                              }}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {claim.status === "New" && (
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Clock className="h-4 w-4 mr-2" />
                                Mark as In Review
                              </DropdownMenuItem>
                            )}
                            {(claim.status === "New" || claim.status === "In Review") && (
                              <>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve Claim
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <X className="h-4 w-4 mr-2" />
                                  Decline Claim
                                </DropdownMenuItem>
                              </>
                            )}
                            {claim.status !== "Closed" && (
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Check className="h-4 w-4 mr-2" />
                                Close Claim
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

      {/* Claim Detail Dialog */}
      {selectedClaim && (
        <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Claim Details - {selectedClaim.id}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Customer:</span>
                      <p className="font-medium">{selectedClaim.customer}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Contact Name:</span>
                      <p className="font-medium">{selectedClaim.contactName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Contact Email:</span>
                      <p className="font-medium">{selectedClaim.contactEmail}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Contact Phone:</span>
                      <p className="font-medium">{selectedClaim.contactPhone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Claim Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Batch ID:</span>
                      <p className="font-medium">{selectedClaim.batchId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Date Submitted:</span>
                      <p className="font-medium">{selectedClaim.dateSubmitted}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Issue Type:</span>
                      <p className="font-medium">{selectedClaim.issueType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedClaim.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Issue Description</h3>
                <p className="text-sm border rounded-md p-3 bg-muted/30">{selectedClaim.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Photos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedClaim.photos.map((photo, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Claim photo ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Claim Timeline</h3>
                <div className="border rounded-md divide-y">
                  {selectedClaim.timeline.map((event, index) => (
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
            </div>
            <DialogFooter className="mt-6 gap-2">
              {selectedClaim.status === "New" && (
                <Button variant="outline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Mark as In Review
                </Button>
              )}
              {(selectedClaim.status === "New" || selectedClaim.status === "In Review") && (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                    Decline Claim
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                  >
                    <Check className="h-4 w-4" />
                    Approve Claim
                  </Button>
                </>
              )}
              {selectedClaim.status !== "Closed" && (
                <Button variant="default" className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Close Claim
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Share Claim Link Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Claim Submission Link</DialogTitle>
            <DialogDescription>Generate a unique link for customers to submit claims</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue="https://neural-grader.com/claim/CUST-12345-XYZ" readOnly />
            </div>
            <Button type="submit" size="sm" className="px-3">
              <span className="sr-only">Copy</span>
              <Link className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Generate New Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Claim Dialog */}
      <Dialog open={isNewClaimDialogOpen} onOpenChange={setIsNewClaimDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Claim</DialogTitle>
            <DialogDescription>Enter the details for a new customer claim</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Select defaultValue="">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="northland">Northland Lumber Co.</SelectItem>
                  <SelectItem value="pacific">Pacific Coast Timber</SelectItem>
                  <SelectItem value="eastwood">Eastwood Building Supply</SelectItem>
                  <SelectItem value="mountain">Mountain Ridge Contractors</SelectItem>
                  <SelectItem value="riverside">Riverside Lumber Yard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batchId" className="text-right">
                Batch ID
              </Label>
              <Input id="batchId" placeholder="Enter batch ID" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issueType" className="text-right">
                Issue Type
              </Label>
              <Select defaultValue="">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade">Grade Dispute</SelectItem>
                  <SelectItem value="damage">Delivery Damage</SelectItem>
                  <SelectItem value="quantity">Quantity Discrepancy</SelectItem>
                  <SelectItem value="quality">Quality Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea id="description" placeholder="Describe the issue in detail" className="col-span-3" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewClaimDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Claim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
