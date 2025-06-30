"use client"

import type React from "react"
import {
  AlertTriangle,
  Eye,
  Check,
  X,
  FileText,
  EyeOff,
  CheckCircle,
  Ruler,
  Box,
  DollarSign,
  AlertCircleIcon,
  Percent,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Board } from "@/types/board"
import { StatusIndicator } from "@/components/status-indicator"

interface BoardDetailViewProps {
  board: Board
  onInspect?: (board: Board, face: 1 | 2) => void
  onToggleShowAllDefects?: () => void
  onAgreeWithAI?: (boardId: string) => void
  onDisagreeWithAI?: (boardId: string) => void
  onViewGradeReasons?: (board: Board) => void
  showAllDefects?: boolean
  agreedWithAI?: boolean
  onPreviousBoard?: () => void
  onNextBoard?: () => void
  currentBoardIndex?: number
  totalBoards?: number
  hasPreviousBoard?: boolean
  hasNextBoard?: boolean
}

export const BoardDetailView: React.FC<BoardDetailViewProps> = ({
  board,
  onInspect = () => {},
  onToggleShowAllDefects = () => {},
  onAgreeWithAI = () => {},
  onDisagreeWithAI = () => {},
  onViewGradeReasons = () => {},
  showAllDefects = true,
  agreedWithAI = false,
  onPreviousBoard = () => {},
  onNextBoard = () => {},
  currentBoardIndex = 0,
  totalBoards = 0,
  hasPreviousBoard = false,
  hasNextBoard = false,
}) => {
  const face1DefectCount = board.defects?.filter((d) => d.face === 1).length || 0
  const face2DefectCount = board.defects?.filter((d) => d.face === 2).length || 0
  const hasSevereDefects = board.defects?.some((d) => d.severity === "Major" || d.severity === "Severe") || false

  const metadataItems = [
    { label: "Length", value: `${board.dimensions.length}"`, icon: Ruler },
    { label: "Width", value: `${board.dimensions.width}"`, icon: Ruler },
    { label: "Thickness", value: `${board.dimensions.thickness}"`, icon: Ruler },
    { label: "Volume", value: board.volume, icon: Box },
    { label: "Value", value: `$${board.value.toFixed(2)}`, icon: DollarSign },
    { label: "Total Defects", value: board.defectCount, icon: AlertCircleIcon },
    { label: "Yield", value: typeof board.yield === "number" ? `${board.yield.toFixed(0)}%` : "N/A", icon: Percent },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Board title header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Board {board.id}</h2>
        <Badge variant="outline">
          {board.grade}
          {typeof board.yield === "number" && ` (${board.yield.toFixed(0)}%)`}
        </Badge>
      </div>

      {/* Board info header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {hasSevereDefects && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Severe Defects
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {metadataItems.map((item) => (
          <div key={item.label} className="bg-muted/40 p-3 rounded-lg shadow-sm">
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

      {/* Action Buttons */}
      <div className="bg-muted/30 p-3 my-4 rounded-md">
        <div className="flex flex-wrap gap-3 justify-start">
          <Button variant="outline" className="flex items-center gap-2" onClick={onToggleShowAllDefects}>
            {showAllDefects ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide filtered defects
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show All Defects
              </>
            )}
          </Button>
          {agreedWithAI ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4" />
              You agreed with this grade
            </div>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              onClick={() => onAgreeWithAI(board.id)}
            >
              <Check className="h-4 w-4" />
              Agree with NG AI
            </Button>
          )}
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            onClick={() => onDisagreeWithAI(board.id)}
          >
            <X className="h-4 w-4" />
            Disagree with NG AI
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => onViewGradeReasons(board)}>
            <FileText className="h-4 w-4" />
            See Rejected Grades
          </Button>
        </div>
      </div>
      {/* ... (Rest of the component: board images, defect details, etc.) ... */}
      {/* Board images - stacked vertically */}
      <div className="space-y-6">
        {/* Face 1 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Face 1</span>
            {face1DefectCount > 0 ? (
              <StatusIndicator
                type={face1DefectCount > 2 ? "error" : face1DefectCount > 1 ? "warning" : "info"}
                caption={`${face1DefectCount} defects`}
              />
            ) : (
              <StatusIndicator type="success" caption="No defects" />
            )}
          </div>
          <div className="relative border rounded-md overflow-hidden">
            <img
              src={board.imageFront || "/wooden-board-texture.png"}
              alt={`Board ${board.id} front view`}
              className="w-full object-contain"
            />
          </div>
          {/* Defect badges for Face 1 */}
          {face1DefectCount > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from(new Set(board.defects?.filter((d) => d.face === 1).map((defect) => defect.type))).map(
                (defectType, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                    {defectType}
                  </Badge>
                ),
              )}
            </div>
          )}
        </div>

        {/* Face 2 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Face 2</span>
            {face2DefectCount > 0 ? (
              <StatusIndicator
                type={face2DefectCount > 2 ? "error" : face2DefectCount > 1 ? "warning" : "info"}
                caption={`${face2DefectCount} defects`}
              />
            ) : (
              <StatusIndicator type="success" caption="No defects" />
            )}
          </div>
          <div className="relative border rounded-md overflow-hidden">
            <img
              src={board.imageBack || "/wooden-board-texture-back.png"}
              alt={`Board ${board.id} back view`}
              className="w-full object-contain"
            />
          </div>
          {/* Defect badges for Face 2 */}
          {face2DefectCount > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {Array.from(new Set(board.defects?.filter((d) => d.face === 2).map((defect) => defect.type))).map(
                (defectType, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                    {defectType}
                  </Badge>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional metadata if available */}
      {board.clearCuttings && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Face 1 Clear Cuttings */}
            <div className="rounded-md border p-3 bg-muted/30 shadow-sm">
              <div className="text-sm font-semibold text-foreground mb-2">Clear Cuttings (Face 1)</div>
              <div className="space-y-1.5">
                {board.clearCuttings.face1.map((cutting, index) => (
                  <div key={index} className="text-xs flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {cutting.length} × {cutting.width}
                    </span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 font-normal">
                      {cutting.units} units
                    </Badge>
                  </div>
                ))}
                {board.clearCuttings.face1.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No clear cuttings for this face.</p>
                )}
              </div>
              {board.clearCuttings.face1.length > 0 && (
                <div className="text-sm font-semibold flex justify-between items-center pt-2 mt-2 border-t">
                  <span className="text-foreground">Total Units:</span>
                  <span className="text-primary">{board.totalCuttingUnits?.face1 || 0}</span>
                </div>
              )}
            </div>

            {/* Face 2 Clear Cuttings */}
            <div className="rounded-md border p-3 bg-muted/30 shadow-sm">
              <div className="text-sm font-semibold text-foreground mb-2">Clear Cuttings (Face 2)</div>
              <div className="space-y-1.5">
                {board.clearCuttings.face2.map((cutting, index) => (
                  <div key={index} className="text-xs flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {cutting.length} × {cutting.width}
                    </span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 font-normal">
                      {cutting.units} units
                    </Badge>
                  </div>
                ))}
                {board.clearCuttings.face2.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No clear cuttings for this face.</p>
                )}
              </div>
              {board.clearCuttings.face2.length > 0 && (
                <div className="text-sm font-semibold flex justify-between items-center pt-2 mt-2 border-t">
                  <span className="text-foreground">Total Units:</span>
                  <span className="text-primary">{board.totalCuttingUnits?.face2 || 0}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
