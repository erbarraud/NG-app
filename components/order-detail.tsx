"use client"

import { useState } from "react"
import { ArrowLeft, ArrowUpDown, ChevronRight, Download, Filter, Search } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

// Mock data specific to this component. In a real app, this would likely be fetched.
const boardsData = [
  {
    id: "BRD-4625",
    timestamp: "03/18/2025 3:58 PM",
    grade: "1COMMON",
    status: "processed",
    defectCount: 2,
    value: 4.9,
    volume: "4 bf",
    dimensions: { length: "8' 3 3/4\"", width: '5 1/2"', thickness: '15/16"' },
  },
  {
    id: "BRD-58920",
    timestamp: "03/18/2025 3:41 PM",
    grade: "1COMMON",
    status: "processed",
    defectCount: 3,
    value: 4.9,
    volume: "4 bf",
    dimensions: { length: "8' 3 3/4\"", width: '5 1/2"', thickness: '15/16"' },
  },
  {
    id: "BRD-58914",
    timestamp: "03/18/2025 3:38 PM",
    grade: "2COMMON",
    status: "rejected",
    defectCount: 4,
    value: 3.2,
    volume: "3.2 bf",
    dimensions: { length: "8' 3 3/4\"", width: '5 1/2"', thickness: '15/16"' },
  },
  // Add more mock data for demonstration
  {
    id: "BRD-58913",
    timestamp: "03/18/2025 3:37 PM",
    grade: "1COMMON",
    status: "processed",
    defectCount: 1,
    value: 5.1,
    volume: "4.2 bf",
    dimensions: { length: "8' 3 3/4\"", width: '5 1/2"', thickness: '15/16"' },
  },
  {
    id: "BRD-58912",
    timestamp: "03/18/2025 3:36 PM",
    grade: "3COMMON",
    status: "processed",
    defectCount: 5,
    value: 2.8,
    volume: "3.5 bf",
    dimensions: { length: "8' 3 3/4\"", width: '5 1/2"', thickness: '15/16"' },
  },
  {
    id: "BRD-58911",
    timestamp: "03/18/2025 3:35 PM",
    grade: "2COMMON",
    status: "rejected",
    defectCount: 3,
    value: 3.4,
    volume: "3.8 bf",
    dimensions: { length: "8' 3 3/4\"", width: '5 1/2"', thickness: '15/16"' },
  },
  {
    id: "BRD-58910",
    timestamp: "03/18/2025 3:34 PM",
    grade: "1COMMON",
    status: "processed",
    defectCount: 2,
    value: 4.7,
    volume: "4.1 bf",
    dimensions: { length: "8' 3 3/4\"", width: '5 1/2"', thickness: '15/16"' },
  },
  {
    id: "BRD-58909",
    timestamp: "03/18/2025 3:33 PM",
    grade: "SELECT",
    status: "processed",
    defectCount: 0,
    value: 6.2,
    volume: "4.5 bf",
    dimensions: { length: "8' 3 3/4\"", width: '5 1/2"', thickness: '15/16"' },
  },
]

const gradeDistributionData = [
  { name: "1COMMON", value: 45 },
  { name: "2COMMON", value: 30 },
  { name: "3COMMON", value: 15 },
  { name: "SELECT", value: 8 },
  { name: "REJECT", value: 2 },
]

const CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface OrderDetailProps {
  batchId: string
  onBoardSelect: (boardId: string) => void
}

