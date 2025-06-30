"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowUpDown, ChevronRight, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { boards, archivedBoards } from "@/data/sample-boards"

interface OrderBoardListProps {
  orderId?: string
}

export function OrderBoardList({ orderId: initialOrderId }: OrderBoardListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(initialOrderId)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Combine all boards for the sample data
  const allBoards = [...boards, ...archivedBoards]

  // Get unique order IDs from all boards
  const uniqueOrderIds = Array.from(new Set(allBoards.map((board) => board.batchId)))

  // Filter boards by selected order ID and search term
  const filteredBoards = allBoards.filter((board) => {
    const matchesOrderId = !selectedOrderId || board.batchId === selectedOrderId
    const matchesSearch =
      !searchTerm ||
      board.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.grade.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesOrderId && matchesSearch
  })

  // Sort boards by timestamp
  const sortedBoards = [...filteredBoards].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime()
    const dateB = new Date(b.timestamp).getTime()

    return sortDirection === "asc" ? dateA - dateB : dateB - dateA
  })

  // Simulate loading when changing order ID
  useEffect(() => {
    if (selectedOrderId) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [selectedOrderId])

  const handleOrderChange = (orderId: string) => {
    setSelectedOrderId(orderId)
  }

  const handleBoardSelect = (boardId: string) => {
    // Navigate to the board detail page
    router.push(`/scanning?boardId=${boardId}`)
  }

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Board Scans by Order</h1>
        <p className="text-muted-foreground">View all boards scanned for a specific order</p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select value={selectedOrderId} onValueChange={handleOrderChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an order ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {uniqueOrderIds.map((orderId) => (
                <SelectItem key={orderId} value={orderId}>
                  {orderId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search boards..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={toggleSortDirection}>
          <Clock className="mr-2 h-4 w-4" />
          {sortDirection === "desc" ? "Newest First" : "Oldest First"}
        </Button>
      </div>

      {/* Order Details Card (when an order is selected) */}
      {selectedOrderId && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Order: {selectedOrderId}</CardTitle>
                <CardDescription>
                  {sortedBoards.filter((b) => b.batchId === selectedOrderId).length} boards in this order
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {sortedBoards.filter((b) => b.batchId === selectedOrderId && b.status === "processed").length} Processed
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Boards Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Scanned Boards</CardTitle>
            <div className="text-sm text-muted-foreground">{sortedBoards.length} boards found</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Board ID</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium" onClick={toggleSortDirection}>
                    Scan Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Defects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : sortedBoards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No boards found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                sortedBoards.map((board) => (
                  <TableRow
                    key={board.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleBoardSelect(board.id)}
                  >
                    <TableCell className="font-medium">{board.id}</TableCell>
                    <TableCell>{board.timestamp}</TableCell>
                    <TableCell>{board.batchId}</TableCell>
                    <TableCell>
                      <Badge variant={board.status === "rejected" ? "destructive" : "outline"}>{board.grade}</Badge>
                    </TableCell>
                    <TableCell>
                      {board.dimensions.length} × {board.dimensions.width} × {board.dimensions.thickness}
                    </TableCell>
                    <TableCell>
                      {board.defectCount > 0 ? (
                        <StatusIndicator
                          type={board.defectCount > 3 ? "error" : board.defectCount > 1 ? "warning" : "info"}
                          caption={`${board.defectCount} defects`}
                        />
                      ) : (
                        <StatusIndicator type="success" caption="No defects" />
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusIndicator
                        type={board.status === "active" ? "success" : board.status === "processed" ? "info" : "warning"}
                        caption={board.status}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
