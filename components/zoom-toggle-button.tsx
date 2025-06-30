"use client"

import { ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useZoom } from "@/contexts/zoom-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ZoomToggleButton() {
  const { zoomEnabled, toggleZoom } = useZoom()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={zoomEnabled ? "default" : "outline"} size="sm" onClick={toggleZoom} className="h-8 gap-1">
            {zoomEnabled ? (
              <>
                <ZoomOut className="h-4 w-4" />
                <span className="hidden sm:inline">Disable Zoom</span>
              </>
            ) : (
              <>
                <ZoomIn className="h-4 w-4" />
                <span className="hidden sm:inline">Enable Zoom</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{zoomEnabled ? "Disable magnifier" : "Enable magnifier for all board images"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
