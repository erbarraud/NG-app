"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/status-indicator"
import { Button } from "@/components/ui/button"
import { ChevronRight, AlertTriangle, Clock } from "lucide-react"
import type { Board } from "@/types/board"

interface BoardsTableProps {
  boards: Board[]
  onBoardSelect: (boardId: string) => void
}

export function BoardsTable({ boards, onBoardSelect }: BoardsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Board ID</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Face 1</TableHead>
          <TableHead>Face 2</TableHead>
          <TableHead>Defects</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {boards.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              No boards found matching your search
            </TableCell>
          </TableRow>
        ) : (
          boards.map((board) => {
            // Get defect counts for each face
            const face1DefectCount = board.defects?.filter((d) => d.face === 1).length || 0
            const face2DefectCount = board.defects?.filter((d) => d.face === 2).length || 0

            // Determine if there are any severe defects
            const hasSevereDefects =
              board.defects?.some((d) => d.severity === "Major" || d.severity === "Severe") || false

            return (
              <TableRow
                key={board.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onBoardSelect(board.id)}
              >
                <TableCell className="font-medium">{board.id}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {board.timestamp}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{board.grade}</Badge>
                </TableCell>
                <TableCell>
                  <div className="relative w-32 h-16 border rounded-md overflow-hidden">
                    <img
                      src={board.imageFront || "/placeholder.svg"}
                      alt={`Board ${board.id} front view`}
                      className="w-full h-full object-contain"
                    />
                    {face1DefectCount > 0 && (
                      <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {face1DefectCount}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative w-32 h-16 border rounded-md overflow-hidden">
                    <img
                      src={board.imageBack || "/placeholder.svg"}
                      alt={`Board ${board.id} back view`}
                      className="w-full h-full object-contain"
                    />
                    {face2DefectCount > 0 && (
                      <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {face2DefectCount}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {board.defectCount > 0 ? (
                    <div className="flex items-center gap-1">
                      <StatusIndicator
                        type={hasSevereDefects ? "error" : board.defectCount > 2 ? "warning" : "info"}
                        caption={`${board.defectCount} defects`}
                      />
                      {hasSevereDefects && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                  ) : (
                    <StatusIndicator type="success" caption="No defects" />
                  )}
                </TableCell>
                <TableCell>
                  <StatusIndicator type={board.status === "active" ? "success" : "info"} caption={board.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
