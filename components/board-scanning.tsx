"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Clock,
  Eye,
  FileText,
  MicroscopeIcon as MagnifyingGlass,
  Search,
  ThumbsDown,
  EyeOff,
  Layers,
  ThumbsUp,
  Box,
  AlertCircleIcon,
  Percent,
  ChevronLeft,
  ChevronRight,
  TreesIcon as Tree,
  Zap,
  SeparatorHorizontal,
  SeparatorVertical,
  Layers3,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { BoardInspectionOverlay } from "@/components/board-inspection-overlay"
import { BoardFaceView } from "@/components/board-face-view"
import type { Board } from "@/types/board"

// Import sample data
import { boards, archivedBoards } from "@/data/sample-boards"

// First, add the import for the FeedbackModal component
import { FeedbackModal, type FeedbackData } from "@/components/feedback-modal"

import { GradeRejectionModal } from "@/components/grade-rejection-modal"
// Assuming DecisionContext type is available or defined in grade-rejection-modal.tsx and exported
// If not, you might need: import type { DecisionContext } from "@/components/grade-rejection-modal";
// For now, we'll assume it's implicitly available or the modal handles a null prop gracefully with sample data.

interface BoardScanningProps {
  boardId?: string
  onBack?: () => void
}

/**
 * BoardScanning - Main component for viewing and inspecting boards
 *
 * This component displays the current board being scanned, previous boards,
 * and a table of archived boards. It allows for inspection of boards with
 * defect highlighting and filtering.
 */
