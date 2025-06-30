"use client"

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
import { AlertTriangle, CheckCircle, FileText, Info, RefreshCw, ScanLine, Tag, XCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import type { Board } from "@/types/board" // Assuming Defect is part of Board or a separate import

// --- Helper Types (Ideally, these would be in a dedicated types file) ---
interface RuleEvaluation {
  ruleName: string
  result: "Pass" | "Fail" | "Warn"
  actualValue: string | number
  thresholdValue: string | number
  details?: string
  overriddenBySortLogic?: boolean
}

interface SortDecision {
  sortId: string
  sortName: string
  gradeAssigned?: string
  isSelected: boolean
  decisionSummary: string[]
  colorFilterMatched?: { name: string; matched: boolean; details?: string }
  dimensionThresholdMet?: { met: boolean; details?: string }
  defectChecks: Array<{
    defectName: string
    status: "Pass" | "Fail" | "Warn"
    message: string
  }>
  fullGradingLogic?: RuleEvaluation[]
  rejectionReasons?: Array<{
    criterion: string
    reason: string
    status: "Fail" | "Warn"
  }>
}

interface DecisionContext {
  board: Board & { defectsSummary?: { type: string; count: number }[] } // Augment Board for defects summary
  selectedSort: SortDecision
  rejectedSorts: SortDecision[]
}
// --- End Helper Types ---

interface GradeRejectionModalProps {
  isOpen: boolean
  onClose: () => void
  decisionContext: DecisionContext | null // Changed from 'board' to 'decisionContext'
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
    value: 45.5,
    grade: "FAS", // This is the final grade from the selected sort
    status: "processed",
    defectCount: 3,
    defects: [
      { type: "Knot", count: 2, position: { x: 10, y: 20 }, severity: "Moderate", face: 1 },
      { type: "Wane", count: 1, position: { x: 30, y: 40 }, severity: "Major", face: 1 },
    ],
    defectsSummary: [
      // Added for header
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
    decisionSummary: [
      "Matched 100% of FAS grade rules for Soft Maple.",
      "Matched color filter: 'Light Maple'.",
      "Met minimum dimension threshold (Length >8ft).",
      "Tolerances within limit for all detected defects.",
    ],
    colorFilterMatched: { name: "Light Maple", matched: true, details: "Color profile score 0.85 (Threshold >0.8)" },
    dimensionThresholdMet: { met: true, details: "Length 2600mm (Threshold >2438mm)" },
    defectChecks: [
      { defectName: "Knot", status: "Pass", message: "Max knot size 18mm (Limit ≤20mm)" },
      { defectName: "Wane", status: "Pass", message: "Wane 12% (Limit ≤15%)" },
    ],
    fullGradingLogic: [
      {
        ruleName: "Knot Size (Face A)",
        result: "Pass",
        actualValue: "18mm",
        thresholdValue: "≤20mm",
        overriddenBySortLogic: false,
      },
      { ruleName: "Wane Percentage (Overall)", result: "Pass", actualValue: "12%", thresholdValue: "≤15%" },
      { ruleName: "Min Length", result: "Pass", actualValue: "2600mm", thresholdValue: "≥2438mm" },
      { ruleName: "Color Profile (Light Maple)", result: "Pass", actualValue: "0.85", thresholdValue: "≥0.80" },
    ],
  },
  rejectedSorts: [
    {
      sortId: "SORT-001",
      sortName: "Sort 1 – Soft Maple No. 1C < 2.4m",
      isSelected: false,
      decisionSummary: [], // Not needed for rejected
      defectChecks: [], // Not needed for rejected
      rejectionReasons: [
        { criterion: "Length", reason: "Board too long (2600mm vs. max 2400mm)", status: "Fail" },
        {
          criterion: "Color Filter",
          reason: "Did not match 'Mixed Color' (Actual: Light, Required: Mixed)",
          status: "Fail",
        },
        { criterion: "Wane Defect", reason: "Wane over threshold (12% vs. max 10% for 1C)", status: "Fail" },
      ],
    },
    {
      sortId: "SORT-004",
      sortName: "Sort 4 – Soft Maple Premium Clear (No Defects)",
      isSelected: false,
      decisionSummary: [],
      defectChecks: [],
      rejectionReasons: [
        { criterion: "Defects Present", reason: "Rejected due to presence of knots (2) and wane (1)", status: "Fail" },
        {
          criterion: "Color Score",
          reason: "Not white enough (Color score 0.85 < required 0.95 for Premium Clear)",
          status: "Fail",
        },
      ],
    },
  ],
})
// --- End Sample Data ---

