"use client"

import type React from "react"
import { useState, useRef } from "react"

interface BoardMagnifierProps {
  src: string
  alt: string
  width?: number
  height?: number
  magnifierSize?: number
  zoomLevel?: number
  shape?: "circle" | "square"
  className?: string
  enabled?: boolean
}

export function BoardMagnifier({
  src,
  alt,
  width = 800,
  height = 350,
  magnifierSize = 150,
  zoomLevel = 2.5,
  shape = "circle",
  className = "",
  enabled = true,
}: BoardMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate magnifier position and background position
  const calculateMagnifierStyles = () => {
    if (!imgRef.current || !containerRef.current) return {}

    const imgRect = imgRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculate relative position within the image
    const relativeX = mousePosition.x - containerRect.left
    const relativeY = mousePosition.y - containerRect.top

    // Calculate background position for the magnifier
    const bgX = (relativeX / imgRect.width) * 100
    const bgY = (relativeY / imgRect.height) * 100

    // Calculate magnifier position
    // Offset by half the magnifier size to center it on the cursor
    const magnifierX = relativeX - magnifierSize / 2
    const magnifierY = relativeY - magnifierSize / 2

    // Ensure magnifier stays within the image boundaries
    const boundedX = Math.max(0, Math.min(imgRect.width - magnifierSize, magnifierX))
    const boundedY = Math.max(0, Math.min(imgRect.height - magnifierSize, magnifierY))

    return {
      magnifier: {
        left: `${boundedX}px`,
        top: `${boundedY}px`,
        width: `${magnifierSize}px`,
        height: `${magnifierSize}px`,
        borderRadius: shape === "circle" ? "50%" : "8px",
        backgroundImage: `url(${src})`,
        backgroundPosition: `${bgX}% ${bgY}%`,
        backgroundSize: `${imgRect.width * zoomLevel}px ${imgRect.height * zoomLevel}px`,
        backgroundRepeat: "no-repeat",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        border: "2px solid white",
      },
    }
  }

  const magnifierStyles = calculateMagnifierStyles()

  // Handle mouse events
  const handleMouseEnter = () => {
    if (enabled) {
      setShowMagnifier(true)
    }
  }

  const handleMouseLeave = () => {
    setShowMagnifier(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imgRef}
        src={src || "/placeholder.svg"}
        alt={alt}
        className="w-full h-auto border rounded-md"
        style={{ width: "100%", height: "auto" }}
      />
      {showMagnifier && enabled && (
        <div className="absolute pointer-events-none z-10" style={magnifierStyles.magnifier} />
      )}
    </div>
  )
}
