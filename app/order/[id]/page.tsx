"use client"

import { Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import OrderDetail from "@/components/order-detail"
import { sampleBoards } from "@/data/sample-boards"
import type { Board } from "@/types/board"
import LoadingSpinner from "@/components/ui/loading-spinner"

function OrderDetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const batchId = params.id as string

  const boardIdFromQuery =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("board") : null
  const selectedBoardId = boardIdFromQuery

  const selectedBoardData = selectedBoardId ? sampleBoards.find((board: Board) => board.id === selectedBoardId) : null

  const handleBoardSelect = (boardId: string) => {
    // Navigate to the Board Inspector page for the specific board ID
    router.push(`/line-check?boardId=${boardId}`)
  }

  const handleCloseBoardDetail = () => {
    router.push(`/order/${batchId}`, { scroll: false })
  }

  return (
    <DashboardShell>
      <div className="flex h-full overflow-hidden -m-4 sm:-m-6">
        <div className="w-full overflow-y-auto p-4 md:p-6">
          <OrderDetail batchId={batchId} onBoardSelect={handleBoardSelect} />
        </div>
      </div>
    </DashboardShell>
  )
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner className="h-12 w-12" />
          </div>
        </DashboardShell>
      }
    >
      <OrderDetailPageContent />
    </Suspense>
  )
}
