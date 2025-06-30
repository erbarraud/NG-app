"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Rectangle,
  BarChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

// Sample data for seasonal defect distribution
const boxPlotData = [
  {
    season: "Winter",
    min: 2.1,
    q1: 3.5,
    median: 5.2,
    q3: 7.8,
    max: 9.5,
    outliers: [1.2, 10.3, 11.5],
    mean: 5.4,
  },
  {
    season: "Spring",
    min: 1.8,
    q1: 2.9,
    median: 4.3,
    q3: 6.2,
    max: 8.1,
    outliers: [0.9, 9.2],
    mean: 4.5,
  },
  {
    season: "Summer",
    min: 1.2,
    q1: 2.1,
    median: 3.5,
    q3: 5.1,
    max: 6.8,
    outliers: [0.7, 7.9],
    mean: 3.7,
  },
  {
    season: "Fall",
    min: 1.5,
    q1: 2.5,
    median: 3.9,
    q3: 5.8,
    max: 7.5,
    outliers: [0.8, 8.7],
    mean: 4.1,
  },
]

// Sample data for defect types by season
const defectTypesBySeason = [
  { season: "Winter", knots: 35, splits: 25, holes: 15, wane: 12, decay: 8, other: 5 },
  { season: "Spring", knots: 30, splits: 28, holes: 18, wane: 10, decay: 9, other: 5 },
  { season: "Summer", knots: 25, splits: 20, holes: 22, wane: 15, decay: 12, other: 6 },
  { season: "Fall", knots: 28, splits: 22, holes: 20, wane: 14, decay: 10, other: 6 },
]

// Sample data for heatmap
const heatmapData = [
  { season: "Winter", defectType: "Knots", value: 35 },
  { season: "Winter", defectType: "Splits", value: 25 },
  { season: "Winter", defectType: "Holes", value: 15 },
  { season: "Winter", defectType: "Wane", value: 12 },
  { season: "Winter", defectType: "Decay", value: 8 },
  { season: "Winter", defectType: "Other", value: 5 },

  { season: "Spring", defectType: "Knots", value: 30 },
  { season: "Spring", defectType: "Splits", value: 28 },
  { season: "Spring", defectType: "Holes", value: 18 },
  { season: "Spring", defectType: "Wane", value: 10 },
  { season: "Spring", defectType: "Decay", value: 9 },
  { season: "Spring", defectType: "Other", value: 5 },

  { season: "Summer", defectType: "Knots", value: 25 },
  { season: "Summer", defectType: "Splits", value: 20 },
  { season: "Summer", defectType: "Holes", value: 22 },
  { season: "Summer", defectType: "Wane", value: 15 },
  { season: "Summer", defectType: "Decay", value: 12 },
  { season: "Summer", defectType: "Other", value: 6 },

  { season: "Fall", defectType: "Knots", value: 28 },
  { season: "Fall", defectType: "Splits", value: 22 },
  { season: "Fall", defectType: "Holes", value: 20 },
  { season: "Fall", defectType: "Wane", value: 14 },
  { season: "Fall", defectType: "Decay", value: 10 },
  { season: "Fall", defectType: "Other", value: 6 },
]

// Available years for the filter
const availableYears = ["2023", "2024", "2025"]

// Available defect types for the filter
const defectTypes = [
  { id: "knots", label: "Knots" },
  { id: "splits", label: "Splits" },
  { id: "holes", label: "Holes" },
  { id: "wane", label: "Wane" },
  { id: "decay", label: "Decay" },
  { id: "other", label: "Other" },
]