export default function OrderDetail({ batchId, onBoardSelect }: OrderDetailProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showStats, setShowStats] = useState(false)
  const router = useRouter()

  const totalBoards = boardsData.length
  const rejectedBoardsCount = boardsData.filter((board) => board.status === "rejected").length
  const rejectionPercentage = totalBoards > 0 ? ((rejectedBoardsCount / totalBoards) * 100).toFixed(1) : "0.0"
  const averageBoardValue =
    totalBoards > 0 ? (boardsData.reduce((sum, board) => sum + board.value, 0) / totalBoards).toFixed(2) : "0.00"
  const totalOrderValue = boardsData.reduce((sum, board) => sum + board.value, 0).toFixed(2)
  const totalVolume = boardsData.reduce((sum, board) => sum + Number.parseFloat(board.volume), 0).toFixed(1)

  const filteredAndSortedBoards = boardsData
    .filter((board) =>
      Object.values(board).some(
        (val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(board.dimensions.length).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(board.dimensions.width).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(board.dimensions.thickness).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
    .sort((a, b) => {
      let aValue, bValue
      switch (sortField) {
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "timestamp":
          aValue = new Date(a.timestamp).getTime()
          bValue = new Date(b.timestamp).getTime()
          break
        case "grade":
          aValue = a.grade
          bValue = b.grade
          break
        case "defects":
          aValue = a.defectCount
          bValue = b.defectCount
          break
        default:
          aValue = a.id
          bValue = b.id
      }
      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="w-fit" onClick={() => router.push("/batches")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)}>
          {showStats ? "Hide Statistics" : "Show Statistics"}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order: {batchId}</h1>
          <p className="text-muted-foreground text-sm">
            {totalBoards} boards • {rejectedBoardsCount} rejected • ${totalOrderValue} total value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search boards..."
              className="pl-8 w-[200px] h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Grades</DropdownMenuItem>
              <DropdownMenuItem>1COMMON</DropdownMenuItem>
              <DropdownMenuItem>2COMMON</DropdownMenuItem>
              <DropdownMenuItem>3COMMON</DropdownMenuItem>
              <DropdownMenuItem>SELECT</DropdownMenuItem>
              <DropdownMenuItem>REJECT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {showStats && (
        <div className="grid gap-4 md:grid-cols-2 mb-2">
          <Card className="border">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-lg font-medium">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistributionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="value" name="Percentage">
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-lg font-medium">Order Statistics</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Rejected Boards",
                    value: `${rejectionPercentage}%`,
                    subValue: `(${rejectedBoardsCount} of ${totalBoards})`,
                    progress: Number.parseFloat(rejectionPercentage),
                  },
                  { label: "Total Boards", value: totalBoards, subValue: "processed" },
                  { label: "Avg. Board Value", value: `$${averageBoardValue}`, subValue: "Per board" },
                  { label: "Total Order Value", value: `$${totalOrderValue}`, subValue: "Combined" },
                  { label: "Total Volume", value: `${totalVolume} m³`, subValue: "Processed" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1 border rounded-lg p-3">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.subValue && <p className="text-xs text-muted-foreground">{stat.subValue}</p>}
                    {stat.progress !== undefined && (
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${stat.progress}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {[
                { id: "id", label: "Board ID" },
                { id: "timestamp", label: "Timestamp" },
                { id: "grade", label: "Grade" },
                { id: "dimensions", label: "Dimensions (L×W×T)" },
                { id: "defects", label: "Defects" },
                { id: "value", label: "Value" },
                { id: "volume", label: "Volume" },
                { id: "actions", label: "" },
              ].map((column) => (
                <TableHead key={column.id} className="py-2">
                  {column.id !== "actions" && column.id !== "dimensions" ? (
                    <Button
                      variant="ghost"
                      className="p-0 h-8 text-xs font-medium"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  ) : (
                    <span className="text-xs font-medium">{column.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedBoards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No boards found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedBoards.map((board) => {
                const defectStatus =
                  board.defectCount > 0
                    ? board.defectCount > 3
                      ? "bg-rose-500"
                      : board.defectCount > 1
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    : "bg-emerald-500"
                return (
                  <TableRow key={board.id} className="hover:bg-muted/50 h-12">
                    <TableCell className="font-medium py-2 text-sm">
                      <a
                        href="#"
                        className="text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault()
                          onBoardSelect(board.id)
                        }}
                      >
                        {board.id}
                      </a>
                    </TableCell>
                    <TableCell className="py-2 text-sm">{board.timestamp}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant={board.status === "rejected" ? "destructive" : "outline"} className="text-xs">
                        {board.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-sm">
                      {board.dimensions.length} × {board.dimensions.width} × {board.dimensions.thickness}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${defectStatus}`} />
                        <span className="text-xs font-medium">
                          {board.defectCount > 0 ? `${board.defectCount} defects` : "No defects"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm">${board.value.toFixed(2)}</TableCell>
                    <TableCell className="py-2 text-sm">{board.volume}</TableCell>
                    <TableCell className="text-right py-2">
                      <Button variant="ghost" size="sm" onClick={() => onBoardSelect(board.id)}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        <div className="bg-muted/30 border-t px-4 py-2 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Showing {filteredAndSortedBoards.length} of {totalBoards} boards
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
