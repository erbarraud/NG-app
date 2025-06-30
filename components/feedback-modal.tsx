"use client"

import { useState } from "react"
import { Check, X, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Grade options with their values
const gradeOptions = [
  { id: "sb", label: "S&B", value: 14.85 },
  { id: "1common", label: "1 Common", value: 8.37 },
  { id: "1c-better-skip", label: "1C & Better Skip", value: 4.8 },
  { id: "below-grade", label: "Below Grade", value: 0.6 },
  { id: "1c-natural", label: "1C Natural", value: 6.6 },
  { id: "sb-natural", label: "S&B Natural", value: 9.0 },
]

// Reason options grouped by category
const reasonCategories = [
  {
    name: "Grading rules",
    options: [
      { id: "grading-rules", label: "Grading rules" },
      { id: "length-width", label: "Length and width" },
    ],
  },
  {
    name: "Defect detection",
    options: [
      { id: "defect-detection", label: "Defect detection" },
      { id: "trait-detection", label: "Trait detection" },
      { id: "critical-issue", label: "Critical issue" },
    ],
  },
  {
    name: "Color defect detection",
    options: [
      { id: "color-defect-detection", label: "Color defect detection" },
      { id: "other", label: "Other" },
    ],
  },
]

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: FeedbackData) => void
  boardId: string
  currentGrade: string
  aiSelectedGradeId?: string
  aiSelectedGradeLabel?: string
}

export interface FeedbackData {
  boardId: string
  aiSelectedGrade: string
  selectedGrade: string
  selectedReason: string
  comments: string
}

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  boardId,
  currentGrade,
  aiSelectedGradeId = "sb",
  aiSelectedGradeLabel = "S&B",
}: FeedbackModalProps) {
  const [selectedGrade, setSelectedGrade] = useState(currentGrade || "sb")
  const [selectedReason, setSelectedReason] = useState("")
  const [comments, setComments] = useState("")

  const handleSubmit = () => {
    onSubmit({
      boardId,
      aiSelectedGrade: aiSelectedGradeId,
      selectedGrade,
      selectedReason,
      comments,
    })

    // Reset form
    setSelectedReason("")
    setComments("")
    onClose()
  }

  // Find the currently selected grade object
  const selectedGradeObj = gradeOptions.find((g) => g.id === selectedGrade)
  const aiGradeObj = gradeOptions.find((g) => g.id === aiSelectedGradeId)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Feedback for grade: {aiSelectedGradeLabel}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* AI Grade Info */}
          <div className="bg-muted p-2 rounded-lg border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">AI Selected Grade:</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-base px-3 py-1">
                {aiGradeObj?.label || "S&B"}
              </Badge>
              <span className="font-medium">${aiGradeObj?.value.toFixed(2) || "14.85"}</span>
            </div>
          </div>

          {/* Grade Selection */}
          <div>
            <div className="text-sm font-medium mb-2">Select your preferred grade:</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gradeOptions.map((grade) => (
                <div key={grade.id} className="flex flex-col">
                  <Button
                    variant={selectedGrade === grade.id ? "default" : "outline"}
                    className={`h-10 text-base font-medium ${selectedGrade === grade.id ? "" : ""}`}
                    onClick={() => setSelectedGrade(grade.id)}
                  >
                    {grade.label}
                    <span className="ml-1 text-xs opacity-80">${grade.value.toFixed(2)}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Reason Selection */}
          <div>
            <div className="text-sm font-medium mb-2">Reason for disagreement:</div>
            <div className="space-y-3">
              {reasonCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">{category.name}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {category.options.map((reason) => (
                      <Button
                        key={reason.id}
                        variant={selectedReason === reason.id ? "default" : "outline"}
                        className={`h-8 text-sm justify-start`}
                        onClick={() => setSelectedReason(reason.id)}
                      >
                        {reason.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <div className="text-sm font-medium mb-2">Additional Comments:</div>
            <Textarea
              placeholder="Please provide any additional details..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
              className="w-full resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedReason}>
              <Check className="mr-2 h-4 w-4" /> Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
