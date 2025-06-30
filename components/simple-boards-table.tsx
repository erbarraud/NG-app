"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/status-indicator"
import { Button } from "@/components/ui/button"
import { ChevronRight, AlertTriangle } from "lucide-react"
import type { Board } from "@/types/board"

interface SimpleBoardsTableProps {
  boards: Board[]
  onBoardSelect: (boardId: string) => void
}

export function SimpleBoardsTable({ boards, onBoardSelect }: SimpleBoardsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Board ID</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead className="w-[60%]">Board Images</TableHead>
          <TableHead>Defects</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {boards.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
              <TableRow key={board.id}>
                <TableCell className="font-medium">{board.id}</TableCell>
                <TableCell>
                  <Badge variant="outline">{board.grade}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-4">
                    {/* Face 1 */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">Face 1</span>
                        {face1DefectCount > 0 && (
                          <Badge variant={face1DefectCount > 2 ? "destructive" : "outline"} className="text-xs">
                            {face1DefectCount} defects
                          </Badge>
                        )}
                      </div>
                      <div className="relative border rounded-md overflow-hidden" style={{ height: "120px" }}>
                        <img
                          src={board.imageFront || "/placeholder.svg"}
                          alt={`Board ${board.id} front view`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Face 2 */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">Face 2</span>
                        {face2DefectCount > 0 && (
                          <Badge variant={face2DefectCount > 2 ? "destructive" : "outline"} className="text-xs">
                            {face2DefectCount} defects
                          </Badge>
                        )}
                      </div>
                      <div className="relative border rounded-md overflow-hidden" style={{ height: "120px" }}>
                        <img
                          src={board.imageBack || "/placeholder.svg"}
                          alt={`Board ${board.id} back view`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
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
                <TableCell className="text-right">
                  <Button variant="outline" onClick={() => onBoardSelect(board.id)}>
                    View Board
                    <ChevronRight className="ml-1 h-4 w-4" />
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
