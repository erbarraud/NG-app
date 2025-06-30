"use client"

import { useState } from "react"
import {
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
  Line,
  ComposedChart,
  LineChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample data for the combined chart
// Assuming premium, standard, etc. are absolute values that stack up.
// Volume can be a separate line or represent the total of the stacks.
// For this example, let's make 'volume' an independent line, and the bars stack separately.
// If 'volume' should be the sum of the bars, the data structure or rendering logic would adjust.
const combinedData = [
  { time: "08:00", volumeActual: 320, premium: 100, standard: 150, economy: 50, utility: 20 },
  { time: "09:00", volumeActual: 350, premium: 120, standard: 160, economy: 40, utility: 30 },
  { time: "10:00", volumeActual: 300, premium: 90, standard: 140, economy: 50, utility: 20 },
  { time: "11:00", volumeActual: 380, premium: 130, standard: 170, economy: 60, utility: 20 },
  { time: "12:00", volumeActual: 340, premium: 110, standard: 150, economy: 50, utility: 30 },
  { time: "13:00", volumeActual: 360, premium: 120, standard: 160, economy: 50, utility: 30 },
  { time: "14:00", volumeActual: 400, premium: 150, standard: 180, economy: 40, utility: 30 },
  { time: "15:00", volumeActual: 330, premium: 100, standard: 150, economy: 50, utility: 30 },
]

// Current time data for pie chart (remains as percentages)
const currentGradeDataForPie = [
  { name: "Premium", value: 35, color: "#22c55e" },
  { name: "Standard", value: 45, color: "#3b82f6" },
  { name: "Economy", value: 15, color: "#eab308" },
  { name: "Utility", value: 5, color: "#ef4444" },
]

const GRADE_COLORS = {
  premium: "#22c55e",
  standard: "#3b82f6",
  economy: "#eab308",
  utility: "#ef4444",
}

interface CombinedVolumeGradeChartProps {
  currentTotalProduction: number // Example: sum of latest premium, standard etc. or latest volumeActual
}

export function CombinedVolumeGradeChart({ currentTotalProduction }: CombinedVolumeGradeChartProps) {
  const [activeView, setActiveView] = useState<"combined" | "volume" | "gradeStack">("combined")

  // Determine the Y-axis domain. Start at 0, go up to a bit more than max data or 400.
  const maxDataValue = combinedData.reduce((max, item) => {
    const stackTotal = item.premium + item.standard + item.economy + item.utility
    return Math.max(max, item.volumeActual, stackTotal)
  }, 0)
  const yAxisDomainMax = Math.max(400, Math.ceil((maxDataValue * 1.1) / 50) * 50) // Ensure it's at least 400, round up nicely

  return (
    <Card className="col-span-4">
      <CardHeader className="pb-1 pt-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-base font-medium">
          <Activity className="h-4 w-4 mr-2 text-primary" />
          Production Metrics
        </CardTitle>
        <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
          {currentTotalProduction.toFixed(1)} units/hr (example)
        </Badge>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <Tabs defaultValue="combined" className="w-full" onValueChange={(value) => setActiveView(value as any)}>
          <div className="flex justify-between items-center mb-3">
            <TabsList className="h-8">
              <TabsTrigger value="combined" className="text-xs h-7 px-3">
                Combined View
              </TabsTrigger>
              <TabsTrigger value="volume" className="text-xs h-7 px-3">
                Volume Trend
              </TabsTrigger>
              <TabsTrigger value="gradeStack" className="text-xs h-7 px-3">
                Grade Stack
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {Object.entries(GRADE_COLORS).map(([key, color]) => (
                <div key={key} className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: color }}></div>
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <TabsContent value="combined" className="mt-0">
            <div className="h-[300px]">
              {" "}
              {/* Increased height for better visibility */}
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedData} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis
                    domain={[0, yAxisDomainMax]} // Single Y-axis starting at 0
                    allowDataOverflow={false}
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "Units", // Generic label
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 10, textAnchor: "middle" },
                      dy: 20,
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "volumeActual") return [`${value} units`, "Volume Actual"]
                      return [`${value} units`, name.charAt(0).toUpperCase() + name.slice(1)]
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="premium" stackId="a" fill={GRADE_COLORS.premium} name="Premium" baseValue={0} />
                  <Bar dataKey="standard" stackId="a" fill={GRADE_COLORS.standard} name="Standard" baseValue={0} />
                  <Bar dataKey="economy" stackId="a" fill={GRADE_COLORS.economy} name="Economy" baseValue={0} />
                  <Bar dataKey="utility" stackId="a" fill={GRADE_COLORS.utility} name="Utility" baseValue={0} />
                  <Line
                    type="monotone"
                    dataKey="volumeActual"
                    stroke="#9333ea" // Purple for volume line
                    strokeWidth={3}
                    dot={{ r: 3, strokeWidth: 0, fill: "#9333ea" }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    name="Volume Actual"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="volume" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, yAxisDomainMax]} allowDataOverflow={false} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`${value} units`, "Volume Actual"]} />
                  <Line
                    type="monotone"
                    dataKey="volumeActual"
                    stroke="var(--primary)" // Use theme primary color
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    name="Volume Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="gradeStack" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedData} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis
                    domain={[0, yAxisDomainMax]}
                    allowDataOverflow={false}
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "Units",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 10, textAnchor: "middle" },
                      dy: 20,
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => [`${value} units`, name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="premium" stackId="a" fill={GRADE_COLORS.premium} name="Premium" baseValue={0} />
                  <Bar dataKey="standard" stackId="a" fill={GRADE_COLORS.standard} name="Standard" baseValue={0} />
                  <Bar dataKey="economy" stackId="a" fill={GRADE_COLORS.economy} name="Economy" baseValue={0} />
                  <Bar dataKey="utility" stackId="a" fill={GRADE_COLORS.utility} name="Utility" baseValue={0} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pie chart for current grade distribution (percentages) - kept separate */}
        <Card className="mt-4">
          <CardHeader className="pb-1 pt-3">
            <CardTitle className="text-sm font-medium">Current Grade Distribution (Pie)</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-3">
            <div className="h-[200px] flex items-center justify-center">
              <div className="w-full max-w-[250px] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentGradeDataForPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {currentGradeDataForPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${props.payload.name}: ${value}%`, null]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

// Example usage (you'd pass actual data in your app)
// <CombinedVolumeGradeChart currentTotalProduction={330} />
