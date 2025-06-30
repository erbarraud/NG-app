"use client"

import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef, useState, useEffect } from "react"

interface UseVirtualizedTableProps<T> {
  data: T[]
  rowHeight?: number
  overscan?: number
}

export function useVirtualizedTable<T>({ data, rowHeight = 48, overscan = 10 }: UseVirtualizedTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [parentHeight, setParentHeight] = useState(0)

  useEffect(() => {
    if (parentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        setParentHeight(entries[0].contentRect.height)
      })

      resizeObserver.observe(parentRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalHeight = rowVirtualizer.getTotalSize()

  return {
    parentRef,
    virtualItems,
    totalHeight,
  }
}
