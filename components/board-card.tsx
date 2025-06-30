"use client"

import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/status-indicator"
import { Separator } from "@/components/ui/separator"
import type { Board } from "@/types/board"
import { AlertTriangle } from "lucide-react"

interface BoardCardProps {
  board: Board
  isCurrent?: boolean
  isCompact?: boolean
  onSelect: () => void
}

export function BoardCard({ board, isCurrent = false, isCompact = false, onSelect }: BoardCardProps) {
  // Get defect counts for each face
  const face1DefectCount = board.defects?.filter((d) => d.face === 1).length || 0
  const face2DefectCount = board.defects?.filter((d) => d.face === 2).length || 0

  // Determine if there are any severe defects
  const hasSevereDefects = board.defects?.some((d) => d.severity === "Major" || d.severity === "Severe") || false

  return (
    <div className="p-4 space-y-4">
      {/* Board info header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium">{board.id}</span>
          <Badge variant="outline">{board.grade}</Badge>
          {hasSevereDefects && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Severe Defects
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{board.timestamp}</div>
      </div>

      {/* Board images - stacked vertically */}
      <div className="space-y-4">
        {/* Face 1 */}
        <div>
          <div className="flex justify-between items-center mb-1">
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
          <div className="relative border rounded-md overflow-hidden" style={{ height: "200px" }}>
            <img
              src={board.imageFront || "/placeholder.svg"}
              alt={`Board ${board.id} front view`}
              className="w-full h-full object-contain"
              onClick={onSelect}
            />
            {/* Defect markers */}
            {board.defects
              ?.filter((d) => d.face === 1)
              .map((defect, index) => (
                <div
                  key={index}
                  className={`absolute w-5 h-5 rounded-full flex items-center justify-center -ml-2.5 -mt-2.5 border-2 ${
                    defect.severity === "Major" || defect.severity === "Severe"
                      ? "border-red-500 bg-red-100"
                      : defect.severity === "Moderate"
                        ? "border-orange-400 bg-orange-100"
                        : "border-blue-500 bg-blue-100"
                  }`}
                  style={{
                    left: `${(defect.position.x / 800) * 100}%`,
                    top: `${(defect.position.y / 350) * 100}%`,
                  }}
                >
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Face 2 */}
        <div>
          <div className="flex justify-between items-center mb-1">
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
          <div className="relative border rounded-md overflow-hidden" style={{ height: "200px" }}>
            <img
              src={board.imageBack || "/placeholder.svg"}
              alt={`Board ${board.id} back view`}
              className="w-full h-full object-contain"
              onClick={onSelect}
            />
            {/* Defect markers */}
            {board.defects
              ?.filter((d) => d.face === 2)
              .map((defect, index) => (
                <div
                  key={index}
                  className={`absolute w-5 h-5 rounded-full flex items-center justify-center -ml-2.5 -mt-2.5 border-2 ${
                    defect.severity === "Major" || defect.severity === "Severe"
                      ? "border-red-500 bg-red-100"
                      : defect.severity === "Moderate"
                        ? "border-orange-400 bg-orange-100"
                        : "border-blue-500 bg-blue-100"
                  }`}
                  style={{
                    left: `${(defect.position.x / 800) * 100}%`,
                    top: `${(defect.position.y / 350) * 100}%`,
                  }}
                >
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Board metadata */}
      {!isCompact && (
        <>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Dimensions</div>
              <div className="text-sm">
                {board.dimensions.length} × {board.dimensions.width} × {board.dimensions.thickness}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Volume</div>
              <div className="text-sm">{board.volume}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Value</div>
              <div className="text-sm">${board.value.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Defects</div>
              <div className="text-sm">{board.defectCount}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
