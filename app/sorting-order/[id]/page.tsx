"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { SortingOrderDetail } from "@/components/sorting-order-detail"
import { BoardDetailView } from "@/components/board-detail-view"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Sample board data
const boards = [
  {
    id: "BRD-4625",
    timestamp: "03/18/2025 3:58 PM",
    batchId: "20250318-06-Red Oak-15/16",
    batchName: "Red Oak Batch 06",
    woodType: "Red Oak",
    processing: "Kiln Dried",
    dimensions: {
      length: "8' 3 3/4\"",
      width: '5 1/2"',
      thickness: '15/16"',
    },
    totalSM: "4 sqft",
    volume: "4 bf",
    value: 4.9,
    grade: "1COMMON",
    status: "processed",
    defectCount: 2,
    defects: [
      {
        type: "Knot",
        count: 1,
        position: { x: 30, y: 40 },
        severity: "Minor",
        face: 1,
      },
      {
        type: "Split",
        count: 1,
        position: { x: 70, y: 20 },
        severity: "Moderate",
        face: 2,
      },
    ],
    imageFront: "/wooden-board-texture.png",
    imageBack: "/wooden-board-texture-back.png",
  },
  {
    id: "BRD-58920",
    timestamp: "03/18/2025 3:41 PM",
    batchId: "20250318-06-Red Oak-15/16",
    batchName: "Red Oak Batch 06",
    woodType: "Red Oak",
    processing: "Kiln Dried",
    dimensions: {
      length: "8' 3 3/4\"",
      width: '5 1/2"',
      thickness: '15/16"',
    },
    totalSM: "4 sqft",
    volume: "4 bf",
    value: 4.9,
    grade: "1COMMON",
    status: "processed",
    defectCount: 3,
    defects: [
      {
        type: "Knot",
        count: 2,
        position: { x: 30, y: 40 },
        severity: "Minor",
        face: 1,
      },
      {
        type: "Wane",
        count: 1,
        position: { x: 70, y: 20 },
        severity: "Major",
        face: 2,
      },
    ],
    imageFront: "/wooden-board-knots.png",
    imageBack: "/wane-wooden-board.png",
  },
  {
    id: "BRD-58919",
    timestamp: "03/18/2025 3:41 PM",
    batchId: "20250318-06-Red Oak-15/16",
    batchName: "Red Oak Batch 06",
    woodType: "Red Oak",
    processing: "Kiln Dried",
    dimensions: {
      length: "8' 3 3/4\"",
      width: '5 1/2"',
      thickness: '15/16"',
    },
    totalSM: "4 sqft",
    volume: "4 bf",
    value: 4.9,
    grade: "1COMMON",
    status: "processed",
    defectCount: 3,
    defects: [
      {
        type: "Check",
        count: 2,
        position: { x: 30, y: 40 },
        severity: "Moderate",
        face: 1,
      },
      {
        type: "Stain",
        count: 1,
        position: { x: 70, y: 20 },
        severity: "Minor",
        face: 2,
      },
    ],
    imageFront: "/placeholder.svg?key=p32bn",
    imageBack: "/wooden-board-with-stain.png",
  },
]

export default function SortingOrderPage() {
  const params = useParams()
  const orderId = params.id as string
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const [showAllDefects, setShowAllDefects] = useState(true)
  const [agreedWithAI, setAgreedWithAI] = useState(false)

  // Find the current board index
  const currentBoardIndex = selectedBoardId ? boards.findIndex((board) => board.id === selectedBoardId) : -1

  // Handle board selection
  const handleBoardSelect = (boardId: string) => {
    setSelectedBoardId(boardId)
  }

  // Handle navigation between boards
  const handlePreviousBoard = () => {
    if (currentBoardIndex > 0) {
      setSelectedBoardId(boards[currentBoardIndex - 1].id)
    }
  }

  const handleNextBoard = () => {
    if (currentBoardIndex < boards.length - 1) {
      setSelectedBoardId(boards[currentBoardIndex + 1].id)
    }
  }

  // Handle toggle show all defects
  const handleToggleShowAllDefects = () => {
    setShowAllDefects(!showAllDefects)
  }

  // Handle agree with AI
  const handleAgreeWithAI = (boardId: string) => {
    setAgreedWithAI(true)
  }

  // Handle disagree with AI
  const handleDisagreeWithAI = (boardId: string) => {
    // Implementation would go here
    console.log("Disagreed with AI for board:", boardId)
  }

  // Handle view grade reasons
  const handleViewGradeReasons = (board: any) => {
    // Implementation would go here
    console.log("Viewing grade reasons for board:", board.id)
  }

  // Handle back to sorting order
  const handleBackToSortingOrder = () => {
    setSelectedBoardId(null)
  }

  // Find the selected board
  const selectedBoard = boards.find((board) => board.id === selectedBoardId)

  return (
    <DashboardShell>
      {selectedBoard ? (
        <div className="space-y-4">
          <Button variant="ghost" className="mb-4" onClick={handleBackToSortingOrder}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sorting Order
          </Button>
          <Card>
            <BoardDetailView
              board={selectedBoard}
              onToggleShowAllDefects={handleToggleShowAllDefects}
              onAgreeWithAI={handleAgreeWithAI}
              onDisagreeWithAI={handleDisagreeWithAI}
              onViewGradeReasons={handleViewGradeReasons}
              showAllDefects={showAllDefects}
              agreedWithAI={agreedWithAI}
              // Navigation props
              onPreviousBoard={handlePreviousBoard}
              onNextBoard={handleNextBoard}
              currentBoardIndex={currentBoardIndex}
              totalBoards={boards.length}
              hasPreviousBoard={currentBoardIndex > 0}
              hasNextBoard={currentBoardIndex < boards.length - 1}
            />
          </Card>
        </div>
      ) : (
        <SortingOrderDetail batchId={orderId} onBoardSelect={handleBoardSelect} />
      )}
    </DashboardShell>
  )
}
