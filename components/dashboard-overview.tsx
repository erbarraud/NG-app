"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  ArrowDown,
  ArrowUp,
  Clock,
  AlertTriangle,
  ChevronRight,
  FileText,
  MoreHorizontal,
  Pause,
  Square,
  X,
  RefreshCw,
  Download,
  DollarSign,
  Layers,
  PlusCircle,
  MessageSquare,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts"

import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { ShiftStatusDisplay } from "@/components/shift-status-display"
import { useToast } from "@/hooks/use-toast"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Updated for Grades A, B, C and specific hours
interface HourlyBoardData {
  hour: string // e.g., "9AM", "10AM"
  A: number
  B: number
  C: number
  total: number
}

interface KPIData {
  valueProcessed: {
    current: number
    trend: number
    sparklineData: { value: number }[]
  }
  volumeProcessed: {
    current: number
    trend: number
    sparklineData: { value: number }[]
  }
  gradeMetrics: {
    totalGrades: number
    averageGrade: string
    highestGrade: string
    lowestGrade: string
    efficiency: number
    gradeDistribution: { grade: string; count: number; percentage: number }[]
  }
  feedbackSubmitted: {
    count: number
    trend: number
    sparklineData: { value: number }[]
    totalBoardsProcessed: number
  }
}

// Updated data generation function
function generateHourlyBoardData(): HourlyBoardData[] {
  const workHours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"]
  const data: HourlyBoardData[] = []
  const currentHour24 = new Date().getHours()

  workHours.forEach((hourLabel) => {
    const hourInt = Number.parseInt(hourLabel.replace("AM", "").replace("PM", ""))
    const hourIn24Format =
      hourLabel.includes("PM") && hourInt !== 12
        ? hourInt + 12
        : hourLabel.includes("AM") && hourInt === 12
          ? 0
          : hourInt

    if (hourIn24Format > currentHour24 && !(hourLabel === "9AM" && currentHour24 < 9)) {
      // Show 9AM if current time is before 9AM
      data.push({ hour: hourLabel, A: 0, B: 0, C: 0, total: 0 })
      return
    }

    // Allow 9AM to show data even if current time is before 9AM for demo purposes
    if (hourLabel === "9AM" && currentHour24 < 9 && data.length === 0) {
      const gradeA = Math.floor(Math.random() * 100) + 20
      const gradeB = Math.floor(Math.random() * 150) + 30
      const gradeC = Math.floor(Math.random() * 80) + 10
      data.push({
        hour: hourLabel,
        A: gradeA,
        B: gradeB,
        C: gradeC,
        total: gradeA + gradeB + gradeC,
      })
      return
    }

    const gradeA = Math.floor(Math.random() * 100) + 20 // Grade A: 20-120
    const gradeB = Math.floor(Math.random() * 150) + 30 // Grade B: 30-180
    const gradeC = Math.floor(Math.random() * 80) + 10 // Grade C: 10-90
    data.push({
      hour: hourLabel,
      A: gradeA,
      B: gradeB,
      C: gradeC,
      total: gradeA + gradeB + gradeC,
    })
  })
  return data
}

function generateKPIData(): KPIData {
  return {
    valueProcessed: {
      current: 24680,
      trend: 8.2,
      sparklineData: Array.from({ length: 7 }, (_, i) => ({
        value: 20000 + Math.random() * 8000 + i * 500,
      })),
    },
    volumeProcessed: {
      current: 38.4,
      trend: 12.1,
      sparklineData: Array.from({ length: 7 }, (_, i) => ({
        value: 30 + Math.random() * 15 + i * 0.8,
      })),
    },
    gradeMetrics: {
      totalGrades: 2847,
      averageGrade: "Select",
      highestGrade: "Premium",
      lowestGrade: "Economy",
      efficiency: 94.2,
      gradeDistribution: [
        { grade: "Premium", count: 342, percentage: 12.0 },
        { grade: "Select", count: 854, percentage: 30.0 },
        { grade: "#1", count: 996, percentage: 35.0 },
        { grade: "#2", count: 455, percentage: 16.0 },
        { grade: "#3", count: 142, percentage: 5.0 },
        { grade: "Economy", count: 58, percentage: 2.0 },
      ],
    },
    feedbackSubmitted: {
      count: Math.floor(Math.random() * 120) + 30, // e.g., 30-150 feedbacks
      trend: Number.parseFloat((Math.random() * 10 - 5).toFixed(1)), // e.g., -5.0% to +5.0%
      sparklineData: Array.from({ length: 7 }, (_, i) => ({
        value: 40 + Math.random() * 80 + i * (Math.random() * 6 - 3),
      })),
      totalBoardsProcessed: 2594, // Example total
    },
  }
}

