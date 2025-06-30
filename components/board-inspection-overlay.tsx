"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { X, ZoomIn, ZoomOut, Move, BookOpen, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { StatusIndicator } from "@/components/status-indicator"
import { type Board, type Defect, getSeverityType } from "@/types/board"
import { BoardMagnifier } from "@/components/board-magnifier"

interface BoardInspectionOverlayProps {
  isOpen: boolean
  onClose: () => void
  board: Board | null
  face: 1 | 2
  showAllDefects: boolean
}

/**
 * BoardInspectionOverlay - A component that displays a zoomable, high-resolution view of a board
 * with defect markers and information.
 */
export function BoardInspectionOverlay({ isOpen, onClose, board, face, showAllDefects }: BoardInspectionOverlayProps) {
  // Refs and state for zooming and panning
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [magnifierEnabled, setMagnifierEnabled] = useState(true)

  const [isAddingToBundle, setIsAddingToBundle] = useState(false)
  const [bundleAddSuccess, setBundleAddSuccess] = useState(false)

  // Reset position and scale when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  /**
   * Zoom in by increasing the scale factor
   */
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  /**
   * Zoom out by decreasing the scale factor
   */
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 1))
  }

  /**
   * Start dragging when mouse is pressed down
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  /**
   * Update position while dragging
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  /**
   * Stop dragging when mouse is released
   */
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  /**
   * Get filtered defects for the current face
   */
  const getFilteredDefects = (): Defect[] => {
    if (!board?.defects) return []

    return board.defects.filter((defect) => defect.face === face && (showAllDefects || defect.severity !== "Minor"))
  }

  /**
   * Handle adding the current board to the reference bundle
   */
  const handleAddToReferenceBundle = async () => {
    if (!board) return

    setIsAddingToBundle(true)

    try {
      // Simulate API call to add board to reference bundle
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, this would call an API endpoint
      console.log(`Adding board ${board.id} to reference bundle for quality control/training`)

      setBundleAddSuccess(true)
      setTimeout(() => setBundleAddSuccess(false), 3000) // Clear success message after 3 seconds
    } catch (error) {
      console.error("Failed to add board to reference bundle:", error)
    } finally {
      setIsAddingToBundle(false)
    }
  }

  /**
   * Render defect markers on the board image
   */
  const renderDefectMarkers = () => {
    const filteredDefects = getFilteredDefects()

    return filteredDefects.map((defect, index) => (
      <div
        key={index}
        className={`absolute w-8 h-8 rounded-full flex items-center justify-center -ml-4 -mt-4 border-2 ${
          getSeverityType(defect.severity) === "error"
            ? "border-red-500 bg-red-100"
            : getSeverityType(defect.severity) === "warning"
              ? "border-orange-400 bg-orange-100"
              : "border-blue-500 bg-blue-100"
        }`}
        style={{
          left: `${(defect.position.x / 800) * 100}%`,
          top: `${(defect.position.y / 350) * 100}%`,
          transform: `scale(${1 / scale})`, // Counter the container scaling to keep markers the same size
        }}
      >
        <span className="text-sm font-bold">{index + 1}</span>
      </div>
    ))
  }

  /**
   * Render defect badges with information
   */
  const renderDefectBadges = () => {
    const filteredDefects = getFilteredDefects()

    return filteredDefects.map((defect, index) => (
      <div key={index} className="inline-flex items-center mr-2">
        <StatusIndicator
          type={getSeverityType(defect.severity)}
          caption={`${index + 1}: ${defect.type} (${defect.severity})`}
        />
      </div>
    ))
  }

  // Get the appropriate image URL for the current face, matching the Board Finder view
  const imageUrl =
    face === 1 ? board?.imageFront || "/wooden-board-texture.png" : board?.imageBack || "/wooden-board-texture-back.png"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        {/* Header with controls */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {board ? `Inspecting ${board.id} - Face ${face}` : "No board selected"}
            </h2>
            {board && <p className="text-sm text-muted-foreground">{getFilteredDefects().length} defects detected</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={scale <= 1}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={scale >= 3}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleAddToReferenceBundle}
              disabled={isAddingToBundle || !board}
            >
              {isAddingToBundle ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Adding...
                </>
              ) : bundleAddSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Added to Bundle
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  Add to Reference Bundle
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {board ? (
          <div className="p-4 flex-1 overflow-hidden" ref={containerRef}>
            {/* Defect badges */}
            <div className="mb-3 flex flex-wrap gap-2">{renderDefectBadges()}</div>

            {/* Zoomable board image with defect markers */}
            <div
              className="relative overflow-hidden border rounded-md cursor-move"
              style={{ height: "calc(90vh - 180px)" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Drag instruction indicator */}
              {scale > 1 && (
                <div className="absolute top-4 left-4 bg-background/80 rounded z-10 flex items-center gap-1 p-1">
                  <Move className="h-4 w-4" />
                  <span className="text-xs">Drag to pan</span>
                </div>
              )}

              {/* Zoomable container */}
              <div
                className="relative transition-transform w-full h-full"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "0 0",
                  translate: `${position.x}px ${position.y}px`,
                }}
              >
                {/* Board image - using BoardMagnifier component for consistency with Board Finder view */}
                <div className="w-full h-full">
                  <BoardMagnifier
                    src={imageUrl}
                    alt={`Board ${face === 1 ? "front" : "back"} view`}
                    magnifierSize={150}
                    zoomLevel={2.5}
                    shape="circle"
                    enabled={magnifierEnabled}
                  />
                </div>

                {/* Defect markers */}
                {renderDefectMarkers()}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No board data available for inspection</p>
            <p className="text-sm text-muted-foreground mt-2">Please select a board to inspect</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
