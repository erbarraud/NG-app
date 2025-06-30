"use client"

import { useState, useEffect } from "react"

// Check if we're in a preview environment
export function usePreviewMode(): boolean {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    // Check for preview mode based on URL or environment variables
    const hostname = window.location.hostname
    const isVercelPreview = hostname.includes("vercel.app") || hostname.includes("localhost")

    // Additional checks could be added here
    setIsPreview(isVercelPreview)
  }, [])

  return isPreview
}
