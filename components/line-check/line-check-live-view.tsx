"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  RefreshCw,
  Pause,
  Play,
  AlertCircle,
  DollarSign,
  Hash,
  Clock,
  Maximize,
  Minimize,
  Package,
  Briefcase,
} from "lucide-react"
import type { Board } from "@/types/board"
import { cn } from "@/lib/utils"
import { generateRandomBoard } from "@/lib/data-utils"
import NextImage from "next/image"
import { useRouter } from "next/navigation"

// Initial sample data for boards
const initialBoardsData: Board[] = [
  {
    id: "LV-1001",
    timestamp: "15:45:22",
    batchId: "B-789",
    batchName: "Pine Batch 789",
    woodType: "Pine",
    processing: "Kiln Dried",
    dimensions: {
      length: "8'",
      width: '6"',
      thickness: '2"',
    },
    totalSM: "4.0",
    volume: "0.67 ft³",
    value: 12.5,
    grade: "Select",
    status: "active",
    defectCount: 1,
    defects: [{ type: "Knot", count: 1, position: { x: 300, y: 25 }, severity: "Minor", face: 1 }],
    imageFront: "/board-preview.png",
    imageBack: "/board-preview.png",
    currentFace: 1,
  },
  {
    id: "LV-1002",
    timestamp: "15:46:05",
    batchId: "B-790",
    batchName: "Oak Batch 790",
    woodType: "Oak",
    processing: "Air Dried",
    dimensions: { length: "10'", width: '8"', thickness: '2"' },
    totalSM: "6.7",
    volume: "1.11 ft³",
    value: 18.75,
    grade: "Common",
    status: "active",
    defectCount: 1,
    defects: [{ type: "Split", count: 1, position: { x: 500, y: 25 }, severity: "Moderate", face: 2 }],
    imageFront: "/board-preview.png",
    imageBack: "/board-preview.png",
    currentFace: 2,
  },
]

interface LiveViewProps {
  onBoardSelect?: (board: Board) => void
  currentOrderId?: string
  currentShift?: string
}

