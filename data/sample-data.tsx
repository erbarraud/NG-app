import type { Board } from "@/types/board"

export interface OrderSort {
  id: string
  name: string
  grade: string[]
  minLength?: string
  moistureRange?: { min?: number; max?: number }
  aspect?: string // e.g., "Surfaced", "Rough"
  boardAspectSelection?: string // e.g., "Face 1", "Worst Face"
  colorSortingEnabled?: boolean | string // Allow string for form compatibility
  colorCategories?: string[] | string // Allow string for form compatibility
  customLogicTag?: string
  isTemplate?: boolean
  sourceTemplateId?: string
  commercialWidth?: number
  commercialWidthTolerance?: number
  commercialLength?: number
  commercialLengthTolerance?: number
}

export interface OrderKpis {
  totalBoardsScanned?: number
  yieldAchieved?: number // Percentage
  bundlesCreated?: number
  piecesCut?: number
  rejectedBoards?: number
  estimatedDuration?: string // e.g., "2h 30m"
  actualDuration?: string // e.g., "2h 45m"
  timeElapsed?: string // For running orders
  estimatedTimeRemaining?: string // For running orders
}

export interface OrderProgress {
  boardsScanned?: number
  bundlesCreated?: number
  currentStatusMessage?: string // e.g., "Scanning Red Oak Batch A"
  percentageComplete?: number // 0-100
}

export type OrderStatus = "Running" | "Scheduled" | "Paused" | "Completed" | "Cancelled" | "Interrupted"

export interface Order {
  id: string
  name: string
  customer?: string
  species: string[]
  dryStatus: "Green" | "KD" | "Air Dried"
  productionDate: string // Scheduled start date YYYY-MM-DD
  productionTime?: string // Scheduled start time HH:MM
  productionShift?: "Morning" | "Afternoon" | "Night"
  status: OrderStatus
  sorts: OrderSort[]

  priority?: number // For sorting upcoming orders
  startTime?: string // ISO string
  endTime?: string // ISO string

  progress?: OrderProgress
  kpis?: OrderKpis

  operator?: string
  totalVolume?: number // Actual or target, clarify usage
  targetVolume?: number // Target volume for the order

  notes?: string

  updatedAt: string // ISO string
  createdAt: string // ISO string
}

export const sampleOrders: Order[] = [
  {
    id: "ORD-20250701-001",
    name: "Red Oak - Prime Run",
    customer: "Johnson Lumber Co.",
    species: ["Red Oak"],
    dryStatus: "KD",
    productionDate: "2025-07-01",
    productionTime: "08:00",
    productionShift: "Morning",
    status: "Running",
    sorts: [
      { id: "sort-001", name: "Prime Red Oak 4/4", grade: ["FAS", "Select"], minLength: "8ft" },
      { id: "sort-002", name: "Common Red Oak 4/4", grade: ["1 Common"], minLength: "6ft" },
    ],
    priority: 1,
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Started 1 hour ago
    progress: {
      boardsScanned: 125,
      bundlesCreated: 4,
      currentStatusMessage: "Actively scanning boards...",
      percentageComplete: 35,
    },
    kpis: {
      totalBoardsScanned: 125, // So far
      yieldAchieved: 0, // Calculated on completion or periodically
      bundlesCreated: 4, // So far
      estimatedDuration: "3h 00m",
      timeElapsed: "1h 02m",
      estimatedTimeRemaining: "1h 58m",
    },
    operator: "John Doe",
    targetVolume: 1250,
    updatedAt: new Date().toISOString(),
    createdAt: "2025-06-30T08:00:00Z",
  },
  {
    id: "ORD-20250701-002",
    name: "Soft Maple - Special Order",
    customer: "Artisan Furniture",
    species: ["Soft Maple"],
    dryStatus: "Green",
    productionDate: "2025-07-01",
    productionTime: "13:00",
    status: "Scheduled",
    sorts: [
      {
        id: "sort-003",
        name: "Soft Maple Paint Grade",
        grade: ["Paint Grade"],
        colorSortingEnabled: true,
        colorCategories: ["White", "Sap Stain No Defect"],
      },
    ],
    priority: 2,
    kpis: {
      estimatedDuration: "2h 00m",
      totalBoardsScanned: 0, // Expected or placeholder
      bundlesCreated: 0,
    },
    operator: "Jane Smith",
    targetVolume: 800,
    updatedAt: "2025-06-30T09:00:00Z",
    createdAt: "2025-06-30T09:00:00Z",
  },
  {
    id: "ORD-20250702-003",
    name: "White Oak - Flooring",
    customer: "Flooring Inc.",
    species: ["White Oak"],
    dryStatus: "KD",
    productionDate: "2025-07-02",
    productionTime: "09:00",
    status: "Scheduled",
    sorts: [{ id: "sort-004", name: "White Oak Flooring Grade", grade: ["Select", "1 Common"] }],
    priority: 3,
    kpis: { estimatedDuration: "4h 30m" },
    targetVolume: 1500,
    updatedAt: "2025-06-30T10:00:00Z",
    createdAt: "2025-06-30T10:00:00Z",
  },
  {
    id: "ORD-20250628-001",
    name: "Mixed Hardwoods - Stock",
    species: ["Hard Maple", "Beech"],
    dryStatus: "Air Dried",
    productionDate: "2025-06-28",
    status: "Completed",
    sorts: [
      { id: "sort-005", name: "Hard Maple Cabinet Grade", grade: ["Select", "1 Common"] },
      { id: "sort-006", name: "Beech Flooring Grade", grade: ["2 Common"], aspect: "Rough" },
    ],
    startTime: "2025-06-28T08:00:00Z",
    endTime: "2025-06-28T12:15:00Z",
    kpis: {
      totalBoardsScanned: 550,
      yieldAchieved: 78,
      bundlesCreated: 15,
      rejectedBoards: 22,
      piecesCut: 2200, // Added example
      actualDuration: "4h 15m",
      estimatedDuration: "4h 00m",
    },
    operator: "Mike Brown",
    totalVolume: 2100, // Actual processed volume
    updatedAt: "2025-06-28T12:15:00Z",
    createdAt: "2025-06-27T11:00:00Z",
  },
  {
    id: "ORD-20250629-001",
    name: "Cherry - Test Run",
    species: ["Cherry"],
    dryStatus: "KD",
    productionDate: "2025-06-29",
    status: "Cancelled",
    sorts: [{ id: "sort-007", name: "Cherry Test Sort", grade: ["FAS"] }],
    kpis: { estimatedDuration: "1h 00m" },
    notes: "Material not available",
    updatedAt: "2025-06-29T09:30:00Z",
    createdAt: "2025-06-28T14:00:00Z",
  },
]

// Sample data for boards (existing, ensure it's compatible or not directly used by this new view)
export const sampleBoards: Board[] = [
  // ... existing sampleBoards data ...
  // Ensure batchId in sampleBoards can map to an Order ID if needed for other views
]
