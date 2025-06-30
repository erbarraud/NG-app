/**
 * Application-wide constants for the Neural Grader Dashboard
 */

// Defect types used throughout the application
export const DEFECT_TYPES = [
  "Knot",
  "Split",
  "Wane",
  "Hole",
  "Check",
  "Stain",
  "Decay",
  "Shake",
  "Pitch Pocket",
  "Bark Pocket",
] as const

export type DefectType = (typeof DEFECT_TYPES)[number]

// Severity levels for defects
export const SEVERITY_LEVELS = ["Minor", "Moderate", "Major", "Severe"] as const
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number]

// Grade options for wood classification
export const GRADE_OPTIONS = ["S&B", "SELECT", "1COMMON", "2COMMON", "3COMMON", "V"] as const
export type GradeOption = (typeof GRADE_OPTIONS)[number]

// Board status options
export const BOARD_STATUSES = ["active", "processed", "rejected"] as const
export type BoardStatus = (typeof BOARD_STATUSES)[number]

// Batch status options
export const BATCH_STATUSES = ["in-progress", "scheduled", "completed", "cancelled", "error"] as const
export type BatchStatus = (typeof BATCH_STATUSES)[number]

// Line status options
export const LINE_STATUSES = ["good", "warning", "critical", "offline"] as const
export type LineStatus = (typeof LINE_STATUSES)[number]

// Refresh intervals (in seconds)
export const REFRESH_INTERVALS = {
  LIVE_VIEW: 5,
  DASHBOARD: 30,
  BATCH_STATUS: 60,
}

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
}

// API endpoints (for future implementation)
export const API_ENDPOINTS = {
  BOARDS: "/api/boards",
  BATCHES: "/api/batches",
  DEFECTS: "/api/defects",
  USERS: "/api/users",
  CLAIMS: "/api/claims",
}

// Feature flags
export const FEATURES = {
  ENABLE_LIVE_UPDATES: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CLAIMS: true,
}
