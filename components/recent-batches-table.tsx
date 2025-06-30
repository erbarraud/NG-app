"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Update the sample data to include sortingStart and sortingEnd
const batches = [
  {
    id: "B-4872",
    sortingStart: "2025-03-18 14:32",
    sortingEnd: "2025-03-18 16:45",
    totalBoards: 1250,
    volume: 12.6,
    rejectionRate: 8.2,
    yield: 91.8,
    status: "completed",
  },
  {
    id: "B-4871",
    sortingStart: "2025-03-18 10:15",
    sortingEnd: "2025-03-18 12:30",
    totalBoards: 980,
    volume: 9.8,
    rejectionRate: 7.5,
    yield: 92.5,
    status: "completed",
  },
  {
    id: "B-4870",
    sortingStart: "2025-03-17 16:45",
    sortingEnd: "2025-03-17 19:10",
    totalBoards: 1100,
    volume: 11.2,
    rejectionRate: 9.1,
    yield: 90.9,
    status: "completed",
  },
  {
    id: "B-4869",
    sortingStart: "2025-03-17 11:20",
    sortingEnd: "2025-03-17 13:45",
    totalBoards: 1320,
    volume: 13.5,
    rejectionRate: 6.8,
    yield: 93.2,
    status: "completed",
  },
  {
    id: "B-4868",
    sortingStart: "2025-03-16 15:10",
    sortingEnd: "2025-03-16 17:30",
    totalBoards: 950,
    volume: 9.5,
    rejectionRate: 10.2,
    yield: 89.8,
    status: "completed",
  },
]

interface RecentBatchesTableProps {
  onBatchClick?: (batchId: string) => void
}

export function RecentBatchesTable({ onBatchClick }: RecentBatchesTableProps) {
  return (
    <Table>
      {/* Update the table header to show Sorting Start and Sorting End */}
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Sorting Start</TableHead>
          <TableHead>Sorting End</TableHead>
          <TableHead>Total Boards</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Rejection Rate</TableHead>
          <TableHead>Yield</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      {/* Update the table body to display sortingStart and sortingEnd */}
      <TableBody>
        {batches.map((batch) => (
          <TableRow key={batch.id}>
            <TableCell className="font-medium">
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={() => onBatchClick && onBatchClick(batch.id)}
              >
                {batch.id}
              </Button>
            </TableCell>
            <TableCell>{batch.sortingStart}</TableCell>
            <TableCell>{batch.sortingEnd}</TableCell>
            <TableCell>{batch.totalBoards}</TableCell>
            <TableCell>{batch.volume} m³</TableCell>
            <TableCell>{batch.rejectionRate}%</TableCell>
            <TableCell>{batch.yield}%</TableCell>
            <TableCell>
              <Badge variant={batch.status === "completed" ? "outline" : "secondary"}>{batch.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onBatchClick && onBatchClick(batch.id)}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>View Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Export Report</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
