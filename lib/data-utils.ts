import type { Board, Defect } from "@/types/board"
import { DEFECT_TYPES, GRADE_OPTIONS, SEVERITY_LEVELS } from "@/lib/constants"

/**
 * Generates a random board for simulation purposes
 * @param id - The ID number for the board
 * @returns A randomly generated board object
 */
export function generateRandomBoard(id: number): Board {
  const defectCount = Math.floor(Math.random() * 3) + 1
  const defects = generateRandomDefects(defectCount)
  const grade = GRADE_OPTIONS[Math.floor(Math.random() * GRADE_OPTIONS.length)]
  const value = Number.parseFloat((Math.random() * 20 + 5).toFixed(2))

  return {
    id: `BRD-${10000 + id}`,
    timestamp: new Date().toLocaleTimeString(),
    batchId: `B-${Math.floor(Math.random() * 1000)}`,
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
    value,
    grade,
    status: "active",
    defectCount,
    defects,
    imageFront: "/board-preview.png",
    imageBack: "/board-preview.png",
    currentFace: Math.random() > 0.5 ? 1 : 2,
  }
}

/**
 * Generates random defects for a board
 * @param count - Number of defects to generate
 * @returns Array of randomly generated defects
 */
function generateRandomDefects(count: number): Defect[] {
  return Array.from({ length: count }, (_, i) => ({
    type: DEFECT_TYPES[Math.floor(Math.random() * DEFECT_TYPES.length)],
    count: 1,
    position: {
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 100),
    },
    severity: SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)] as
      | "Minor"
      | "Moderate"
      | "Major"
      | "Severe",
    face: Math.random() > 0.5 ? 1 : (2 as 1 | 2),
  }))
}

/**
 * Filters boards based on search criteria
 * @param boards - Array of boards to filter
 * @param searchQuery - Search query string
 * @param filters - Object containing filter criteria
 * @returns Filtered array of boards
 */
export function filterBoards(
  boards: Board[],
  searchQuery: string,
  filters: {
    defectTypes?: string[]
    grades?: string[]
    statuses?: string[]
    batchIds?: string[]
  },
): Board[] {
  return boards.filter((board) => {
    // Filter by search query
    const matchesQuery =
      searchQuery === "" ||
      board.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.grade.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by defect types
    const matchesDefects =
      !filters.defectTypes?.length || board.defects?.some((defect) => filters.defectTypes?.includes(defect.type))

    // Filter by grade
    const matchesGrade = !filters.grades?.length || filters.grades.includes(board.grade)

    // Filter by status
    const matchesStatus = !filters.statuses?.length || filters.statuses.includes(board.status)

    // Filter by batch ID
    const matchesBatch = !filters.batchIds?.length || filters.batchIds.includes(board.batchId)

    return matchesQuery && matchesDefects && matchesGrade && matchesStatus && matchesBatch
  })
}

/**
 * Calculates statistics for a collection of boards
 * @param boards - Array of boards to analyze
 * @returns Object containing statistics
 */
export function calculateBoardStats(boards: Board[]) {
  if (!boards.length) return null

  const totalValue = boards.reduce((sum, board) => sum + board.value, 0)
  const avgValue = totalValue / boards.length

  const defectCounts: Record<string, number> = {}
  let totalDefects = 0

  boards.forEach((board) => {
    board.defects?.forEach((defect) => {
      defectCounts[defect.type] = (defectCounts[defect.type] || 0) + 1
      totalDefects++
    })
  })

  const mostCommonDefect = Object.entries(defectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

  return {
    totalBoards: boards.length,
    totalValue: totalValue.toFixed(2),
    avgValue: avgValue.toFixed(2),
    totalDefects,
    avgDefectsPerBoard: (totalDefects / boards.length).toFixed(2),
    mostCommonDefect,
  }
}
