import { type Defect, getSeverityType } from "@/types/board"

interface BoardDefectMarkersProps {
  defects: Defect[]
  face: 1 | 2
  showAllDefects: boolean
}

/**
 * Renders defect markers on a board image
 */
export function BoardDefectMarkers({ defects, face, showAllDefects }: BoardDefectMarkersProps) {
  if (!defects || defects.length === 0) return null

  // Filter defects by face and severity if needed
  const filteredDefects = defects.filter(
    (defect) => defect.face === face && (showAllDefects || defect.severity !== "Minor"),
  )

  return (
    <>
      {filteredDefects.map((defect, index) => (
        <div
          key={index}
          className={`absolute w-6 h-6 rounded-full flex items-center justify-center -ml-3 -mt-3 border-2 ${
            getSeverityType(defect.severity) === "error"
              ? "border-red-500 bg-red-100"
              : getSeverityType(defect.severity) === "warning"
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
    </>
  )
}
