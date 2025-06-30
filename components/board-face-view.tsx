"use client"

import { StatusIndicator } from "@/components/status-indicator"
import { BoardMagnifier } from "@/components/board-magnifier"
import { getSeverityType, type Board, type BoardFace, type Defect } from "@/types/board"

interface BoardFaceViewProps {
  board: Board
  face: BoardFace
  showAllDefects: boolean
  magnifierEnabled?: boolean
}

export function BoardFaceView({ board, face, showAllDefects, magnifierEnabled = false }: BoardFaceViewProps) {
  /**
   * Filter and render defect badges for the current face
   */
  const renderDefectBadges = () => {
    if (!board.defects?.length) return null

    return board.defects
      .filter((defect: Defect) => defect.face === face && (showAllDefects || defect.severity !== "Minor"))
      .map((defect: Defect, index: number) => (
        <div key={`${defect.type}-${index}`} className="inline-flex items-center mr-2">
          <StatusIndicator type={getSeverityType(defect.severity)} caption={`${defect.type} (${defect.severity})`} />
        </div>
      ))
  }

  // Get appropriate image for the face
  const faceImageUrl =
    face === 1 ? board.imageFront || "/wooden-board-texture.png" : board.imageBack || "/wooden-board-texture-back.png"

  // Count defects for this face
  const faceDefectCount = board.defects?.filter((d: Defect) => d.face === face).length || 0

  return (
    <div className="space-y-4">
      {/* Face Header */}
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-lg">Face {face}</h3>
        <StatusIndicator
          type={faceDefectCount > 0 ? "warning" : "success"}
          caption={faceDefectCount > 0 ? `${faceDefectCount} defect${faceDefectCount !== 1 ? "s" : ""}` : "No defects"}
        />
      </div>

      {/* Board Image with Magnifier */}
      <div className="relative border rounded-lg overflow-hidden bg-gray-50">
        <BoardMagnifier
          src={faceImageUrl}
          alt={`Board ${face === 1 ? "front" : "back"} view`}
          magnifierSize={150}
          zoomLevel={2.5}
          shape="circle"
          enabled={magnifierEnabled}
        />
      </div>

      {/* Defect Badges */}
      {faceDefectCount > 0 && <div className="flex flex-wrap gap-2">{renderDefectBadges()}</div>}
    </div>
  )
}
