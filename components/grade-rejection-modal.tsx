"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Info,
  RefreshCw,
  XCircle,
  ArrowRight,
  DollarSign,
  Percent,
  Filter,
  Layers,
  ListChecks,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState, useMemo } from "react"
import type { Board } from "@/types/board"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// --- Helper Types (Ideally, these would be in a dedicated types file as shown above) ---
// For brevity, I'm assuming the types (RuleEvaluation, DetailedRejectionReason, etc.) are defined
// and imported or are similar to the conceptual ones outlined before the CodeProject.
// For this example, I'll use simplified inline versions or rely on the structure of sample data.

interface RuleEvaluation {
  ruleName: string
  result: "Pass" | "Fail" | "Warn"
  actualValue: string | number
  thresholdValue: string | number
  details?: string
  overriddenBySortLogic?: boolean
}

type RejectionReasonType =
  | "SORT_RULE_DIMENSION"
  | "SORT_RULE_SPECIES"
  | "SORT_RULE_MIN_GRADE_NOT_MET"
  | "GRADE_RULE_DEFECT_COUNT"
  | "GRADE_RULE_DEFECT_SEVERITY"
  | "GRADE_RULE_DEFECT_SIZE"
  | "GRADE_RULE_WANE_PERCENTAGE"
  | "GRADE_RULE_MIN_LENGTH_FOR_GRADE"
  | "COLOR_PROFILE_MISMATCH"
  | "NO_CLEAR_CUTTINGS_FOR_GRADE"
  | "YIELD_TOO_LOW_FOR_GRADE"
  | "TOLERANCE_MISMATCH"
  | "OTHER"

interface DetailedRejectionReason {
  criterion: string
  reason: string
  status: "Fail" | "Warn"
  type: RejectionReasonType
  failedRuleId?: string
  actualValue?: string | number
  thresholdValue?: string | number
  face?: 1 | 2 | "Overall"
}

interface SelectedSortDecision {
  sortId: string
  sortName: string
  gradeAssigned?: string
  isSelected: true
  decisionSummary: string[]
  fullGradingLogic?: RuleEvaluation[]
  estimatedYield: number
  estimatedValue: number
}

interface RejectedSortDecision {
  sortId: string
  sortName: string
  rejectionReasons: DetailedRejectionReason[]
}

interface AlternativeSortPath {
  sortId?: string
  sortName: string
  potentialGrade: string
  estimatedYield: number
  estimatedValue: number
  metConditionsSummary: string[]
  missedConditionsForSelectedSort?: DetailedRejectionReason[]
  valueDifferenceFromSelected: number
  yieldDifferenceFromSelected: number
}

interface DecisionContext {
  board: Board & { defectsSummary?: { type: string; count: number }[] }
  selectedSort: SelectedSortDecision
  rejectedSorts: RejectedSortDecision[]
  alternativeSortPaths: AlternativeSortPath[]
}

type ActiveRejectionFilter = "LOWER_VALUE_PASS" | "DIMENSION_ISSUE" | "DEFECT_COLOR_ISSUE" | "OUT_OF_TOLERANCE"

// --- End Helper Types ---

interface GradeRejectionModalProps {
  isOpen: boolean
  onClose: () => void
  decisionContext: DecisionContext | null
}

