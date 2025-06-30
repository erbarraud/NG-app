"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, ChevronLeft, ChevronRight, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { BoardDetailView } from "@/components/board-detail-view"
import { FeedbackModal, type FeedbackData } from "@/components/feedback-modal"
import { GradeRejectionModal } from "@/components/grade-rejection-modal"
import { BatchTimelineNavigator } from "@/components/batch-timeline-navigator"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Import sample data
import { boards, archivedBoards } from "@/data/sample-boards"
import type { Board } from "@/types/board"

// Sample timeline data - in a real app, this would come from your API
const timelineData = [
  { hour: "08:00", count: 42, timestamp: "Today, 8:00 AM - 9:00 AM" },
  { hour: "09:00", count: 56, timestamp: "Today, 9:00 AM - 10:00 AM" },
  { hour: "10:00", count: 38, timestamp: "Today, 10:00 AM - 11:00 AM" },
  { hour: "11:00", count: 45, timestamp: "Today, 11:00 AM - 12:00 PM" },
  { hour: "12:00", count: 22, timestamp: "Today, 12:00 PM - 1:00 PM" },
  { hour: "13:00", count: 35, timestamp: "Today, 1:00 PM - 2:00 PM" },
  { hour: "14:00", count: 48, timestamp: "Today, 2:00 PM - 3:00 PM" },
  { hour: "15:00", count: 52, timestamp: "Today, 3:00 PM - 4:00 PM" },
  { hour: "16:00", count: 44, timestamp: "Today, 4:00 PM - 5:00 PM" },
  { hour: "17:00", count: 30, timestamp: "Today, 5:00 PM - 6:00 PM" },
  { hour: "18:00", count: 18, timestamp: "Today, 6:00 PM - 7:00 PM" },
]

// Combine all boards for search functionality
const allBoards = [...boards, ...archivedBoards]

// Define defect types for filtering
const defectTypes = ["Knot", "Split", "Wane", "Hole"]
const gradeOptions = ["S&B", "SELECT", "1COMMON", "2COMMON", "3COMMON", "V"]

// Define tag filter type
interface TagFilter {
  category: string
  value: string
}

