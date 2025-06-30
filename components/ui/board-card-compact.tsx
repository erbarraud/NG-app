"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { DollarSign, Hash, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Board } from "@/types/board"
import Link from "next/link"

interface BoardCardCompactProps {
  board: Board
  onClick?: (board: Board) => void
  isHighlighted?: boolean
  showLink?: boolean
  className?: string
}

/**
 * BoardCardCompact Component
 *
 * A reusable compact card for displaying board information consistently across the application.
 *
 * @param board - The board data to display
 * @param onClick - Optional click handler for the board
 * @param isHighlighted - Whether to highlight the card (e.g., for new items)
 * @param showLink - Whether to show a link to the board detail page
 * @param className - Additional CSS classes
 */
export function BoardCardCompact({
  board,
  onClick,
  isHighlighted = false,
  showLink = false,
  className,
}: BoardCardCompactProps) {
  const handleClick = () => {
    if (onClick) onClick(board)
  }

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-md", isHighlighted && "bg-primary/5", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <button className="font-medium text-primary hover:underline" onClick={handleClick}>
                {board.id}
              </button>
            </div>
            <StatusBadge status={board.grade} />
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>${board.value.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">{board.timestamp}</div>
            <Badge variant="secondary" className="ml-2">
              Face {board.currentFace}
            </Badge>
          </div>
        </div>

        {/* Defect tags */}
        {board.defects && board.defects.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {board.defects.map((defect, idx) => (
              <StatusBadge
                key={idx}
                severity={defect.severity}
                label={`${defect.type} (${defect.severity})`}
                className="text-xs"
              />
            ))}
          </div>
        )}

        {/* Preview image and metadata */}
        <div className="mt-2 flex gap-4">
          <div className="relative w-24 h-12 border rounded overflow-hidden">
            <img
              src={board.imageFront || "/placeholder.svg"}
              alt={`Board ${board.id}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Batch:</span> {board.batchName}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Defects:</span> {board.defectCount}
            </div>
          </div>

          {showLink && (
            <div className="ml-auto flex items-center">
              <Link
                href={`/board-finder/${board.id}`}
                className="text-sm text-primary hover:underline flex items-center"
              >
                View Details <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
