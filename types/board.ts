/**
 * Board and Defect Type Definitions
 *
 * Core data models for the lumber grading system
 */

// Defect severity levels (ordered by impact)
export type DefectSeverity = "Minor" | "Moderate" | "Major" | "Severe"

// Board processing status
export type BoardStatus = "active" | "processed" | "rejected"

// Board face identifier (1 = front, 2 = back)
export type BoardFace = 1 | 2

/**
 * Individual defect found on a board
 */
export interface Defect {
  /** Type of defect (e.g., "knot", "split", "wane") */
  type: string

  /** Number of occurrences of this defect type */
  count: number

  /** Position on the board (normalized 0-1 coordinates) */
  position: {
    x: number
    y: number
  }

  /** Severity level affecting grade calculation */
  severity: DefectSeverity

  /** Which face of the board (1 or 2) */
  face: BoardFace
}

/**
 * Grading option with AI confidence and reasoning
 */
export interface GradeOption {
  /** Grade name (e.g., "Select", "Common #1") */
  name: string

  /** Numeric grade value (null for reject) */
  value: number | null

  /** Whether this grade is currently selected */
  selected: boolean

  /** AI reasoning for this grade assignment */
  reason: string
}

/**
 * Clear cutting measurement for yield calculation
 */
export interface ClearCutting {
  /** Length in inches */
  length: string

  /** Width in inches */
  width: string

  /** Number of units that can be cut */
  units: number
}

/**
 * Main board data structure
 */
export interface Board {
  /** Unique board identifier */
  id: string

  /** ISO timestamp when board was scanned */
  timestamp: string

  /** Parent batch/order identifier */
  batchId: string

  /** Human-readable batch name */
  batchName: string

  /** Wood species (e.g., "Pine", "Oak") */
  woodType: string

  /** Processing method (e.g., "Kiln Dried", "Green") */
  processing: string

  /** Physical dimensions */
  dimensions: {
    length: string // e.g., "8'"
    width: string // e.g., "2x4"
    thickness: string // e.g., "1.5\""
  }

  /** Total square meters */
  totalSM: string

  /** Volume measurement */
  volume: string

  /** Estimated value in dollars */
  value: number

  /** Final assigned grade */
  grade: string

  /** Current processing status */
  status: BoardStatus

  /** Total number of defects found */
  defectCount: number

  /** Detailed defect information */
  defects?: Defect[]

  /** Clear cutting analysis for both faces */
  clearCuttings?: {
    face1: ClearCutting[]
    face2: ClearCutting[]
  }

  /** Total cutting units per face */
  totalCuttingUnits?: {
    face1: number
    face2: number
  }

  /** Front face image path */
  imageFront: string

  /** Back face image path (optional) */
  imageBack?: string

  /** Available grading options from AI */
  gradeOptions?: GradeOption[]

  /** Currently displayed face (1 or 2) */
  currentFace?: BoardFace

  /** Yield percentage (0-100) */
  yield?: number
}

/**
 * Helper function to find the most common defect type
 * Useful for summary displays and reporting
 */
export function getMostCommonDefect(defects: Defect[]): string {
  if (!defects.length) return "None"

  const defectCounts: Record<string, number> = {}

  // Count occurrences of each defect type
  defects.forEach((defect) => {
    defectCounts[defect.type] = (defectCounts[defect.type] || 0) + defect.count
  })

  // Find the most frequent defect
  let mostCommonDefect = ""
  let highestCount = 0

  Object.entries(defectCounts).forEach(([type, count]) => {
    if (count > highestCount) {
      mostCommonDefect = type
      highestCount = count
    }
  })

  return mostCommonDefect
}

/**
 * Get appropriate UI variant for defect severity
 * Used for consistent color coding across the app
 */
export function getSeverityVariant(severity: DefectSeverity): "default" | "secondary" | "destructive" | "outline" {
  switch (severity) {
    case "Minor":
      return "secondary"
    case "Moderate":
      return "outline"
    case "Major":
    case "Severe":
      return "destructive"
    default:
      return "default"
  }
}

/**
 * Get appropriate status indicator type for defect severity
 * Used for consistent UI styling across components
 */
export function getSeverityType(severity: DefectSeverity): "info" | "warning" | "error" | "success" {
  switch (severity) {
    case "Minor":
      return "info"
    case "Moderate":
      return "warning"
    case "Major":
    case "Severe":
      return "error"
    default:
      return "info"
  }
}

/**
 * Calculate overall board quality score (0-100)
 * Based on defect count, severity, and yield
 */
export function calculateQualityScore(board: Board): number {
  if (!board.defects?.length) return 100

  // Base score starts at 100
  let score = 100

  // Deduct points based on defects
  board.defects.forEach((defect) => {
    const severityPenalty = {
      Minor: 2,
      Moderate: 5,
      Major: 10,
      Severe: 20,
    }[defect.severity]

    score -= severityPenalty * defect.count
  })

  // Factor in yield if available
  if (board.yield) {
    score = score * (board.yield / 100)
  }

  // Ensure score stays within bounds
  return Math.max(0, Math.min(100, Math.round(score)))
}
