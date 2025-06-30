"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimeSegment {
  hour: string
  count: number
  timestamp: string
}

interface BatchTimelineNavigatorProps {
  timeSegments: TimeSegment[]
  onSelectHour: (hour: string) => void
  selectedHour: string
}

export function BatchTimelineNavigator({ timeSegments, onSelectHour, selectedHour }: BatchTimelineNavigatorProps) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 8 })
  const maxCount = Math.max(...timeSegments.map((segment) => segment.count))

  // Calculate if we need pagination
  const needsPagination = timeSegments.length > 8

  // Handle pagination
  const handlePrevious = () => {
    if (visibleRange.start > 0) {
      setVisibleRange({
        start: Math.max(0, visibleRange.start - 4),
        end: Math.max(8, visibleRange.end - 4),
      })
    }
  }

  const handleNext = () => {
    if (visibleRange.end < timeSegments.length) {
      setVisibleRange({
        start: visibleRange.start + 4,
        end: Math.min(timeSegments.length, visibleRange.end + 4),
      })
    }
  }

  // Get visible segments
  const visibleSegments = timeSegments.slice(visibleRange.start, visibleRange.end)

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Batch Timeline</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8">
                  Today
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  Yesterday
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  This Week
                </Button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Date Range</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{
                      from: new Date(),
                      to: new Date(),
                    }}
                    onSelect={(range) => {
                      console.log("Date range selected:", range)
                      // In a real app, you would update the timeSegments based on this range
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Select an hour to view boards</div>

          <div className="flex items-end gap-1">
            {needsPagination && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handlePrevious}
                disabled={visibleRange.start === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous hours</span>
              </Button>
            )}

            <div className="flex-1 flex items-end gap-1">
              <TooltipProvider>
                {visibleSegments.map((segment) => {
                  const isSelected = segment.hour === selectedHour
                  const height = Math.max(20, (segment.count / maxCount) * 80)

                  return (
                    <Tooltip key={segment.hour}>
                      <TooltipTrigger asChild>
                        <button
                          className={`relative group flex-1 min-w-0 rounded-t-sm transition-all ${
                            isSelected ? "bg-primary" : "bg-muted hover:bg-primary/20"
                          }`}
                          style={{ height: `${height}px` }}
                          onClick={() => onSelectHour(segment.hour)}
                        >
                          <div className="absolute inset-x-0 -bottom-6 text-[10px] text-center">{segment.hour}</div>
                          <div
                            className={`absolute inset-x-0 -top-6 text-[10px] text-center ${
                              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            } transition-opacity`}
                          >
                            {segment.count}
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div className="font-medium">{segment.timestamp}</div>
                          <div>{segment.count} boards</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </TooltipProvider>
            </div>

            {needsPagination && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleNext}
                disabled={visibleRange.end >= timeSegments.length}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next hours</span>
              </Button>
            )}
          </div>

          <div className="h-6 mt-1 border-t pt-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Total: {timeSegments.reduce((sum, segment) => sum + segment.count, 0)} boards</span>
              <span>Batch duration: {timeSegments.length} hours</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