// Custom Box Plot component
const BoxPlot = (props) => {
  const { x, y, width, height, payload } = props

  // If payload is undefined, return an empty group
  if (!payload) {
    return <g></g>
  }

  const boxWidth = width * 0.5
  const boxX = x + (width - boxWidth) / 2

  return (
    <g>
      {/* Min-Max Line */}
      <line
        x1={x + width / 2}
        y1={y + height * (1 - payload.min / 12)}
        x2={x + width / 2}
        y2={y + height * (1 - payload.max / 12)}
        stroke="#000"
        strokeWidth={1}
      />

      {/* Box (Q1 to Q3) */}
      <rect
        x={boxX}
        y={y + height * (1 - payload.q3 / 12)}
        width={boxWidth}
        height={(height * (payload.q3 - payload.q1)) / 12}
        fill="#8884d8"
        stroke="#000"
        strokeWidth={1}
        opacity={0.7}
      />

      {/* Median Line */}
      <line
        x1={boxX}
        y1={y + height * (1 - payload.median / 12)}
        x2={boxX + boxWidth}
        y2={y + height * (1 - payload.median / 12)}
        stroke="#000"
        strokeWidth={2}
      />

      {/* Min Whisker */}
      <line
        x1={boxX + boxWidth / 4}
        y1={y + height * (1 - payload.min / 12)}
        x2={boxX + (boxWidth * 3) / 4}
        y2={y + height * (1 - payload.min / 12)}
        stroke="#000"
        strokeWidth={1}
      />

      {/* Max Whisker */}
      <line
        x1={boxX + boxWidth / 4}
        y1={y + height * (1 - payload.max / 12)}
        x2={boxX + (boxWidth * 3) / 4}
        y2={y + height * (1 - payload.max / 12)}
        stroke="#000"
        strokeWidth={1}
      />

      {/* Outliers */}
      {payload.outliers &&
        payload.outliers.map((outlier, index) => (
          <circle
            key={index}
            cx={x + width / 2}
            cy={y + height * (1 - outlier / 12)}
            r={3}
            fill="red"
            stroke="#000"
            strokeWidth={1}
          />
        ))}

      {/* Mean Point */}
      <circle
        cx={x + width / 2}
        cy={y + height * (1 - payload.mean / 12)}
        r={4}
        fill="#ff7300"
        stroke="#000"
        strokeWidth={1}
      />
    </g>
  )
}

// Custom tooltip for the box plot
const BoxPlotTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-bold">{data.season}</p>
        <p>Min: {data.min.toFixed(1)}</p>
        <p>Q1: {data.q1.toFixed(1)}</p>
        <p>Median: {data.median.toFixed(1)}</p>
        <p>Q3: {data.q3.toFixed(1)}</p>
        <p>Max: {data.max.toFixed(1)}</p>
        <p>Mean: {data.mean.toFixed(1)}</p>
        {data.outliers && data.outliers.length > 0 && (
          <p>Outliers: {data.outliers.map((o) => o.toFixed(1)).join(", ")}</p>
        )}
      </div>
    )
  }
  return null
}