export function GradeRejectionModal({
  isOpen,
  onClose,
  decisionContext: decisionContextProp, // Renamed prop
}: GradeRejectionModalProps) {
  const [showFullLogic, setShowFullLogic] = useState(false)
  const [showComparisonView, setShowComparisonView] = useState(false) // For optional feature

  // Use sample data if no prop is provided (for development/preview)
  const decisionContext = decisionContextProp || generateSampleDecisionContext("B-184729")

  if (!decisionContext) return null
  const { board, selectedSort, rejectedSorts } = decisionContext

  const getStatusIcon = (status: "Pass" | "Fail" | "Warn") => {
    if (status === "Pass") return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === "Fail") return <XCircle className="h-4 w-4 text-red-500" />
    if (status === "Warn") return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <Info className="h-4 w-4 text-gray-500" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg">Decision Logic for Board: {board.id}</DialogTitle>
          <DialogDescription>Understanding why this board was assigned to its Sort and Grade.</DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-2 space-y-4 py-2">
          {/* Header Section */}
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <h4 className="font-semibold text-sm mb-1">Board Details</h4>
                <p>
                  <strong>ID:</strong> {board.id}
                </p>
                <p>
                  <strong>Batch:</strong> {board.batchId} ({board.batchName})
                </p>
                <p>
                  <strong>Species:</strong> {board.woodType}
                </p>
                <p>
                  <strong>Aspect:</strong> {board.processing}
                </p>
                <p>
                  <strong>Dimensions:</strong> {board.dimensions.length} L x {board.dimensions.width} W x{" "}
                  {board.dimensions.thickness} T
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Thumbnails</h4>
                <div className="flex gap-2">
                  <Image
                    src={board.imageFront || "/placeholder.svg"}
                    alt="Front Face"
                    width={80}
                    height={48}
                    className="rounded border object-cover"
                  />
                  {board.imageBack && (
                    <Image
                      src={board.imageBack || "/placeholder.svg"}
                      alt="Back Face"
                      width={80}
                      height={48}
                      className="rounded border object-cover"
                    />
                  )}
                  {/* Add more thumbnails if available (edge, etc.) */}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Defects Summary</h4>
                {board.defectsSummary && board.defectsSummary.length > 0 ? (
                  board.defectsSummary.map((defect, i) => (
                    <Badge key={i} variant="secondary" className="mr-1 mb-1">
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

          {/* Section 1: Selected Sort & Grade */}
          <div className="p-3 border border-green-500 bg-green-50 rounded-lg">
            <h3 className="text-base font-semibold text-green-700 mb-1 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" /> Selected Sort & Grade
            </h3>
            <p className="text-sm">
              <strong>Sort:</strong> <Badge variant="default">{selectedSort.sortName}</Badge>
            </p>
            <p className="text-sm">
              <strong>Grade:</strong> <Badge variant="default">{selectedSort.gradeAssigned}</Badge>
            </p>

            <div className="mt-2 text-xs space-y-1 text-green-600">
              <h4 className="font-medium">Decision Summary:</h4>
              {selectedSort.decisionSummary.map((reason, i) => (
                <p key={i} className="flex items-start">
                  <CheckCircle className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                  {reason}
                </p>
              ))}
            </div>

            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-green-200">
              <Switch id="show-full-logic" checked={showFullLogic} onCheckedChange={setShowFullLogic} />
              <Label htmlFor="show-full-logic" className="text-xs">
                Show Full Grading Logic
              </Label>
            </div>

            {showFullLogic && selectedSort.fullGradingLogic && (
              <div className="mt-2 p-2 bg-green-100/50 rounded space-y-1 border border-green-200">
                <h5 className="text-xs font-semibold mb-1">Detailed Rule Evaluation:</h5>
                {selectedSort.fullGradingLogic.map((rule, i) => (
                  <div key={i} className="grid grid-cols-4 gap-1 text-xs p-1 rounded hover:bg-green-100 items-center">
                    <div className="font-medium col-span-2 flex items-center">
                      {getStatusIcon(rule.result)}
                      <span className="ml-1.5">{rule.ruleName}</span>
                      {rule.overriddenBySortLogic && (
                        <Tag className="h-3 w-3 ml-1 text-blue-500" title="Overridden by Sort Logic" />
                      )}
                    </div>
                    <div>
                      Value:{" "}
                      <Badge
                        variant={
                          rule.result === "Pass" ? "default" : rule.result === "Fail" ? "destructive" : "outline"
                        }
                        size="sm"
                      >
                        {rule.actualValue}
                      </Badge>
                    </div>
                    <div>
                      Threshold:{" "}
                      <Badge variant="secondary" size="sm">
                        {rule.thresholdValue}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Why Other Sorts/Grades Were Not Chosen */}
          {rejectedSorts.length > 0 && (
            <div className="p-3 border rounded-lg">
              <h3 className="text-base font-semibold mb-2 flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-500" /> Why Other Sorts Were Not Chosen
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {rejectedSorts.map((sort, i) => (
                  <AccordionItem value={`item-${i}`} key={sort.sortId}>
                    <AccordionTrigger className="text-sm hover:no-underline py-2 bg-muted/30 px-3 rounded data-[state=open]:bg-muted/50">
                      <div className="flex items-center justify-between w-full">
                        <span>{sort.sortName}</span>
                        <Badge variant="destructive" size="sm">
                          Rejected
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-1 px-3 text-xs space-y-1 bg-muted/10">
                      {sort.rejectionReasons?.map((reason, j) => (
                        <div key={j} className="flex items-start">
                          {getStatusIcon(reason.status)}
                          <span className="ml-1.5">
                            <strong>{reason.criterion}:</strong> {reason.reason}
                          </span>
                        </div>
                      ))}
                      {!sort.rejectionReasons && <p>No specific rejection reasons provided.</p>}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Optional: Visual Comparison View Placeholder */}
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center">
                <ScanLine className="h-5 w-5 mr-2 text-blue-500" /> Compare Eligible Sorts (Optional)
              </h3>
              <Switch id="show-comparison-view" checked={showComparisonView} onCheckedChange={setShowComparisonView} />
            </div>
            {showComparisonView && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-center text-sm text-blue-700">
                Visual comparison view would appear here, showing side-by-side cards of candidate sorts.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Simulate with different rule for board:", board.id)}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Simulate With Different Rule
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
