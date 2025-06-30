"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { LineCheckLiveView } from "@/components/line-check/line-check-live-view"
import { LineCheckDashboard } from "@/components/line-check/line-check-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, List } from "lucide-react"

export default function LineCheckPage() {
  const [activeTab, setActiveTab] = useState("live-view")

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <DashboardShell>
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Line Check</h1>
          <TabsList>
            <TabsTrigger value="live-view" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Live View
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Scanner
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="live-view" className="space-y-4">
          <LineCheckLiveView />
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <LineCheckDashboard />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
