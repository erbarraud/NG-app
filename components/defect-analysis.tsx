"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { AlertTriangle, ArrowRight, Calendar, Download, Filter, Search, AlertCircle, Activity } from "lucide-react"
import { PercentIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SeasonalDefectDashboard } from "@/components/seasonal-defect-dashboard"

// Sample data for defect types
const defectTypeData = [
  { name: "Knots", count: 1245, percentage: 35 },
  { name: "Splits", count: 875, percentage: 25 },
  { name: "Holes", count: 525, percentage: 15 },
  { name: "Wane", count: 420, percentage: 12 },
  { name: "Decay", count: 210, percentage: 6 },
  { name: "Other", count: 245, percentage: 7 },
]

// Sample data for defect severity
const defectSeverityData = [
  { name: "Minor", count: 1750, percentage: 50 },
  { name: "Moderate", count: 1050, percentage: 30 },
  { name: "Major", count: 525, percentage: 15 },
  { name: "Severe", count: 175, percentage: 5 },
]

// Sample data for defect trend
const defectTrendData = [
  { date: "03/12", knots: 120, splits: 85, holes: 45, wane: 40 },
  { date: "03/13", knots: 135, splits: 90, holes: 50, wane: 35 },
  { date: "03/14", knots: 125, splits: 95, holes: 55, wane: 45 },
  { date: "03/15", knots: 140, splits: 80, holes: 60, wane: 50 },
  { date: "03/16", knots: 150, splits: 85, holes: 50, wane: 45 },
  { date: "03/17", knots: 145, splits: 90, holes: 45, wane: 40 },
  { date: "03/18", knots: 155, splits: 95, holes: 55, wane: 35 },
]