export function LinePage() {
  const [isLive, setIsLive] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState<number | null>(5)
  const [showAllDefects, setShowAllDefects] = useState(true)
  const router = useRouter()

  // State for selected hour
  const [selectedHour, setSelectedHour] = useState(timelineData[timelineData.length - 1].hour)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDefects, setSelectedDefects] = useState<string[]>([])
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [showProcessed, setShowProcessed] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [boardsPerPage] = useState(3)
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)

  // State for tag filters
  const [tagFilters, setTagFilters] = useState<TagFilter[]>([])

  // State for feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackBoardId, setFeedbackBoardId] = useState<string | null>(null)

  // State for grade rejection modal
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionBoard, setRejectionBoard] = useState<Board | null>(null)

  // State to track which boards have been agreed with
  const [agreedBoards, setAgreedBoards] = useState<Record<string, boolean>>({})

  // Add state for timeline visibility
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false)

  // Handle tag filter changes
  const handleTagFilterChange = (filters: TagFilter[]) => {
    setTagFilters(filters)
    setCurrentPage(0) // Reset to first page when filters change
  }

  // Filter boards based on search criteria and tags
  const filteredBoards = useMemo(() => {
    return allBoards.filter((board) => {
      // Filter by search query
      const matchesQuery =
        searchQuery === "" ||
        board.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.grade.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by defect types
      const matchesDefects =
        selectedDefects.length === 0 || board.defects?.some((defect) => selectedDefects.includes(defect.type))

      // Filter by grade
      const matchesGrade = selectedGrades.length === 0 || selectedGrades.includes(board.grade)

      // Filter by status
      const matchesStatus = showProcessed || board.status === "active"

      // Filter by tags (AND logic - must match all tags)
      const matchesTags = tagFilters.every((tag) => {
        switch (tag.category) {
          case "grade":
            return board.grade === tag.value
          case "defect":
            return board.defects?.some((defect) => defect.type === tag.value)
          case "status":
            return board.status === tag.value.toLowerCase()
          case "batch":
            // This is a simplified example - in a real app, you'd have more sophisticated batch matching
            const hour = Number.parseInt(board.timestamp.split(":")[0])
            if (tag.value === "Morning") return hour >= 6 && hour < 12
            if (tag.value === "Afternoon") return hour >= 12 && hour < 18
            if (tag.value === "Evening") return hour >= 18 && hour < 22
            if (tag.value === "Night") return hour >= 22 || hour < 6
            return true
          default:
            return true
        }
      })

      return matchesQuery && matchesDefects && matchesGrade && matchesStatus && matchesTags
    })
  }, [searchQuery, selectedDefects, selectedGrades, showProcessed, tagFilters])

  // Paginate filtered boards
  const paginatedBoards = useMemo(() => {
    const startIndex = currentPage * boardsPerPage
    return filteredBoards.slice(startIndex, startIndex + boardsPerPage)
  }, [filteredBoards, currentPage, boardsPerPage])

  // Get total pages
  const totalPages = Math.ceil(filteredBoards.length / boardsPerPage)

  // Handle hour selection
  const handleSelectHour = (hour: string) => {
    setSelectedHour(hour)
    // In a real app, you would fetch boards for this hour
    console.log(`Loading boards for hour: ${hour}`)
  }

  // Handle auto-refresh when live mode is on
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isLive && refreshInterval) {
      intervalId = setInterval(() => {
        console.log("Refreshing board data...")
        // In a real app, this would fetch new data
      }, refreshInterval * 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isLive, refreshInterval])

  // Toggle live mode
  const toggleLiveMode = () => {
    setIsLive((prev) => !prev)
  }

  // Handle agree with AI
  const handleAgreeWithAI = (boardId: string) => {
    setAgreedBoards((prev) => ({
      ...prev,
      [boardId]: true,
    }))
    console.log("User agreed with AI assessment for board:", boardId)
  }

  // Handle disagree with AI
  const handleDisagreeWithAI = (boardId: string) => {
    setFeedbackBoardId(boardId)
    setShowFeedbackModal(true)
  }

  // Handle feedback submission
  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    console.log("Feedback submitted:", feedback)
    setShowFeedbackModal(false)
    // In a real app, you would send this data to your backend
    alert("Thank you for your feedback!")
  }

  // Handle view grade rejection reasons
  const handleViewGradeReasons = (board: Board) => {
    setRejectionBoard(board)
    setShowRejectionModal(true)
  }

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Handle board selection
  const selectBoard = (boardId: string) => {
    setSelectedBoardId(boardId)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedDefects([])
    setSelectedGrades([])
    setShowProcessed(false)
    setTagFilters([])
  }

  // Toggle defect selection
  const toggleDefect = (defect: string) => {
    setSelectedDefects((prev) => (prev.includes(defect) ? prev.filter((d) => d !== defect) : [...prev, defect]))
  }

  // Toggle grade selection
  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) => (prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]))
  }

  // Get the selected board
  const selectedBoard = selectedBoardId ? allBoards.find((board) => board.id === selectedBoardId) : paginatedBoards[0]

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Board Finder</h1>
          <p className="text-muted-foreground">Find and analyze boards as they move through the scanning line</p>
        </div>

        <div className="flex items-center gap-2"></div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search boards by ID, batch, or grade..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {(selectedDefects.length > 0 || selectedGrades.length > 0 || showProcessed) && (
                      <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 h-5">
                        {selectedDefects.length + selectedGrades.length + (showProcessed ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Boards</h4>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Defect Types</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {defectTypes.map((defect) => (
                          <div key={defect} className="flex items-center space-x-2">
                            <Checkbox
                              id={`defect-${defect}`}
                              checked={selectedDefects.includes(defect)}
                              onCheckedChange={() => toggleDefect(defect)}
                            />
                            <Label htmlFor={`defect-${defect}`}>{defect}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h5 className="text-sm font-medium mb-2">Grades</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {gradeOptions.map((grade) => (
                          <div key={grade} className="flex items-center space-x-2">
                            <Checkbox
                              id={`grade-${grade}`}
                              checked={selectedGrades.includes(grade)}
                              onCheckedChange={() => toggleGrade(grade)}
                            />
                            <Label htmlFor={`grade-${grade}`}>{grade}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Select
                value={boardsPerPage.toString()}
                onValueChange={(value) => {
                  setCurrentPage(0)
                  // In a real implementation, you would update boardsPerPage here
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Show 3</SelectItem>
                  <SelectItem value="5">Show 5</SelectItem>
                  <SelectItem value="10">Show 10</SelectItem>
                  <SelectItem value="20">Show 20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expandable Timeline Navigator */}
      <Card>
        <CardHeader
          className="flex flex-row items-center justify-between py-3 cursor-pointer"
          onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
        >
          <h4 className="text-lg font-semibold">Timeline Navigator</h4>
          <Button variant="ghost" size="icon" aria-label={isTimelineExpanded ? "Collapse Timeline" : "Expand Timeline"}>
            {isTimelineExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CardHeader>
        {isTimelineExpanded && (
          <CardContent className="p-4 pt-0">
            <BatchTimelineNavigator
              timeSegments={timelineData}
              onSelectHour={handleSelectHour}
              selectedHour={selectedHour}
              onFilterChange={handleTagFilterChange}
            />
          </CardContent>
        )}
      </Card>

      {/* Search Results Summary */}
      {filteredBoards.length > 0 ? (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {currentPage * boardsPerPage + 1}-
            {Math.min((currentPage + 1) * boardsPerPage, filteredBoards.length)} of {filteredBoards.length} boards
          </p>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={currentPage === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="text-sm">
              Page {currentPage + 1} of {totalPages}
            </div>
            <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage >= totalPages - 1}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No boards match your search criteria</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Board Results */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Board List (Sidebar) */}
        <div className="lg:col-span-1 space-y-2 order-2 lg:order-1">
          {paginatedBoards.map((board) => (
            <Card
              key={board.id}
              className={`cursor-pointer hover:border-primary transition-colors ${
                selectedBoard?.id === board.id ? "border-primary border-2" : ""
              }`}
              onClick={() => selectBoard(board.id)}
            >
              <CardContent className="p-2">
                {" "}
                {/* Reduced padding from p-3 to p-2 */}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm truncate" title={board.id}>
                    {board.id}
                  </span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    {board.grade}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground truncate" title={`Batch ID: ${board.batchId}`}>
                  Batch: {board.batchId}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Board Detail */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          {selectedBoard ? (
            <Card className="border-primary border-2 shadow-md">
              <CardContent className="p-0">
                <BoardDetailView
                  board={selectedBoard}
                  onInspect={(board) => router.push(`/board-finder?boardId=${board.id}`)}
                  onToggleShowAllDefects={() => setShowAllDefects(!showAllDefects)}
                  onAgreeWithAI={(boardId) => handleAgreeWithAI(boardId)}
                  onDisagreeWithAI={(boardId) => handleDisagreeWithAI(boardId)}
                  onViewGradeReasons={(board) => handleViewGradeReasons(board)}
                  showAllDefects={showAllDefects}
                  agreedWithAI={agreedBoards[selectedBoard.id] || false}
                />
              </CardContent>
              <CardFooter className="border-t p-3 flex justify-end">
                {" "}
                {/* Changed justify-between to justify-end */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push(`/board-finder?boardId=${selectedBoard.id}`)}
                >
                  Full Inspection
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Select a board to view details</p>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        boardId={feedbackBoardId || ""}
        currentGrade={
          feedbackBoardId
            ? allBoards
                .find((b) => b.id === feedbackBoardId)
                ?.grade.toLowerCase()
                .replace(/\s+/g, "-") || ""
            : ""
        }
        aiSelectedGradeId="1common"
        aiSelectedGradeLabel="1 Common"
      />

      {/* Grade Rejection Modal */}
      <GradeRejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        board={rejectionBoard}
      />
    </div>
  )
}
