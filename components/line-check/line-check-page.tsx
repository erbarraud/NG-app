"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineCheckDashboard } from "./line-check-dashboard"
import { LineCheckLiveView } from "./line-check-live-view"
import { LineCheckBoardDetail } from "./line-check-board-detail"
import type { Board } from "@/types/board"

export function LineCheckPage() {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Handle board selection
  const handleBoardSelect = (board: Board) => {
    setSelectedBoard(board)
    setActiveTab("board-detail")
  }

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setActiveTab("dashboard")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="live-view">Live View</TabsTrigger>
          {selectedBoard && <TabsTrigger value="board-detail">Board Detail</TabsTrigger>}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <LineCheckDashboard onBoardSelect={handleBoardSelect} />
        </TabsContent>

        <TabsContent value="live-view" className="space-y-4">
          <LineCheckLiveView onBoardSelect={handleBoardSelect} />
        </TabsContent>

        <TabsContent value="board-detail" className="space-y-4">
          {selectedBoard && <LineCheckBoardDetail board={selectedBoard} onBack={handleBackToDashboard} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