function CompactSparkline({ data, color = "#10b981" }: { data: { value: number }[]; color?: string }) {
  return (
    <div className="h-8 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DashboardOverview() {
  const router = useRouter()
  const [hourlyBoardStats, setHourlyBoardStats] = useState<HourlyBoardData[]>([])
  const [kpiData, setKPIData] = useState<KPIData | null>(null)

  const { toast } = useToast()

  const handleExtendShift = () => {
    toast({
      title: "Shift Extension Requested",
      description: "Current shift has been notionally extended by 60 minutes. (This is a demo action)",
      duration: 5000,
    })
    // In a real application, you would:
    // 1. Identify the current active shift.
    // 2. Send an API request to update its end time.
    // 3. Update the local state/data source for 'demoSchedule' in ShiftStatusDisplay
    //    or trigger a refetch, so ShiftStatusDisplay reflects the change.
    console.log("Extend shift button clicked. Actual logic to update shift data would go here.")
  }

  useEffect(() => {
    const updateData = () => {
      setHourlyBoardStats(generateHourlyBoardData())
      setKPIData(generateKPIData())
    }
    updateData()
    const interval = setInterval(updateData, 30000) // Refresh data every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-6 w-full">
      <Card className="overflow-hidden border shadow-sm">
        <CardHeader className="py-4 px-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Neural Grader Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Monitor lumber grading operations, track performance, and manage quality control
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ShiftStatusDisplay />
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleExtendShift} className="h-8 px-2.5">
                      <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                      Extend (+1h)
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Extend current shift by 60 minutes (one-off)</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid lg:grid-cols-12 gap-0">
            {kpiData && (
              <div className="lg:col-span-4 xl:col-span-3 border-r border-border bg-slate-50/50 dark:bg-slate-900/20">
                <div className="grid grid-cols-1 divide-y">
                  <div className="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-md">
                          <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-sm">Value Processed</span>
                      </div>
                      <CompactSparkline data={kpiData.valueProcessed.sparklineData} color="#10b981" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        ${kpiData.valueProcessed.current.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        {kpiData.valueProcessed.trend > 0 ? (
                          <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            kpiData.valueProcessed.trend > 0 ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {Math.abs(kpiData.valueProcessed.trend)}% vs yesterday
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                          <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-sm">Volume Processed</span>
                      </div>
                      <CompactSparkline data={kpiData.volumeProcessed.sparklineData} color="#3b82f6" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {kpiData.volumeProcessed.current} m³
                      </div>
                      <div className="flex items-center">
                        {kpiData.volumeProcessed.trend > 0 ? (
                          <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            kpiData.volumeProcessed.trend > 0 ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {Math.abs(kpiData.volumeProcessed.trend)}% vs yesterday
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                          <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-sm">Feedback Submitted</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Feedback History</DropdownMenuItem>
                          <DropdownMenuItem>Download Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                        {kpiData.feedbackSubmitted.count}
                      </div>
                      <div className="flex items-center">
                        {kpiData.feedbackSubmitted.trend !== 0 &&
                          (kpiData.feedbackSubmitted.trend > 0 ? (
                            <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                          ))}
                        <span
                          className={`text-sm font-medium ${
                            kpiData.feedbackSubmitted.trend > 0
                              ? "text-emerald-600"
                              : kpiData.feedbackSubmitted.trend < 0
                                ? "text-red-600"
                                : "text-slate-500"
                          }`}
                        >
                          {Math.abs(kpiData.feedbackSubmitted.trend)}%
                          {kpiData.feedbackSubmitted.trend !== 0
                            ? kpiData.feedbackSubmitted.trend > 0
                              ? " increase"
                              : " decrease"
                            : " no change"}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {kpiData.feedbackSubmitted.count} feedback entries
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="lg:col-span-8 xl:col-span-9">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">
                    Boards Processed per Hour
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyBoardStats} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} horizontal={true} />
                      <XAxis
                        dataKey="hour"
                        fontSize={11}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={{ stroke: "#e2e8f0" }}
                      />
                      <YAxis
                        fontSize={11}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={{ stroke: "#e2e8f0" }}
                        domain={[0, "dataMax"]}
                        allowDataOverflow={false}
                      />
                      <Tooltip
                        formatter={(value, name, props) => {
                          const gradeValue = props.payload[name as keyof HourlyBoardData]
                          return [gradeValue, `Grade ${name}`]
                        }}
                        labelFormatter={(label) => `Time: ${label}`}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                          boxShadow: "var(--shadow-md)",
                          padding: "8px 12px",
                          fontSize: "12px",
                        }}
                        cursor={{ fill: "hsl(var(--muted-foreground))", opacity: 0.1 }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} iconType="circle" iconSize={8} />
                      <Bar
                        dataKey="A"
                        stackId="a"
                        fill="hsl(var(--primary))"
                        name="Grade A"
                        radius={[0, 0, 0, 0]}
                        baseValue={0}
                        barSize={30}
                      />
                      <Bar
                        dataKey="B"
                        stackId="a"
                        fill="hsl(var(--chart-2))"
                        name="Grade B"
                        baseValue={0}
                        barSize={30}
                      />
                      <Bar
                        dataKey="C"
                        stackId="a"
                        fill="hsl(var(--chart-3))"
                        name="Grade C"
                        radius={[4, 4, 0, 0]}
                        baseValue={0}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div className="space-y-1">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest wood grading operations</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/batches")}>
              {" "}
              {/* Updated to /batches which shows Orders component */}
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mock data for recent orders table. In a real app, this would be dynamic. */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Yield</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">B-4873</TableCell>
                  <TableCell>Mar 18, 2025</TableCell>
                  <TableCell>09:15 AM</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">In progress</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </TableCell>
                  <TableCell>3.8 / 11.2 m³</TableCell>
                  <TableCell>92.1%</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" />
                          <span>Pause</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Square className="mr-2 h-4 w-4" />
                          <span>Stop</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <X className="mr-2 h-4 w-4" />
                          <span>Close</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {/* Other mock rows remain the same */}
                <TableRow>
                  <TableCell className="font-medium">B-4872</TableCell>
                  <TableCell>Mar 18, 2025</TableCell>
                  <TableCell>08:30 AM</TableCell>
                  <TableCell>11:45 AM</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-500" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  </TableCell>
                  <TableCell>12.6 m³</TableCell>
                  <TableCell>91.8%</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>Reopen</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/order/B-4872`)}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Export Report</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">B-4871</TableCell>
                  <TableCell>Mar 18, 2025</TableCell>
                  <TableCell>07:15 AM</TableCell>
                  <TableCell>10:30 AM</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-gray-500" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  </TableCell>
                  <TableCell>9.9 m³</TableCell>
                  <TableCell>92.5%</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>Reopen</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/order/B-4871`)}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Export Report</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div className="space-y-1">
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent notifications and warnings</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-3">
              {/* Mock system alerts */}
              <div className="flex items-start gap-4 rounded-lg border-l-4 border-l-amber-500 border p-3 hover:bg-muted/50">
                <div className="text-amber-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Accuracy Drop Detected</p>
                  <p className="text-sm text-muted-foreground">Batch #4872 showed 5% lower accuracy than average</p>
                  <div className="flex items-center pt-1">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border-l-4 border-l-blue-500 border p-3 hover:bg-muted/50">
                <div className="text-blue-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New Grading Rule Added</p>
                  <p className="text-sm text-muted-foreground">Admin user added a new rule for knot detection</p>
                  <div className="flex items-center pt-1">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{formatDate(new Date())}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t py-3">
            <Button variant="outline" className="w-full" onClick={() => router.push("/alerts")}>
              {" "}
              {/* Assuming an /alerts page */}
              View All Alerts
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
