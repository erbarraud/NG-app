import { type Defect, getSeverityType } from "@/types/board"
import { StatusIndicator } from "@/components/status-indicator"

interface BoardDefectBadgesProps {
  defects: Defect[]
  face: 1 | 2
  showAllDefects: boolean
}

/**
 * Renders defect badges with information
 */
export function BoardDefectBadges({ defects, face, showAllDefects }: BoardDefectBadgesProps) {
  if (!defects || defects.length === 0) return null

  // Filter defects by face and severity if needed
  const filteredDefects = defects.filter(
    (defect) => defect.face === face && (showAllDefects || defect.severity !== "Minor"),
  )

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {filteredDefects.map((defect, index) => (
        <div key={index} className="inline-flex items-center mr-2">
          <StatusIndicator type={getSeverityType(defect.severity)} caption={`${defect.type} (${defect.severity})`} />
        </div>
      ))}
    </div>
  )
}