// Custom tooltip for the stacked bar chart
const StackedBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-bold">{payload[0].payload.season}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function SeasonalDefectDashboard() {
  const [selectedYears, setSelectedYears] = useState(["2025"])
  const [selectedDefectTypes, setSelectedDefectTypes] = useState(defectTypes.map((type) => type.id))
  const [chartType, setChartType] = useState<"stacked" | "heatmap">("stacked")

  const handleYearChange = (value: string) => {
    setSelectedYears(value === "all" ? availableYears : [value])
  }

  const handleDefectTypeChange = (defectType: string, checked: boolean) => {
    setSelectedDefectTypes((prev) => (checked ? [...prev, defectType] : prev.filter((type) => type !== defectType)))
  }

  const toggleChartType = () => {
    setChartType((prev) => (prev === "stacked" ? "heatmap" : "stacked"))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Seasonal Defect Distribution</h2>
          <p className="text-muted-foreground">Analyze how defect patterns change across different seasons</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-lg font-medium">Year Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <Select defaultValue="2025" onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-lg font-medium">Defect Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {defectTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`defect-${type.id}`}
                    defaultChecked
                    onCheckedChange={(checked) => handleDefectTypeChange(type.id, checked as boolean)}
                  />
                  <Label htmlFor={`defect-${type.id}`}>{type.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-lg font-medium">Chart Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" onClick={toggleChartType}>
                {chartType === "stacked" ? "Switch to Heatmap" : "Switch to Stacked Bar"}
              </Button>
              <div className="flex items-center space-x-2">
                <Checkbox id="show-mean" defaultChecked />
                <Label htmlFor="show-mean">Show Mean</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="show-outliers" defaultChecked />
                <Label htmlFor="show-outliers">Show Outliers</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Box Plot */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg font-medium">Defect Distribution by Season</CardTitle>
          <CardDescription>Box plots showing the distribution of defect rates across seasons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={boxPlotData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis
                  label={{
                    value: "Defect Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[0, 12]}
                />
                <Tooltip content={<BoxPlotTooltip />} />
                <Legend />
                {boxPlotData.map((item, index) => (
                  <Bar
                    key={index}
                    dataKey="median"
                    data={[item]}
                    fill="transparent"
                    stroke="transparent"
                    shape={<BoxPlot />}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="mean"
                  stroke="#ff7300"
                  dot={{ stroke: "#ff7300", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Mean"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stacked Bar Chart or Heatmap */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle>{chartType === "stacked" ? "Defect Types by Season" : "Defect Type Heatmap by Season"}</CardTitle>
          <CardDescription>
            {chartType === "stacked"
              ? "Breakdown of defect types across different seasons"
              : "Intensity of each defect type across seasons"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "stacked" ? (
                <BarChart data={defectTypesBySeason} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="season" />
                  <YAxis
                    label={{
                      value: "Percentage (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip content={<StackedBarTooltip />} />
                  <Legend />
                  {selectedDefectTypes.includes("knots") && (
                    <Bar dataKey="knots" stackId="a" fill="#8884d8" name="Knots" />
                  )}
                  {selectedDefectTypes.includes("splits") && (
                    <Bar dataKey="splits" stackId="a" fill="#82ca9d" name="Splits" />
                  )}
                  {selectedDefectTypes.includes("holes") && (
                    <Bar dataKey="holes" stackId="a" fill="#ffc658" name="Holes" />
                  )}
                  {selectedDefectTypes.includes("wane") && (
                    <Bar dataKey="wane" stackId="a" fill="#ff8042" name="Wane" />
                  )}
                  {selectedDefectTypes.includes("decay") && (
                    <Bar dataKey="decay" stackId="a" fill="#a4de6c" name="Decay" />
                  )}
                  {selectedDefectTypes.includes("other") && (
                    <Bar dataKey="other" stackId="a" fill="#d0ed57" name="Other" />
                  )}
                </BarChart>
              ) : (
                // Simple heatmap-like visualization using a composed chart
                <ComposedChart
                  data={heatmapData.filter((item) => selectedDefectTypes.includes(item.defectType.toLowerCase()))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="season" type="category" />
                  <YAxis dataKey="defectType" type="category" width={80} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    shape={(props) => {
                      const { x, y, width, height, value } = props
                      const opacity = 0.2 + (value / 40) * 0.8 // Scale opacity based on value

                      return (
                        <Rectangle
                          {...props}
                          fill={`rgba(136, 132, 216, ${opacity})`}
                          stroke="#8884d8"
                          strokeWidth={1}
                        />
                      )
                    }}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg font-medium">Seasonal Insights</CardTitle>
          <CardDescription>Key findings from seasonal defect analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Highest Defect Season</h3>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full bg-rose-500`} />
                <span className="text-sm font-medium">Winter</span>
              </div>
              <div className="text-muted-foreground">5.4% avg. defect rate</div>
              <p className="text-sm text-muted-foreground">
                Winter shows the highest average defect rate, with knots being the most common defect type.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Lowest Defect Season</h3>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full bg-emerald-500`} />
                <span className="text-sm font-medium">Summer</span>
              </div>
              <div className="text-muted-foreground">3.7% avg. defect rate</div>
              <p className="text-sm text-muted-foreground">
                Summer has the lowest defect rate, with a more even distribution across defect types.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Most Variable Season</h3>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full bg-amber-500`} />
                <span className="text-sm font-medium">Winter</span>
              </div>
              <div className="text-muted-foreground">IQR: 4.3</div>
              <p className="text-sm text-muted-foreground">
                Winter shows the highest variability in defect rates, suggesting less consistent wood quality.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Most Consistent Season</h3>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full bg-emerald-500`} />
                <span className="text-sm font-medium">Summer</span>
              </div>
              <div className="text-muted-foreground">IQR: 3.0</div>
              <p className="text-sm text-muted-foreground">
                Summer provides the most consistent wood quality with the narrowest distribution of defects.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
