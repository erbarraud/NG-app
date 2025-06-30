"use client"

import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

// Define types
interface TimeInterval {
  id: string
  name: string
  start: string
  end: string
  enabled: boolean
  dayName?: string // Optional field for display purposes
}

interface DaySchedule {
  dayName: string
  intervals: TimeInterval[]
}

interface ShiftStatusProps {
  variant?: "default" | "compact"
  showHeader?: boolean
  className?: string
}

// Demo data - in a real app, this would come from a database or API
const demoSchedule: DaySchedule[] = [
  {
    dayName: "Monday",
    intervals: [
      { id: "1", name: "Morning Shift", start: "08:00", end: "16:00", enabled: true },
      { id: "2", name: "Evening Shift", start: "16:00", end: "00:00", enabled: true },
    ],
  },
  {
    dayName: "Tuesday",
    intervals: [
      { id: "3", name: "Morning Shift", start: "08:00", end: "16:00", enabled: true },
      { id: "4", name: "Evening Shift", start: "16:00", end: "00:00", enabled: true },
    ],
  },
  {
    dayName: "Wednesday",
    intervals: [
      { id: "5", name: "Morning Shift", start: "08:00", end: "16:00", enabled: true },
      { id: "6", name: "Evening Shift", start: "16:00", end: "00:00", enabled: true },
    ],
  },
  {
    dayName: "Thursday",
    intervals: [
      { id: "7", name: "Morning Shift", start: "08:00", end: "16:00", enabled: true },
      { id: "8", name: "Evening Shift", start: "16:00", end: "00:00", enabled: true },
    ],
  },
  {
    dayName: "Friday",
    intervals: [
      { id: "9", name: "Morning Shift", start: "07:00", end: "15:00", enabled: true },
      { id: "10", name: "Evening Shift", start: "15:00", end: "23:00", enabled: true },
    ],
  },
  {
    dayName: "Saturday",
    intervals: [{ id: "11", name: "Weekend Shift", start: "09:00", end: "17:00", enabled: true }],
  },
  {
    dayName: "Sunday",
    intervals: [],
  },
]

export function ShiftStatusDisplay({ variant = "default", showHeader = true, className = "" }: ShiftStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentShift, setCurrentShift] = useState<TimeInterval | null>(null)
  const [nextShift, setNextShift] = useState<TimeInterval | null>(null)

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Find current shift and next shift
    const now = currentTime
    const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1 // Convert to 0-6 index where 0 is Monday
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTimeStr = `${currentHours.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`

    const todaySchedule = demoSchedule[dayIndex]
    let foundCurrentShift: TimeInterval | null = null

    // Check for current shift
    for (const interval of todaySchedule.intervals) {
      if (!interval.enabled) continue

      const [startHour, startMinute] = interval.start.split(":").map(Number)
      const [endHour, endMinute] = interval.end.split(":").map(Number)

      const startMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute
      const nowMinutes = currentHours * 60 + currentMinutes

      if (nowMinutes >= startMinutes && nowMinutes < endMinutes) {
        foundCurrentShift = { ...interval, dayName: todaySchedule.dayName }
        break
      }
    }

    setCurrentShift(foundCurrentShift)

    // Find next shift
    let foundNextShift: TimeInterval | null = null

    // First check remaining shifts today
    if (foundCurrentShift === null) {
      // If no current shift, look for the next one today
      for (const interval of todaySchedule.intervals) {
        if (!interval.enabled) continue

        const [startHour, startMinute] = interval.start.split(":").map(Number)
        const startMinutes = startHour * 60 + startMinute
        const nowMinutes = currentHours * 60 + currentMinutes

        if (startMinutes > nowMinutes) {
          foundNextShift = { ...interval, dayName: todaySchedule.dayName }
          break
        }
      }
    } else {
      // If there is a current shift, find the one that starts after it ends
      const [currentEndHour, currentEndMinute] = foundCurrentShift.end.split(":").map(Number)
      const currentEndMinutes = currentEndHour * 60 + currentEndMinute

      for (const interval of todaySchedule.intervals) {
        if (!interval.enabled || interval.id === foundCurrentShift.id) continue

        const [startHour, startMinute] = interval.start.split(":").map(Number)
        const startMinutes = startHour * 60 + startMinute

        if (startMinutes >= currentEndMinutes) {
          foundNextShift = { ...interval, dayName: todaySchedule.dayName }
          break
        }
      }
    }

    // If no next shift found today, look at tomorrow
    if (foundNextShift === null) {
      const tomorrowIndex = (dayIndex + 1) % 7
      const tomorrowSchedule = demoSchedule[tomorrowIndex]

      for (const interval of tomorrowSchedule.intervals) {
        if (!interval.enabled) continue

        foundNextShift = { ...interval, dayName: tomorrowSchedule.dayName }
        break
      }
    }

    setNextShift(foundNextShift)
  }, [currentTime])

  // Format time for display
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {currentShift ? (
          <>
            <Badge
              variant="outline"
              className="border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2"
            >
              <Clock className="mr-1 h-3 w-3" />
              {currentShift.name}
            </Badge>
            <span className="text-xs text-muted-foreground">Until {formatTime(currentShift.end)}</span>
          </>
        ) : (
          <Badge
            variant="outline"
            className="border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 px-2"
          >
            No Active Shift
          </Badge>
        )}

        {nextShift && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Next:</span>
            <Badge
              variant="outline"
              className="border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2"
            >
              {nextShift.name} ({formatTime(nextShift.start)})
            </Badge>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center mb-2">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <h3 className="font-medium text-sm">Shift Status</h3>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium text-sm">Current:</div>
          {currentShift ? (
            <div className="flex flex-wrap items-center gap-1">
              <Badge
                variant="outline"
                className="border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                {currentShift.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatTime(currentShift.start)} - {formatTime(currentShift.end)}
              </span>
            </div>
          ) : (
            <Badge
              variant="outline"
              className="border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
            >
              No Active Shift
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium text-sm">Next:</div>
          {nextShift ? (
            <div className="flex flex-wrap items-center gap-1">
              <Badge
                variant="outline"
                className="border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
              >
                {nextShift.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {nextShift.dayName !== currentShift?.dayName ? `${nextShift.dayName}, ` : ""}
                {formatTime(nextShift.start)} - {formatTime(nextShift.end)}
              </span>
            </div>
          ) : (
            <Badge
              variant="outline"
              className="border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
            >
              No Upcoming Shifts
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
