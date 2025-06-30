export interface ClaimTimelineEvent {
  date: string
  action: string
  user: string
}

export interface Claim {
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

export const claimsData: Claim[] = [
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