export function BoardScanning({ boardId, onBack }: BoardScanningProps = {}) {
  // State for live mode and board selection
  const [isLive, setIsLive] = useState(!boardId)
  // const [selectedBoard, setSelectedBoard] = useState<string | null>(boardId || null)
  const initialBoardIndex = boardId ? boards.findIndex((b) => b.id === boardId) : 0
  const [currentBoardIndex, setCurrentBoardIndex] = useState(initialBoardIndex !== -1 ? initialBoardIndex : 0)
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // State for dialogs and inspection
  const [isInspecting, setIsInspecting] = useState(false)
  const [inspectionBoard, setInspectionBoard] = useState<Board | null>(null)
  const [inspectionFace, setInspectionFace] = useState<1 | 2>(1)
  const [showAllDefects, setShowAllDefects] = useState(true)

  // Add these state variables inside the BoardScanning component, near the other state declarations
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackType, setFeedbackType] = useState<"agree" | "disagree">("disagree")

  // Add magnifier state
  const [magnifierEnabled, setMagnifierEnabled] = useState(false)

  const [showDecisionLogicModal, setShowDecisionLogicModal] = useState(false)
  // We'll pass null for now, relying on the modal's sample data if decisionContext isn't fully available
  const [decisionContextForModal, setDecisionContextForModal] = useState<any | null>(null)

  // Add defect selection state
  const face1DefectsList = [
    { name: "Knot", color: "bg-red-500 hover:bg-red-600" },
    { name: "Split", color: "bg-amber-500 hover:bg-amber-600" },
    { name: "Wane", color: "bg-blue-500 hover:bg-blue-600" },
    { name: "Stain", color: "bg-purple-500 hover:bg-purple-600" },
    { name: "Pitch Pocket", color: "bg-emerald-500 hover:bg-emerald-600" },
    { name: "Shake", color: "bg-rose-500 hover:bg-rose-600" },
  ]

  const face2DefectsList = [
    { name: "Knot", color: "bg-red-500 hover:bg-red-600" },
    { name: "Check", color: "bg-orange-500 hover:bg-orange-600" },
    { name: "Warp", color: "bg-teal-500 hover:bg-teal-600" },
    { name: "Decay", color: "bg-indigo-500 hover:bg-indigo-600" },
    { name: "Hole", color: "bg-lime-500 hover:bg-lime-600" },
  ]

  const [selectedDefectsFace1, setSelectedDefectsFace1] = useState<string[]>(face1DefectsList.map((d) => d.name))
  const [selectedDefectsFace2, setSelectedDefectsFace2] = useState<string[]>(face2DefectsList.map((d) => d.name))

  // Get the current board and previous boards
  const currentBoard = boards[currentBoardIndex]

  const handlePreviousBoard = useCallback(() => {
    setCurrentBoardIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : 0
      // Reset defect selections for the new board
      // This assumes face1DefectsList/face2DefectsList are static or you'd derive from boards[newIndex].defects
      setSelectedDefectsFace1(face1DefectsList.map((d) => d.name))
      setSelectedDefectsFace2(face2DefectsList.map((d) => d.name))
      return newIndex
    })
  }, [face1DefectsList, face2DefectsList]) // Add dependencies

  const handleNextBoard = useCallback(() => {
    setCurrentBoardIndex((prevIndex) => {
      const newIndex = prevIndex < boards.length - 1 ? prevIndex + 1 : prevIndex
      // Reset defect selections for the new board
      setSelectedDefectsFace1(face1DefectsList.map((d) => d.name))
      setSelectedDefectsFace2(face2DefectsList.map((d) => d.name))
      return newIndex
    })
  }, [face1DefectsList, face2DefectsList]) // Add dependencies

  // ... (after all other useState, useCallback hooks)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent navigation if an input field, textarea, or select is focused
      const targetElement = event.target as HTMLElement
      if (
        targetElement.tagName === "INPUT" ||
        targetElement.tagName === "TEXTAREA" ||
        targetElement.tagName === "SELECT" ||
        targetElement.isContentEditable
      ) {
        return
      }

      if (event.key === "ArrowLeft") {
        if (currentBoardIndex > 0) {
          handlePreviousBoard()
        }
      } else if (event.key === "ArrowRight") {
        if (currentBoardIndex < boards.length - 1) {
          handleNextBoard()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentBoardIndex, handlePreviousBoard, handleNextBoard, boards.length])

  // Ensure the current board has the correct image paths
  if (!currentBoard.imageFront) {
    currentBoard.imageFront = "/wooden-board-texture.png"
  }
  if (!currentBoard.imageBack) {
    currentBoard.imageBack = "/wooden-board-texture-back.png"
  }

  const previousBoards = boards.slice(1, 3)

  // Also ensure that any previous boards or archived boards have the correct image paths
  previousBoards.forEach((board) => {
    if (!board.imageFront) {
      board.imageFront = "/wooden-board-texture.png"
    }
    if (!board.imageBack) {
      board.imageBack = "/wooden-board-texture-back.png"
    }
  })

  // Filter archived boards based on search
  const filteredArchivedBoards = archivedBoards.filter(
    (board) =>
      board.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.grade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  filteredArchivedBoards.forEach((board) => {
    if (!board.imageFront) {
      board.imageFront = "/wooden-board-texture.png"
    }
    if (!board.imageBack) {
      board.imageBack = "/wooden-board-texture-back.png"
    }
  })

  /**
   * Handle board selection
   */
  const handleBoardSelect = useCallback(
    (boardId: string) => {
      const newIndex = boards.findIndex((b) => b.id === boardId)
      if (newIndex !== -1) {
        setCurrentBoardIndex(newIndex)
        // Reset defect selections for the new board
        setSelectedDefectsFace1(face1DefectsList.map((d) => d.name))
        setSelectedDefectsFace2(face2DefectsList.map((d) => d.name))
      }
    },
    [face1DefectsList, face2DefectsList],
  )

  /**
   * Navigate back to the Board Finder search results
   */
  const handleBackToList = useCallback(() => {
    if (onBack) {
      onBack()
    } else {
      router.push("/board-finder")
    }
  }, [router, onBack])

  /**
   * Toggle expanded view for a board
   */
  const toggleExpandBoard = useCallback((boardId: string) => {
    setExpandedBoard((prev) => (prev === boardId ? null : boardId))
  }, [])

  /**
   * Open the inspection overlay for a board
   */
  const handleInspectBoard = useCallback((board: Board | null, face: 1 | 2 = 1) => {
    if (!board) return

    setInspectionBoard(board)
    setInspectionFace(face)
    setIsInspecting(true)
  }, [])

  /**
   * Toggle showing all defects vs. only significant ones
   */
  const toggleShowAllDefects = useCallback(() => {
    setShowAllDefects((prev) => !prev)
  }, [])

  /**
   * Toggle magnifier functionality
   */
  const toggleMagnifier = useCallback(() => {
    setMagnifierEnabled((prev) => !prev)
  }, [])

  const toggleDefectFace1 = useCallback((defect: string) => {
    setSelectedDefectsFace1((prev) => (prev.includes(defect) ? prev.filter((d) => d !== defect) : [...prev, defect]))
  }, [])

  const toggleDefectFace2 = useCallback((defect: string) => {
    setSelectedDefectsFace2((prev) => (prev.includes(defect) ? prev.filter((d) => d !== defect) : [...prev, defect]))
  }, [])

  // Add this function inside the BoardScanning component
  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    console.log("Feedback submitted:", feedback)
    // In a real application, you would send this data to your backend
    alert("Thank you for your feedback!")
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page title and description */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Board Inspector</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-base px-3 py-1">
              Order: {currentBoard.batchId} - {currentBoard.batchName}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/board-finder/order-view?orderId=${currentBoard.batchId}`)}
              className="ml-2"
            >
              <Layers className="mr-2 h-4 w-4" />
              View All Boards in This Order
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">Find and analyze boards in the system</p>
      </div>

      {/* Current Board - Most Prominent */}
      <Card className="border border-border overflow-hidden relative">
        <CardHeader className="border-b border-border pb-3">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousBoard}
                  disabled={currentBoardIndex === 0}
                  aria-label="Previous Board"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-2xl font-bold">{currentBoard.id}</div>
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-base font-semibold"
                >
                  {currentBoard.grade}
                </Badge>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextBoard}
                  disabled={currentBoardIndex === boards.length - 1}
                  aria-label="Next Board"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Basic info badges */}
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tree className="h-3 w-3" />
                    {currentBoard.woodType}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {currentBoard.processing}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{currentBoard.timestamp}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">Value</div>
                <div className="text-xl font-bold">${currentBoard.value.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardHeader>
        {/* Board metadata */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              {
                label: "Length",
                value: `${currentBoard.dimensions.length}"`,
                icon: SeparatorHorizontal, // Horizontal line represents length
                tooltip: "Board length measurement",
              },
              {
                label: "Width",
                value: `${currentBoard.dimensions.width}"`,
                icon: SeparatorVertical, // Vertical line represents width
                tooltip: "Board width measurement",
              },
              {
                label: "Thickness",
                value: `${currentBoard.dimensions.thickness}"`,
                icon: Layers3, // Stacked layers represent thickness/depth
                tooltip: "Board thickness measurement",
              },
              {
                label: "Volume",
                value: currentBoard.volume,
                icon: Box,
                tooltip: "Total board volume",
              },
              {
                label: "Total Defects",
                value: currentBoard.defectCount,
                icon: AlertCircleIcon,
                tooltip: "Number of defects found",
              },
              {
                label: "Yield",
                value: typeof currentBoard.yield === "number" ? `${currentBoard.yield.toFixed(0)}%` : "85%",
                icon: Percent,
                tooltip: "Usable material percentage",
              },
            ].map((item) => (
              <div key={item.label} className="bg-muted/40 p-3 rounded-lg shadow-sm" title={item.tooltip}>
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <item.icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  {item.label}
                </div>
                <div className="text-sm font-semibold text-foreground truncate" title={String(item.value)}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Quick Actions Bar here - right after the header */}
        <div className="bg-muted/30 p-3 border-b">
          <div className="flex flex-wrap gap-3 justify-start">
            {/* Left side - Action buttons */}
            <div className="flex flex-wrap gap-3 justify-start">
              <Button
                variant={magnifierEnabled ? "default" : "outline"}
                className={`flex items-center gap-2 ${magnifierEnabled ? "bg-primary text-primary-foreground" : ""}`}
                onClick={toggleMagnifier}
                aria-pressed={magnifierEnabled}
              >
                <MagnifyingGlass className="h-4 w-4" />
                {magnifierEnabled ? "Disable Magnifier" : "Enable Magnifier"}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowAllDefects(!showAllDefects)}
              >
                {showAllDefects ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide Minor Defects
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show All Defects
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                onClick={() => {
                  setFeedbackType("agree")
                  // For "agree", we could just log it without showing the modal
                  console.log("User agreed with AI assessment for board:", currentBoard.id)
                  alert("Thank you for confirming the AI assessment!")
                }}
              >
                <ThumbsUp className="h-4 w-4" />
                Agree with NG AI
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                onClick={() => {
                  setFeedbackType("disagree")
                  setShowFeedbackModal(true)
                }}
              >
                <ThumbsDown className="h-4 w-4" />
                Disagree with NG AI
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  // TODO: Construct a proper DecisionContext from currentBoard and related data
                  // For now, passing a basic structure or null to trigger sample data in the modal
                  const tempDecisionContext = {
                    board: currentBoard,
                    // These would need to be populated based on actual logic or API calls
                    selectedSort: {
                      sortId: "TEMP-SORT-001",
                      sortName: `Selected Sort for ${currentBoard.id}`,
                      gradeAssigned: currentBoard.grade,
                      isSelected: true,
                      decisionSummary: ["Temporary summary based on current board."],
                      defectChecks: [], // Populate as needed
                      fullGradingLogic:
                        currentBoard.gradeOptions?.map((opt) => ({
                          ruleName: opt.name,
                          result: opt.selected ? "Pass" : "Fail",
                          actualValue: "N/A",
                          thresholdValue: "N/A",
                          reason: opt.reason,
                        })) || [],
                    },
                    rejectedSorts:
                      currentBoard.gradeOptions
                        ?.filter((opt) => !opt.selected)
                        .map((opt) => ({
                          sortId: `TEMP-REJ-${opt.name}`,
                          sortName: `Rejected: ${opt.name}`,
                          isSelected: false,
                          decisionSummary: [],
                          defectChecks: [],
                          rejectionReasons: [
                            { criterion: "General", reason: opt.reason || "Not selected", status: "Fail" },
                          ],
                        })) || [],
                  }
                  setDecisionContextForModal(tempDecisionContext)
                  setShowDecisionLogicModal(true)
                }}
              >
                <FileText className="h-4 w-4" />
                See rejected rules
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  // TODO: Implement reference bundle functionality
                  console.log("Adding board to reference bundle:", currentBoard.id)
                  alert(`Board ${currentBoard.id} added to reference bundle!`)
                }}
              >
                <FileText className="h-4 w-4" />
                Add to Reference Bundle
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Board Images */}
            <div className="space-y-6">
              {/* Face 1 */}
              <div className="space-y-3">
                <BoardFaceView
                  board={currentBoard}
                  face={1}
                  showAllDefects={showAllDefects}
                  magnifierEnabled={magnifierEnabled}
                />
                <div className="flex flex-wrap gap-2">
                  {face1DefectsList.map((defect) => {
                    const isSelected = selectedDefectsFace1.includes(defect.name)
                    return (
                      <Badge
                        key={defect.name}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? `${defect.color} text-white shadow-md`
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                        onClick={() => toggleDefectFace1(defect.name)}
                      >
                        {defect.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Face 2 */}
              <div className="space-y-3">
                <BoardFaceView
                  board={currentBoard}
                  face={2}
                  showAllDefects={showAllDefects}
                  magnifierEnabled={magnifierEnabled}
                />
                <div className="flex flex-wrap gap-2">
                  {face2DefectsList.map((defect) => {
                    const isSelected = selectedDefectsFace2.includes(defect.name)
                    return (
                      <Badge
                        key={defect.name}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? `${defect.color} text-white shadow-md`
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                        onClick={() => toggleDefectFace2(defect.name)}
                      >
                        {defect.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Clear Cuttings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Clear Cuttings Face 1 */}
              <div className="border border-border rounded-md p-4">
                <h3 className="font-semibold mb-4">Clear Cuttings (Face 1)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">6' 2 3/4" × 5 3/8"</span>
                    <span className="font-medium">33.28 units</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">2' × 4 13/16"</span>
                    <span className="font-medium">9.64 units</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Units:</span>
                    <span className="font-bold text-lg">43</span>
                  </div>
                </div>
              </div>

              {/* Clear Cuttings Face 2 */}
              <div className="border border-border rounded-md p-4">
                <h3 className="font-semibold mb-4">Clear Cuttings (Face 2)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">3' 3 3/4" × 5 3/16"</span>
                    <span className="font-medium">17.2 units</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">3' 5 3/4" × 4 7/8"</span>
                    <span className="font-medium">16.83 units</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Units:</span>
                    <span className="font-bold text-lg">34</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Archived Boards Table - OPTIMIZED FOR LESS SPACE */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Previously Scanned Boards</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search boards..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>All boards from the current sorting order</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="h-10">
                <TableHead className="py-2">Board ID</TableHead>
                <TableHead className="py-2">Scan Time</TableHead>
                <TableHead className="py-2">Grade</TableHead>
                <TableHead className="py-2">Defects</TableHead>
                <TableHead className="py-2 w-24">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArchivedBoards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No boards found matching your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredArchivedBoards.map((board) => (
                  <TableRow
                    key={board.id}
                    className="cursor-pointer hover:bg-muted/50 h-12"
                    onClick={() => handleBoardSelect(board.id)}
                  >
                    <TableCell className="font-medium py-2">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-primary hover:underline text-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBoardSelect(board.id)
                          // router.push(`/board-finder/${board.id}`)
                        }}
                      >
                        {board.id}
                      </Button>
                    </TableCell>
                    <TableCell className="py-2 text-sm">{board.timestamp}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant={board.status === "rejected" ? "destructive" : "outline"} className="text-xs">
                        {board.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      {board.defectCount > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          <StatusIndicator
                            type={board.defectCount > 3 ? "error" : board.defectCount > 1 ? "warning" : "info"}
                            caption={`${board.defectCount} defects`}
                          />
                          {board.defects?.slice(0, 1).map((defect, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {defect.type}
                            </Badge>
                          ))}
                          {board.defects?.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                              +{board.defects.length - 1}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <StatusIndicator type="success" caption="No defects" />
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleInspectBoard(board, 1)
                          }}
                        >
                          <MagnifyingGlass className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBoardSelect(board.id)
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Board Inspection Overlay */}
      <BoardInspectionOverlay
        isOpen={isInspecting}
        onClose={() => setIsInspecting(false)}
        board={inspectionBoard}
        face={inspectionFace}
        showAllDefects={showAllDefects}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        boardId={currentBoard.id}
        currentGrade={currentBoard.grade.toLowerCase().replace(/\s+/g, "-")}
        aiSelectedGradeId="1common"
        aiSelectedGradeLabel="1 Common"
      />

      {/* Grade Rejection Modal (Decision Logic) */}
      <GradeRejectionModal
        isOpen={showDecisionLogicModal}
        onClose={() => setShowDecisionLogicModal(false)}
        decisionContext={decisionContextForModal}
      />
    </div>
  )
}