// --- Sample Data (Replace with actual data prop) ---
const generateSampleDecisionContext = (boardId: string): DecisionContext => ({
  board: {
    id: boardId,
    timestamp: new Date().toISOString(),
    batchId: "BCH-001",
    batchName: "Morning Run",
    woodType: "Soft Maple",
    processing: "S4S",
    dimensions: { length: "2600mm", width: "150mm", thickness: "25mm" },
    totalSM: "0.39",
    volume: "0.00975 m³",
    value: 0, // Value will come from selectedSort
    grade: "", // Grade will come from selectedSort
    status: "processed",
    defectCount: 3,
    defects: [
      { type: "Knot", count: 2, position: { x: 10, y: 20 }, severity: "Moderate", face: 1 },
      { type: "Wane", count: 1, position: { x: 30, y: 40 }, severity: "Major", face: 1 },
    ],
    defectsSummary: [
      { type: "Knot", count: 2 },
      { type: "Wane", count: 1 },
    ],
    imageFront: "/board-front.png",
    imageBack: "/board-back.png",
  },
  selectedSort: {
    sortId: "SORT-003",
    sortName: "Sort 3 – Soft Maple FAS >8ft, Light Color",
    gradeAssigned: "FAS",
    isSelected: true,
    estimatedYield: 75,
    estimatedValue: 52.5,
    decisionSummary: [
      "Matched 100% of FAS grade rules for Soft Maple.",
      "Matched color filter: 'Light Maple'.",
      "Met minimum dimension threshold (Length >8ft).",
    ],
    fullGradingLogic: [
      { ruleName: "Knot Size (Face A)", result: "Pass", actualValue: "18mm", thresholdValue: "≤20mm" },
      { ruleName: "Wane Percentage (Overall)", result: "Pass", actualValue: "12%", thresholdValue: "≤15%" },
      { ruleName: "Min Length for FAS", result: "Pass", actualValue: "2600mm", thresholdValue: "≥2438mm" },
      { ruleName: "Color Profile (Light Maple)", result: "Pass", actualValue: "0.85", thresholdValue: "≥0.80" },
    ],
  },
  rejectedSorts: [
    {
      sortId: "SORT-001",
      sortName: "Sort 1 – Soft Maple No. 1C < 2.4m",
      rejectionReasons: [
        {
          criterion: "Length",
          reason: "Board too long (2600mm vs. max 2400mm)",
          status: "Fail",
          type: "SORT_RULE_DIMENSION",
          actualValue: "2600mm",
          thresholdValue: "<2400mm",
        },
        {
          criterion: "Wane Defect",
          reason: "Wane over threshold for 1C (12% vs. max 10%)",
          status: "Fail",
          type: "GRADE_RULE_WANE_PERCENTAGE",
          actualValue: "12%",
          thresholdValue: "≤10%",
        },
      ],
    },
    {
      sortId: "SORT-004",
      sortName: "Sort 4 – Soft Maple Premium Clear (No Defects)",
      rejectionReasons: [
        {
          criterion: "Defects Present",
          reason: "Rejected due to presence of knots (2) and wane (1)",
          status: "Fail",
          type: "GRADE_RULE_DEFECT_COUNT",
        },
      ],
    },
  ],
  alternativeSortPaths: [
    {
      sortName: "Generic Soft Maple No. 1C",
      potentialGrade: "No. 1C",
      estimatedYield: 60,
      estimatedValue: 35.0,
      valueDifferenceFromSelected: -17.5,
      yieldDifferenceFromSelected: -15,
      metConditionsSummary: ["Would meet No. 1C defect allowances.", "Length 2600mm is acceptable for No. 1C."],
      missedConditionsForSelectedSort: [
        {
          criterion: "Wane for FAS",
          reason: "Wane at 12% exceeds FAS limit of 10%",
          status: "Fail",
          type: "GRADE_RULE_WANE_PERCENTAGE",
          actualValue: "12%",
          thresholdValue: "≤10%",
        },
      ],
    },
    {
      sortName: "Shorts Sort - Soft Maple FAS <6ft",
      potentialGrade: "FAS (Short)",
      estimatedYield: 70,
      estimatedValue: 40.0,
      valueDifferenceFromSelected: -12.5,
      yieldDifferenceFromSelected: -5,
      metConditionsSummary: ["Board is too long for this sort (2600mm vs <1828mm)."],
      // This alternative is primarily to show how dimension mismatch would be listed
    },
  ],
})
// --- End Sample Data ---

const FilterCheckbox: React.FC<{
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}> = ({ id, label, checked, onCheckedChange }) => (
  <div className="flex items-center space-x-2">
    <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
    <Label htmlFor={id} className="text-xs font-normal text-muted-foreground">
      {label}
    </Label>
  </div>
)

