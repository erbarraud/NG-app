"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ZoomContextType = {
  zoomEnabled: boolean
  toggleZoom: () => void
  enableZoom: () => void
  disableZoom: () => void
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined)

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [zoomEnabled, setZoomEnabled] = useState(false)

  const toggleZoom = () => setZoomEnabled((prev) => !prev)
  const enableZoom = () => setZoomEnabled(true)
  const disableZoom = () => setZoomEnabled(false)

  return (
    <ZoomContext.Provider value={{ zoomEnabled, toggleZoom, enableZoom, disableZoom }}>{children}</ZoomContext.Provider>
  )
}

export function useZoom() {
  const context = useContext(ZoomContext)
  if (context === undefined) {
    throw new Error("useZoom must be used within a ZoomProvider")
  }
  return context
}
