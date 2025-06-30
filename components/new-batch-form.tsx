"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormDescription, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function NewBatchForm({ scheduled = false }: { scheduled?: boolean }) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <FormLabel htmlFor="batch-id">Batch ID</FormLabel>
        <Input id="batch-id" placeholder="Auto-generated" disabled />
        <FormDescription>Batch ID will be automatically generated when created</FormDescription>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel htmlFor="grade-profile">Grade Profile</FormLabel>
          <Select defaultValue="premium-hardwood">
            <SelectTrigger id="grade-profile">
              <SelectValue placeholder="Select grade profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="premium-hardwood">Premium Hardwood</SelectItem>
              <SelectItem value="standard-pine">Standard Pine</SelectItem>
              <SelectItem value="economy-grade">Economy Grade</SelectItem>
              <SelectItem value="custom">Custom Profile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="operator">Operator</FormLabel>
          <Select defaultValue="john-smith">
            <SelectTrigger id="operator">
              <SelectValue placeholder="Select operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
              <SelectItem value="mike-davis">Mike Davis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="estimated-boards">Estimated Board Count</FormLabel>
        <Input id="estimated-boards" type="number" placeholder="Enter estimated number of boards" />
      </div>

      {scheduled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Scheduled Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <FormLabel>Scheduled Time</FormLabel>
            <Select defaultValue="09:00">
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">09:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="13:00">01:00 PM</SelectItem>
                <SelectItem value="14:00">02:00 PM</SelectItem>
                <SelectItem value="15:00">03:00 PM</SelectItem>
                <SelectItem value="16:00">04:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <FormLabel htmlFor="notes">Notes</FormLabel>
        <Textarea id="notes" placeholder="Add any additional notes or instructions" />
      </div>

      <DialogFooter>
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit">{scheduled ? "Schedule Batch" : "Create Batch"}</Button>
      </DialogFooter>
    </div>
  )
}
