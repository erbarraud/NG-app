"use client"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

// Define a type for date range without relying on date-fns
interface DateRange {
  from?: Date
  to?: Date
}

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  onSelect: (date: DateRange | undefined) => void
  className?: string
}

export function DatePickerWithRange({ date, onSelect, className }: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={onSelect}
        numberOfMonths={2}
      />
    </div>
  )
}