export function LineCheckLiveView({
  onBoardSelect,
  currentOrderId = "SO-00123",
  currentShift = "Day Shift - Alpha",
}: LiveViewProps) {
  const router = useRouter()
  const [boards, setBoards] = useState<Board[]>(initialBoardsData)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [updatedBoardIds, setUpdatedBoardIds] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [autoScrollPaused, setAutoScrollPaused] = useState(false)
  const [scanRate, setScanRate] = useState(5)
  const [totalScanned, setTotalScanned] = useState(initialBoardsData.length)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const boardListRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const fullScreenContainerRef = useRef<HTMLDivElement>(null)

  const addNewBoard = useCallback(() => {
    if (isPaused) return
    const newBoard = generateRandomBoard(totalScanned + 1)
    setBoards((prevBoards) => [newBoard, ...prevBoards.slice(0, 199)])
    setUpdatedBoardIds([newBoard.id])
    setTotalScanned((prev) => prev + 1)
    if (!autoScrollPaused && boardListRef.current) {
      boardListRef.current.scrollTop = 0
    }
  }, [totalScanned, isPaused, autoScrollPaused])

  useEffect(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
    const intervalMs = (60 * 1000) / scanRate
    if (!isPaused) {
      scanIntervalRef.current = setInterval(() => {
        setIsRefreshing(true)
        addNewBoard()
        if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = setTimeout(() => {
          setIsRefreshing(false)
          setTimeout(() => setUpdatedBoardIds([]), 1000)
        }, 500)
      }, intervalMs)
    }
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
    }
  }, [scanRate, isPaused, addNewBoard])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleScroll = useCallback(() => {
    setAutoScrollPaused(!!(boardListRef.current && boardListRef.current.scrollTop > 10))
  }, [])

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    addNewBoard()
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false)
      setTimeout(() => setUpdatedBoardIds([]), 1000)
    }, 500)
  }, [addNewBoard])

  const togglePause = useCallback(() => setIsPaused((prev) => !prev), [])
  const handleScanRateChange = useCallback((newRate: number) => setScanRate(newRate), [])

  const handleBoardIdClick = useCallback(
    (board: Board) => {
      if (onBoardSelect) {
        onBoardSelect(board)
      } else {
        router.push(`/board-finder?boardId=${board.id}`)
      }
    },
    [onBoardSelect, router],
  )

  const isDocumentFullScreen = useCallback(
    () =>
      !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ),
    [],
  )

  const requestFullScreen = useCallback(() => {
    if (!fullScreenContainerRef.current) return false
    try {
      if (fullScreenContainerRef.current.requestFullscreen) fullScreenContainerRef.current.requestFullscreen()
      else if ((fullScreenContainerRef.current as any).mozRequestFullScreen)
        (fullScreenContainerRef.current as any).mozRequestFullScreen()
      else if ((fullScreenContainerRef.current as any).webkitRequestFullscreen)
        (fullScreenContainerRef.current as any).webkitRequestFullscreen()
      else if ((fullScreenContainerRef.current as any).msRequestFullscreen)
        (fullScreenContainerRef.current as any).msRequestFullscreen()
      else return false
      return true
    } catch (error) {
      console.error("Error requesting fullscreen:", error)
      return false
    }
  }, [])

  const exitFullScreen = useCallback(() => {
    try {
      if (!isDocumentFullScreen()) return false
      if (document.exitFullscreen) document.exitFullscreen()
      else if ((document as any).mozCancelFullScreen) (document as any).mozCancelFullScreen()
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen()
      else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen()
      else return false
      return true
    } catch (error) {
      console.error("Error exiting fullscreen:", error)
      return false
    }
  }, [isDocumentFullScreen])

  const toggleFullScreen = useCallback(() => {
    try {
      const success = !isFullScreen ? requestFullScreen() : exitFullScreen()
      if (success) setIsFullScreen(!isFullScreen)
    } catch (error) {
      console.error("Error toggling fullscreen:", error)
    }
  }, [isFullScreen, requestFullScreen, exitFullScreen])

  useEffect(() => {
    const handleFullScreenChange = () => setIsFullScreen(isDocumentFullScreen())
    document.addEventListener("fullscreenchange", handleFullScreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange)
    document.addEventListener("mozfullscreenchange", handleFullScreenChange)
    document.addEventListener("MSFullscreenChange", handleFullScreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange)
    }
  }, [isDocumentFullScreen])

  const boardItemHeightClass = isFullScreen ? "h-40" : "h-32"

  return (
    <div
      ref={fullScreenContainerRef}
      className={cn("space-y-4", isFullScreen && "bg-background p-4 min-h-screen flex flex-col")}
    >
      {isFullScreen && (
        // Mimic DashboardShell header style
        <div
          className="fixed top-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground px-4 py-2 flex justify-between items-center h-14 shadow-sm"
          style={{ borderBottom: "1px solid #4ED586" }} // Match the green border bottom
        >
          <div className="flex items-center gap-3">
            <NextImage
              src="/images/neural-grader-logo.png"
              alt="Neural Grader Logo"
              width={120}
              height={28}
              className="h-7 w-auto filter brightness-0 invert" // Invert logo for white appearance on dark bg
            />
            <div className="h-6 border-l border-secondary-foreground/50"></div>{" "}
            {/* Separator color adjusted for contrast */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Live Scanning</span>
              <div className="flex items-center gap-3 text-xs text-secondary-foreground/80">
                {" "}
                {/* Adjusted opacity for subtext */}
                <div className="flex items-center gap-1">
                  <Package size={14} />
                  <span>Order: {currentOrderId}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={14} />
                  <span>Shift: {currentShift}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
            className="bg-secondary-foreground/10 hover:bg-secondary-foreground/20 text-secondary-foreground border-secondary-foreground/30" // Style button for contrast
          >
            <Minimize className="h-4 w-4 mr-1.5" /> Exit Full Screen
          </Button>
        </div>
      )}

      {!isFullScreen && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Live Scanning View</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time feed from scanner</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <select
              value={scanRate}
              onChange={(e) => handleScanRateChange(Number(e.target.value))}
              className="text-xs border rounded px-1.5 py-0.5 h-7"
              disabled={isPaused}
            >
              {[1, 5, 10, 30, 60, 120].map((rate) => (
                <option key={rate} value={rate}>
                  {rate}/min
                </option>
              ))}
            </select>
            <Button variant="outline" size="xs" onClick={togglePause} className={cn(isPaused && "bg-orange-50")}>
              {isPaused ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={handleRefresh}
              className={cn(isRefreshing && "animate-pulse")}
              disabled={isPaused}
            >
              <RefreshCw className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="xs" onClick={toggleFullScreen}>
              <Maximize className="h-3 w-3 mr-1" />
              Full Screen
            </Button>
          </div>
        </div>
      )}

      <Card className={cn("overflow-hidden", isFullScreen && "flex-1 mt-16")}>
        <CardContent className="p-0 h-full flex flex-col">
          <div className="bg-muted/30 px-3 py-1.5 border-b flex items-center justify-between text-sm">
            <div className="font-medium">Recent Boards</div>
            <div className="text-xs text-muted-foreground">
              {autoScrollPaused && "Auto-scroll paused"}
              {isPaused && !autoScrollPaused && "Feed paused"}
            </div>
          </div>
          <div
            ref={boardListRef}
            className={cn("overflow-y-auto divide-y divide-border", isFullScreen ? "flex-1" : "max-h-[70vh]")}
            onScroll={handleScroll}
          >
            {boards.map((board, index) => (
              <div
                key={board.id}
                className={cn(
                  "relative w-full overflow-hidden group bg-gray-900",
                  boardItemHeightClass,
                  updatedBoardIds.includes(board.id) && "ring-2 ring-primary ring-inset",
                  index === 0 && updatedBoardIds.includes(board.id) && "animate-slide-in-top",
                )}
              >
                <NextImage
                  src={board.imageFront || `/placeholder.svg?width=600&height=200&query=board+${board.id}`}
                  alt={`Board ${board.id}`}
                  layout="fill"
                  objectFit="contain"
                  className="transition-opacity duration-300 group-hover:opacity-80"
                />
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white transition-opacity duration-300",
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div className="flex flex-col gap-0.5">
                      <button
                        className="font-semibold text-sm hover:underline flex items-center gap-1.5 w-fit"
                        onClick={() => handleBoardIdClick(board)}
                        title={`Board ID: ${board.id}`}
                      >
                        <Hash className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{board.id}</span>
                      </button>
                      <div
                        className="flex items-center gap-1.5 text-xs text-gray-200"
                        title={`Order ID: ${board.batchId}`}
                      >
                        <Package className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{board.batchId}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-0.5 mt-1 sm:mt-0">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5 leading-tight bg-white/20 backdrop-blur-sm text-white border-white/30 w-fit"
                      >
                        {board.grade}
                      </Badge>
                      <div
                        className="flex items-center gap-1 text-xs font-medium"
                        title={`Value: $${board.value.toFixed(2)}`}
                      >
                        <DollarSign className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                        <span>${board.value.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {updatedBoardIds.includes(board.id) && (
                  <Badge
                    variant="default"
                    className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 animate-pulse shadow-lg"
                  >
                    New
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!isFullScreen && (
        <div className="p-3 bg-muted/50 rounded-lg border text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              Live feed with board images (original aspect ratio). KPIs are overlaid. Click Board ID for details.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
