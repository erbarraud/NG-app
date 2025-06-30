import { v4 as uuidv4 } from "uuid"

// Species
export const speciesOptions = [
  "Soft Maple",
  "Hard Maple",
  "Red Oak",
  "White Oak",
  "Cherry",
  "Walnut",
  "Hickory",
  "Poplar",
  "Ash",
  "Birch",
] as const
export type Species = (typeof speciesOptions)[number]

// Dry Status
export const dryStatusOptions = ["Green", "KD (Kiln Dried)", "AD (Air Dried)"] as const
export type DryStatus = (typeof dryStatusOptions)[number]

// Shift
export const shiftOptions = ["Day Shift", "Night Shift", "Weekend Shift"] as const
export type Shift = (typeof shiftOptions)[number]

// Sort Grades
export const sortGradeOptions = ["FAS", "F1F", "SEL", "#1C", "#2AC", "#2C", "#3AC", "#3C", "Prime", "Clears"] as const
export type SortGrade = (typeof sortGradeOptions)[number]

// Sort Aspect (Lumber Stage)
export const sortAspectOptions = ["Surfaced", "Rough"] as const
export type SortAspect = (typeof sortAspectOptions)[number] // This is for Lumber Stage

// Board Aspect Selection
export const boardAspectSelectionOptions = [
  "Best Face",
  "Worst Face",
  "Primary Face",
  "Secondary Face",
  "Both Faces",
] as const
export type BoardAspectSelection = (typeof boardAspectSelectionOptions)[number]

// Color Categories
export const colorCategoryOptions = [
  "White - Pure sapwood",
  "Red - Heartwood dominant",
  "Light - Mostly pale or blond tones",
  "Medium - Balanced tone, natural color",
  "Dark - Walnut, aged oak, etc.",
  "Mixed - Sapwood + heartwood variation",
  "Discolored - Blue stain, oxidation, etc.",
  // "Custom", // Removing "Custom" for single-select simplicity
] as const
export type ColorCategory = (typeof colorCategoryOptions)[number]

// For "Enable Color Sorting" Select
export const enableDisableOptions = [
  { value: "enabled", label: "Enabled" },
  { value: "disabled", label: "Disabled" },
] as const

// Sort Template Structure
export interface SortTemplate {
  templateId: string
  templateName: string
  description?: string
  grades: string // Changed from string[]
  aspect?: SortAspect
  boardAspectSelection?: BoardAspectSelection
  enableColorSorting?: "enabled" | "disabled" // Changed from boolean
  selectedColorCategories?: string // Changed from string[]
  customLogicTag?: string
  commercialWidth?: number
  commercialWidthTolerance?: number
  commercialLength?: number
  commercialLengthTolerance?: number
  // Mini Board Length removed
}

// Sample Existing Sort Templates
export const existingSortTemplates: SortTemplate[] = [
  {
    templateId: uuidv4(),
    templateName: "Premium Maple FAS (Surfaced)",
    description: "Standard template for high-grade surfaced maple.",
    grades: "FAS", // Single grade
    aspect: "Surfaced",
    boardAspectSelection: "Best Face",
    enableColorSorting: "disabled",
  },
  {
    templateId: uuidv4(),
    templateName: "Rustic Oak Mix (Rough)",
    description: "Template for mixed common grades of rough oak, color sorted.",
    grades: "#1C", // Single grade
    aspect: "Rough",
    boardAspectSelection: "Both Faces",
    enableColorSorting: "enabled",
    selectedColorCategories: "Mixed - Sapwood + heartwood variation", // Single category
    commercialWidth: 150,
    commercialLength: 2400,
  },
]

// Default values for a new custom sort definition
export const defaultNewSortValues: Omit<SortDefinition, "id"> = {
  sortName: "",
  grades: sortGradeOptions[0] || "", // Default to first grade or empty string
  aspect: sortAspectOptions[0] || "", // Default to first aspect
  boardAspectSelection: boardAspectSelectionOptions[0] || "",
  enableColorSorting: "disabled", // Default to "disabled"
  selectedColorCategories: "", // Empty string for single select
  // customColorCategoryInput: "", // Removed
  customLogicTag: "",
  commercialWidth: undefined,
  commercialWidthTolerance: undefined,
  commercialLength: undefined,
  commercialLengthTolerance: undefined,
}

// Structure for a sort definition within an order
export interface SortDefinition {
  id: string
  sortName: string
  grades: string // Changed from string[]
  aspect: SortAspect
  boardAspectSelection: BoardAspectSelection
  enableColorSorting: "enabled" | "disabled" // Changed from boolean
  selectedColorCategories?: string // Changed from string[], optional
  // customColorCategoryInput?: string; // Removed
  customLogicTag?: string
  commercialWidth?: number
  commercialWidthTolerance?: number
  commercialLength?: number
  commercialLengthTolerance?: number
}

// Main Order Form Values
export interface OrderFormValues {
  orderId: string
  orderName: string
  species: Species
  dryStatus: DryStatus
  productionDate: Date
  productionShift?: Shift
  customer?: string
  selectedSortTemplateIds?: string[]
  newSorts?: SortDefinition[]
}

// Default values for the entire order form
export const defaultOrderValues: Partial<OrderFormValues> = {
  orderId: `ORD-${new Date().toISOString().slice(0, 10)}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
  orderName: "",
  selectedSortTemplateIds: [],
  newSorts: [],
  productionShift: undefined,
  customer: "",
  // species, dryStatus, productionDate will be set by user or have specific required messages
}