// Sample data for defect library
const defectLibrary = [
  {
    id: "DEF-001",
    name: "Knot",
    description: "A circular area where a branch grew from the tree trunk",
    impact: "Reduces structural integrity, affects appearance",
    tolerances: {
      premium: "Max 1 per board, < 1/2 inch diameter",
      standard: "Max 3 per board, < 1 inch diameter",
      economy: "Multiple allowed, < 2 inch diameter",
    },
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "DEF-002",
    name: "Split",
    description: "A separation of wood fibers along the grain",
    impact: "Reduces strength, can propagate further",
    tolerances: {
      premium: "None allowed",
      standard: "Max 1 per board, < 2 inches long",
      economy: "Multiple allowed, < 6 inches long",
    },
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "DEF-003",
    name: "Hole",
    description: "A void that passes completely through the board",
    impact: "Reduces usable area, structural weakness",
    tolerances: {
      premium: "None allowed",
      standard: "Max 1 per board, < 1/4 inch diameter",
      economy: "Multiple allowed, < 1/2 inch diameter",
    },
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "DEF-004",
    name: "Wane",
    description: "Bark or lack of wood along the edge of a board",
    impact: "Reduces usable width, affects appearance",
    tolerances: {
      premium: "< 5% of edge length, < 1/8 inch depth",
      standard: "< 15% of edge length, < 1/4 inch depth",
      economy: "< 30% of edge length, < 1/2 inch depth",
    },
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "DEF-005",
    name: "Decay",
    description: "Decomposition of wood due to fungi",
    impact: "Severely reduces strength and durability",
    tolerances: {
      premium: "None allowed",
      standard: "None allowed",
      economy: "Minor surface decay only, < 5% of area",
    },
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Sample data for recent defects
const recentDefects = [
  {
    id: "DEF-58921",
    type: "Knot",
    severity: "Minor",
    boardId: "BRD-58921",
    batchId: "B-4873",
    timestamp: "15:42:32",
    location: "Upper left quadrant",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "DEF-58920",
    type: "Split",
    severity: "Major",
    boardId: "BRD-58920",
    batchId: "B-4873",
    timestamp: "15:41:58",
    location: "Center right",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "DEF-58919",
    type: "Hole",
    severity: "Major",
    boardId: "BRD-58919",
    batchId: "B-4873",
    timestamp: "15:41:23",
    location: "Lower center",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "DEF-58918",
    type: "Wane",
    severity: "Severe",
    boardId: "BRD-58919",
    batchId: "B-4873",
    timestamp: "15:41:23",
    location: "Right edge",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "DEF-58917",
    type: "Knot",
    severity: "Moderate",
    boardId: "BRD-58917",
    batchId: "B-4873",
    timestamp: "15:40:12",
    location: "Upper right quadrant",
    image: "/placeholder.svg?height=50&width=50",
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export function DefectAnalysis() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDefectType, setSelectedDefectType] = useState("all")

  // Filter defect library based on search term and filters
  const filteredDefects = defectLibrary.filter((defect) => {
    const matchesSearch =
      defect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defect.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedDefectType === "all" || defect.name.toLowerCase() === selectedDefectType.toLowerCase()

    return matchesSearch && matchesType
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Defect Analysis</h1>
        <p className="text-muted-foreground">Analyze and understand wood defects detected during grading</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border">
            <CardTitle className="text-sm font-medium">Total Defects</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">2,853</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border">
            <CardTitle className="text-sm font-medium">Defect Rate</CardTitle>
            <PercentIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">-2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border">
            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">Knots</div>
            <p className="text-xs text-muted-foreground">42% of all defects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border">
            <CardTitle className="text-sm font-medium">Severity Index</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">Medium</div>
            <p className="text-xs text-muted-foreground">Stable from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="library">Defect Library</TabsTrigger>
          <TabsTrigger value="recent">Recent Defects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border border-border">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="text-lg font-medium">Defect Type Distribution</CardTitle>
                <CardDescription>Breakdown of defects by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={defectTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="percentage"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {defectTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Based on 3,520 defects detected</div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-border">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="text-lg font-medium">Defect Severity</CardTitle>
                <CardDescription>Distribution by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={defectSeverityData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => `${value} defects`} />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Number of Defects" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Last 7 days data</div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="border border-border">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-lg font-medium">Impact Analysis</CardTitle>
              <CardDescription>How defects affect grading and yield</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-semibold">Grade Impact</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Premium to Standard</span>
                      <span className="text-sm font-medium">12.5%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "12.5%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Standard to Economy</span>
                      <span className="text-sm font-medium">18.3%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "18.3%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Economy to Reject</span>
                      <span className="text-sm font-medium">8.2%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "8.2%" }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Yield Reduction</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Knots</span>
                      <span className="text-sm font-medium">3.2%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Splits</span>
                      <span className="text-sm font-medium">2.5%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "31%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Wane</span>
                      <span className="text-sm font-medium">1.8%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "22%" }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Cost Impact</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue Loss</span>
                      <span className="text-sm font-medium">$12,450</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Processing Cost</span>
                      <span className="text-sm font-medium">$5,280</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Rework Cost</span>
                      <span className="text-sm font-medium">$3,120</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-medium">Defect Trends</CardTitle>
                <CardDescription>Defect occurrence over time</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 7 Days
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={defectTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="knots" name="Knots" fill="#8884d8" />
                    <Bar dataKey="splits" name="Splits" fill="#82ca9d" />
                    <Bar dataKey="holes" name="Holes" fill="#ffc658" />
                    <Bar dataKey="wane" name="Wane" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Knot defects have increased by 8% over the past week</span>
              </div>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border border-border">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="text-lg font-medium">Defect by Wood Type</CardTitle>
                <CardDescription>Defect distribution across different wood types</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                        <span className="font-medium">Pine</span>
                      </div>
                      <span>42%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                        <span className="font-medium">Oak</span>
                      </div>
                      <span>28%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "28%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-yellow-500" />
                        <span className="font-medium">Maple</span>
                      </div>
                      <span>18%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "18%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-red-500" />
                        <span className="font-medium">Cherry</span>
                      </div>
                      <span>12%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "12%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="text-lg font-medium">Seasonal Variation</CardTitle>
                <CardDescription>How defect rates change throughout the year</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                        <span className="font-medium">Winter</span>
                      </div>
                      <span>+15%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                        <span className="font-medium">Spring</span>
                      </div>
                      <span>+5%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "55%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-yellow-500" />
                        <span className="font-medium">Summer</span>
                      </div>
                      <span>-8%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-red-500" />
                        <span className="font-medium">Fall</span>
                      </div>
                      <span>-12%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "38%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          <SeasonalDefectDashboard />
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search defect library..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">Defect Type</p>
                    <Select value={selectedDefectType} onValueChange={setSelectedDefectType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="knot">Knots</SelectItem>
                        <SelectItem value="split">Splits</SelectItem>
                        <SelectItem value="hole">Holes</SelectItem>
                        <SelectItem value="wane">Wane</SelectItem>
                        <SelectItem value="decay">Decay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDefects.map((defect) => (
              <Card key={defect.id} className="border border-border">
                <CardHeader className="border-b border-border pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">{defect.name}</CardTitle>
                    <Badge variant="outline">{defect.id}</Badge>
                  </div>
                  <CardDescription>{defect.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={defect.image || "/placeholder.svg"}
                      alt={defect.name}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <div>
                      <h4 className="font-medium text-sm">Impact</h4>
                      <p className="text-sm text-muted-foreground">{defect.impact}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Tolerances by Grade</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <Badge variant="default" className="w-20 justify-center">
                          Premium
                        </Badge>
                        <span className="text-muted-foreground">{defect.tolerances.premium}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="w-20 justify-center">
                          Standard
                        </Badge>
                        <span className="text-muted-foreground">{defect.tolerances.standard}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="w-20 justify-center">
                          Economy
                        </Badge>
                        <span className="text-muted-foreground">{defect.tolerances.economy}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-lg font-medium">Recently Detected Defects</CardTitle>
              <CardDescription>Defects detected in the last hour</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Board ID</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDefects.map((defect) => (
                    <TableRow key={defect.id}>
                      <TableCell>
                        <img
                          src={defect.image || "/placeholder.svg"}
                          alt={defect.type}
                          className="w-10 h-10 object-cover rounded-md border"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{defect.id}</TableCell>
                      <TableCell>{defect.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            defect.severity === "Minor"
                              ? "outline"
                              : defect.severity === "Moderate"
                                ? "secondary"
                                : defect.severity === "Major"
                                  ? "default"
                                  : "destructive"
                          }
                        >
                          {defect.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{defect.boardId}</TableCell>
                      <TableCell>{defect.batchId}</TableCell>
                      <TableCell>{defect.timestamp}</TableCell>
                      <TableCell>{defect.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">Showing 5 of 42 recent defects</div>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
