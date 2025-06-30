"use client"

import type * as React from "react"
import type { DayPicker } from "react-day-picker"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return null
}
Calendar.displayName = "Calendar"

export { Calendar }