export function GradeRejectionModal({
  isOpen,
  onClose,
  decisionContext: decisionContextProp,
}: GradeRejectionModalProps) {
  const [activeFilters, setActiveFilters] = useState<Set<ActiveRejectionFilter>>(new Set())

  const decisionContext = decisionContextProp || generateSampleDecisionContext("B-184729")

  const toggleFilter = (filter: ActiveRejectionFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(filter)) {
        next.delete(filter)
      } else {
        next.add(filter)
      }
      return next
    })
  }

  const filteredRejectedSorts = useMemo(() => {
    if (!decisionContext) return []
    if (activeFilters.size === 0) return decisionContext.rejectedSorts
    return (decisionContext.rejectedSorts ?? []).filter((sort) =>
      sort.rejectionReasons.some((reason) => {
        if (activeFilters.has("DIMENSION_ISSUE") && reason.type === "SORT_RULE_DIMENSION") return true
        if (
          activeFilters.has("DEFECT_COLOR_ISSUE") &&
          (reason.type.startsWith("GRADE_RULE_DEFECT") || reason.type === "COLOR_PROFILE_MISMATCH")
        )
          return true
        if (activeFilters.has("OUT_OF_TOLERANCE") && reason.type === "TOLERANCE_MISMATCH") return true // Assuming TOLERANCE_MISMATCH type
        return false
      }),
    )
  }, [decisionContext, activeFilters])

  const filteredAlternativeSorts = useMemo(() => {
    if (!decisionContext) return []
    if (activeFilters.size === 0) return decisionContext.alternativeSortPaths ?? []
    return (decisionContext.alternativeSortPaths ?? []).filter((alt) => {
      if (activeFilters.has("LOWER_VALUE_PASS") && alt.valueDifferenceFromSelected < 0) return true
      // More complex filtering for alternatives based on their properties or missedConditions
      if (
        activeFilters.has("DIMENSION_ISSUE") &&
        alt.metConditionsSummary.some(
          (s) => s.toLowerCase().includes("length") || s.toLowerCase().includes("dimension"),
        )
      )
        return true
      if (
        activeFilters.has("DEFECT_COLOR_ISSUE") &&
        alt.metConditionsSummary.some((s) => s.toLowerCase().includes("defect") || s.toLowerCase().includes("color"))
      )
        return true
      return false
    })
  }, [decisionContext, activeFilters])

  if (!decisionContext) return null
  const { board, selectedSort, rejectedSorts = [], alternativeSortPaths = [] } = decisionContext

  const getStatusIcon = (status: "Pass" | "Fail" | "Warn") => {
    if (status === "Pass") return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === "Fail") return <XCircle className="h-4 w-4 text-red-500" />
    if (status === "Warn") return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <Info className="h-4 w-4 text-gray-500" />
  }

  const renderBoardThumbnails = (b: Board) => (
    <div className="flex gap-1 mt-1">
      <Image
        src={b.imageFront || "/placeholder.svg?height=32&width=50&query=board+front"}
        alt="Front"
        width={50}
        height={32}
        className="rounded border object-cover"
      />
      {b.imageBack && (
        <Image
          src={b.imageBack || "/placeholder.svg?height=32&width=50&query=board+back"}
          alt="Back"
          width={50}
          height={32}
          className="rounded border object-cover"
        />
      )}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg">Decision Logic for Board: {board.id}</DialogTitle>
          <DialogDescription>Understanding grading and sorting decisions for this board.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="selected" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="shrink-0">
            <TabsTrigger value="selected">Selected Sort ({selectedSort.gradeAssigned})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Sorts ({rejectedSorts.length})</TabsTrigger>
            <TabsTrigger value="alternatives">Alternative Paths ({alternativeSortPaths.length})</TabsTrigger>
          </TabsList>

          <div className="flex-grow overflow-y-auto p-1 pr-2">
            {/* Board Summary Header - Common to all tabs */}
            <div className="p-3 my-2 bg-muted/30 rounded-lg border text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Board Details</h4>
                  <p>
                    <strong>ID:</strong> {board.id}{" "}
                    <Badge variant="secondary" className="ml-1">
                      {board.woodType}
                    </Badge>
                  </p>
                  <p>
                    <strong>Dimensions:</strong> {board.dimensions.length} L x {board.dimensions.width} W x{" "}
                    {board.dimensions.thickness} T
                  </p>
                  {renderBoardThumbnails(board)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Selected Outcome</h4>
                  <p>
                    <strong>Sort:</strong> {selectedSort.sortName}
                  </p>
                  <p>
                    <strong>Grade:</strong> <Badge>{selectedSort.gradeAssigned}</Badge>
                  </p>
                  <p className="flex items-center">
                    <strong>Value:</strong> <DollarSign className="h-3 w-3 mx-0.5" />
                    {(selectedSort.estimatedValue ?? 0).toFixed(2)}
                  </p>
                  <p className="flex items-center">
                    <strong>Yield:</strong> <Percent className="h-3 w-3 mx-0.5" />
                    {(selectedSort.estimatedYield ?? 0).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Defects Summary</h4>
                  {board.defectsSummary && board.defectsSummary.length > 0 ? (
                    board.defectsSummary.map((defect, i) => (
                      <Badge key={i} variant="outline" className="mr-1 mb-1 text-xs">
                        {defect.count} {defect.type}
                        {defect.count > 1 ? "s" : ""}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No defects detected.</p>
                  )}
                </div>
              </div>
            </div>

            <TabsContent value="selected" className="mt-0">
              <div className="p-3 border border-green-500 bg-green-50/50 rounded-lg">
                <h3 className="text-base font-semibold text-green-700 mb-1 flex items-center">
                  <ListChecks className="h-5 w-5 mr-2" /> Logic for Selected Sort: {selectedSort.sortName}
                </h3>
                <div className="mt-2 text-xs space-y-1 text-green-600">
                  <h4 className="font-medium">Decision Summary:</h4>
                  {selectedSort.decisionSummary.map((reason, i) => (
                    <p key={i} className="flex items-start">
                      <CheckCircle className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                      {reason}
                    </p>
                  ))}
                </div>
                {selectedSort.fullGradingLogic && (
                  <Accordion type="single" collapsible className="w-full mt-2">
                    <AccordionItem value="full-logic" className="border-green-200">
                      <AccordionTrigger className="text-xs hover:no-underline py-1.5 bg-green-100/50 px-2 rounded data-[state=open]:bg-green-100/70">
                        Show Full Grading Rule Evaluation
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-1 px-2 text-xs space-y-0.5 bg-green-50/30">
                        {selectedSort.fullGradingLogic.map((rule, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-12 gap-1 p-1 rounded hover:bg-green-100/50 items-center"
                          >
                            <div className="font-medium col-span-6 flex items-center">
                              {getStatusIcon(rule.result)}
                              <span className="ml-1.5">{rule.ruleName}</span>
                            </div>
                            <div className="col-span-3">
                              Value:{" "}
                              <Badge
                                variant={
                                  rule.result === "Pass"
                                    ? "default"
                                    : rule.result === "Fail"
                                      ? "destructive"
                                      : "outline"
                                }
                                size="sm"
                                className="bg-white"
                              >
                                {rule.actualValue}
                              </Badge>
                            </div>
                            <div className="col-span-3">
                              Threshold:{" "}
                              <Badge variant="secondary" size="sm">
                                {rule.thresholdValue}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-semibold flex items-center">
                    <XCircle className="h-5 w-5 mr-2 text-red-500" /> Why Other Configured Sorts Were Not Chosen
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="p-2 bg-background border shadow-lg rounded-md">
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium mb-1">Filter Rejections:</p>
                          <FilterCheckbox
                            id="filterDimIssueR"
                            label="Dimension Issue"
                            checked={activeFilters.has("DIMENSION_ISSUE")}
                            onCheckedChange={(c) => toggleFilter("DIMENSION_ISSUE")}
                          />
                          <FilterCheckbox
                            id="filterDefColIssueR"
                            label="Defect/Color Issue"
                            checked={activeFilters.has("DEFECT_COLOR_ISSUE")}
                            onCheckedChange={(c) => toggleFilter("DEFECT_COLOR_ISSUE")}
                          />
                          <FilterCheckbox
                            id="filterToleranceR"
                            label="Out of Tolerance"
                            checked={activeFilters.has("OUT_OF_TOLERANCE")}
                            onCheckedChange={(c) => toggleFilter("OUT_OF_TOLERANCE")}
                          />
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {filteredRejectedSorts.length > 0 ? (
                  <Accordion type="multiple" className="w-full space-y-2">
                    {filteredRejectedSorts.map((sort, i) => (
                      <AccordionItem
                        value={`rejected-${i}`}
                        key={sort.sortId}
                        className="border bg-white data-[state=open]:bg-muted/20 rounded-md shadow-sm"
                      >
                        <AccordionTrigger className="text-sm hover:no-underline py-2 px-3 rounded-t-md data-[state=open]:bg-muted/50 data-[state=open]:rounded-b-none">
                          <div className="flex items-center justify-between w-full">
                            <span>{sort.sortName}</span>
                            <Badge variant="destructive" size="sm">
                              Rejected
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-2 px-3 text-xs space-y-1 border-t">
                          {sort.rejectionReasons?.map((reason, j) => (
                            <div key={j} className="flex items-start p-1 hover:bg-red-50/50 rounded">
                              {getStatusIcon(reason.status)}
                              <div className="ml-1.5">
                                <span className="font-medium">{reason.criterion}:</span> {reason.reason}
                                {(reason.actualValue || reason.thresholdValue) && (
                                  <span className="text-muted-foreground ml-1">
                                    (Actual: {reason.actualValue ?? "N/A"}, Threshold: {reason.thresholdValue ?? "N/A"})
                                  </span>
                                )}
                                <Badge variant="outline" className="ml-1.5 text-[10px] px-1 py-0">
                                  {reason.type.replace(/_/g, " ").toLowerCase()}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No rejected sorts match current filters, or no sorts were rejected.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="alternatives" className="mt-0">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-semibold flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-blue-500" /> Alternative Sorting Paths & Grades
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="p-2 bg-background border shadow-lg rounded-md">
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium mb-1">Filter Alternatives:</p>
                          <FilterCheckbox
                            id="filterLowerValA"
                            label="Lower Value Pass"
                            checked={activeFilters.has("LOWER_VALUE_PASS")}
                            onCheckedChange={(c) => toggleFilter("LOWER_VALUE_PASS")}
                          />
                          <FilterCheckbox
                            id="filterDimIssueA"
                            label="Dimension Issue"
                            checked={activeFilters.has("DIMENSION_ISSUE")}
                            onCheckedChange={(c) => toggleFilter("DIMENSION_ISSUE")}
                          />
                          <FilterCheckbox
                            id="filterDefColIssueA"
                            label="Defect/Color Issue"
                            checked={activeFilters.has("DEFECT_COLOR_ISSUE")}
                            onCheckedChange={(c) => toggleFilter("DEFECT_COLOR_ISSUE")}
                          />
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {filteredAlternativeSorts.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAlternativeSorts.map((alt, i) => (
                      <div
                        key={i}
                        className="p-3 border rounded-md shadow-sm bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-semibold text-blue-700">
                              {alt.sortName} <ArrowRight className="inline h-4 w-4" /> Grade:{" "}
                              <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                                {alt.potentialGrade}
                              </Badge>
                            </h4>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Value:{" "}
                              <Badge variant="outline" size="sm">
                                ${(alt.estimatedValue ?? 0).toFixed(2)}(
                                {(alt.valueDifferenceFromSelected ?? 0) >= 0 ? "+" : ""}$
                                {(alt.valueDifferenceFromSelected ?? 0).toFixed(2)})
                              </Badge>
                              <span className="mx-1.5">|</span>
                              Yield:{" "}
                              <Badge variant="outline" size="sm">
                                {(alt.estimatedYield ?? 0).toFixed(0)}% (
                                {(alt.yieldDifferenceFromSelected ?? 0) >= 0 ? "+" : ""}
                                {(alt.yieldDifferenceFromSelected ?? 0).toFixed(0)}%)
                              </Badge>
                            </div>
                          </div>
                          {/* Placeholder for board image specific to this alternative if needed */}
                        </div>
                        <div className="mt-1.5 text-xs">
                          <p className="font-medium">Met Conditions:</p>
                          <ul className="list-disc list-inside pl-1 text-muted-foreground">
                            {alt.metConditionsSummary.map((cond, ci) => (
                              <li key={ci}>{cond}</li>
                            ))}
                          </ul>
                          {alt.missedConditionsForSelectedSort && alt.missedConditionsForSelectedSort.length > 0 && (
                            <>
                              <p className="font-medium mt-1">Why not chosen over current selection:</p>
                              <ul className="list-disc list-inside pl-1 text-muted-foreground">
                                {alt.missedConditionsForSelectedSort.map((reason, ri) => (
                                  <li key={ri} className="text-orange-600">
                                    {reason.criterion}: {reason.reason}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No alternative paths match current filters, or no alternatives available.
                  </p>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="pt-3 border-t shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Simulate with different rule for board:", board.id)}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Simulate With Rule Change
          </Button>
          <Button variant="outline" size="sm" onClick={() => console.log("Export decision trace for board:", board.id)}>
            <FileText className="h-3.5 w-3.5 mr-1.5" /> Export Decision Trace
          </Button>
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
