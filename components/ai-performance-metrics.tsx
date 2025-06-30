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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for AI performance metrics
const weeklyData = [
  { name: "Mon", aiOverrides: 12, aiApprovals: 308, overrideRate: 3.8 },
  { name: "Tue", aiOverrides: 15, aiApprovals: 317, overrideRate: 4.5 },
  { name: "Wed", aiOverrides: 10, aiApprovals: 331, overrideRate: 2.9 },
  { name: "Thu", aiOverrides: 18, aiApprovals: 316, overrideRate: 5.4 },
  { name: "Fri", aiOverrides: 8, aiApprovals: 342, overrideRate: 2.3 },
  { name: "Sat", aiOverrides: 11, aiApprovals: 334, overrideRate: 3.2 },
  { name: "Sun", aiOverrides: 9, aiApprovals: 333, overrideRate: 2.6 },
]

// Sample data for override reasons
const overrideReasons = [
  { name: "Knot Misclassification", value: 32 },
  { name: "Missed Defect", value: 24 },
  { name: "Grade Disagreement", value: 18 },
  { name: "False Positive", value: 9 },
]

// Sample data for operator-specific metrics
const operatorData = [
  { name: "John D.", overrides: 22, approvals: 478, overrideRate: 4.4 },
  { name: "Sarah M.", overrides: 18, approvals: 512, overrideRate: 3.4 },
  { name: "Mike T.", overrides: 25, approvals: 455, overrideRate: 5.2 },
  { name: "Lisa K.", overrides: 10, approvals: 490, overrideRate: 2.0 },
  { name: "Robert P.", overrides: 8, approvals: 392, overrideRate: 2.0 },
]

// Colors for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function AIPerformanceMetrics() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Performance Metrics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>AI Accuracy Rate</CardTitle>
            <CardDescription>Based on operator feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-500">96.5%</div>
            <p className="text-sm text-muted-foreground mt-1">↑ 1.2% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Overrides</CardTitle>
            <CardDescription>Operator disagreements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-500">83</div>
            <p className="text-sm text-muted-foreground mt-1">↓ 5 from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Learning Rate</CardTitle>
            <CardDescription>AI improvement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-500">+2.8%</div>
            <p className="text-sm text-muted-foreground mt-1">Weekly improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="override-trend">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="override-trend">Override Trend</TabsTrigger>
          <TabsTrigger value="override-reasons">Override Reasons</TabsTrigger>
          <TabsTrigger value="operator-metrics">Operator Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="override-trend" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>AI Override Trend</CardTitle>
              <CardDescription>Daily override rate and counts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#f43f5e" />
                    <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="aiOverrides" name="AI Overrides" fill="#f43f5e" />
                    <Bar yAxisId="right" dataKey="aiApprovals" name="AI Approvals" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="override-reasons" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Override Reasons</CardTitle>
              <CardDescription>Why operators disagree with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overrideReasons}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {overrideReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} overrides`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operator-metrics" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Operator Override Metrics</CardTitle>
              <CardDescription>Override rates by operator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={operatorData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "overrideRate") return [`${value}%`, "Override Rate"]
                        return [value, name]
                      }}
                    />
                    <Legend />
                    <Bar dataKey="overrideRate" name="Override Rate (%)" fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
