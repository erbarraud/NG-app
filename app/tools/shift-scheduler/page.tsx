"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Calendar,
  Clock,
  Copy,
  Plus,
  Trash,
  ChevronDown,
  ChevronUp,
  CalendarIcon as CalendarIconLucide,
  Trash2,
  Edit,
  Search,
  CalendarDays,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types
interface TimeInterval {
  id: string
  name: string
  start: string
  end: string
  enabled: boolean
}

interface DaySchedule {
  dayName: string
  intervals: TimeInterval[]
}

interface Holiday {
  id: string
  name: string
  date: string // YYYY-MM-DD format
  isCustom: boolean
}

type SortKey = "name" | "date"
type SortDirection = "asc" | "desc"

// Sample data
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const defaultHolidays: Holiday[] = [
  { id: "new-years", name: "New Year's Day", date: "2024-01-01", isCustom: false },
  { id: "mlk-day", name: "Martin Luther King Jr. Day", date: "2024-01-15", isCustom: false },
  { id: "presidents-day", name: "Presidents' Day", date: "2024-02-19", isCustom: false },
  { id: "memorial-day", name: "Memorial Day", date: "2024-05-27", isCustom: false },
  { id: "juneteenth", name: "Juneteenth", date: "2024-06-19", isCustom: false },
  { id: "independence-day", name: "Independence Day", date: "2024-07-04", isCustom: false },
  { id: "labor-day", name: "Labor Day", date: "2024-09-02", isCustom: false },
  { id: "columbus-day", name: "Columbus Day", date: "2024-10-14", isCustom: false },
  { id: "veterans-day", name: "Veterans Day", date: "2024-11-11", isCustom: false },
  { id: "thanksgiving", name: "Thanksgiving Day", date: "2024-11-28", isCustom: false },
  { id: "christmas", name: "Christmas Day", date: "2024-12-25", isCustom: false },
].sort((a, b) => a.date.localeCompare(b.date))

const defaultSchedule: DaySchedule[] = weekdays.map((day) => ({
  dayName: day,
  intervals: [],
}))

const ITEMS_PER_PAGE = 5

export default function ShiftSchedulerPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule)
  const [isOverrideDialogOpen, setIsOverrideDialogOpen] = useState(false)
  const [overrideDate, setOverrideDate] = useState("")
  const [overrideIntervals, setOverrideIntervals] = useState<TimeInterval[]>([])
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false)
  const [copySourceDay, setCopySourceDay] = useState<number | null>(null)
  const [copySourceInterval, setCopySourceInterval] = useState<number | null>(null)
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shift-scheduler-holidays")
      try {
        const parsed = saved ? JSON.parse(saved) : defaultHolidays
        return Array.isArray(parsed) ? parsed : defaultHolidays
      } catch (error) {
        console.error("Failed to parse holidays from localStorage", error)
        return defaultHolidays
      }
    }
    return defaultHolidays
  })

  const [isHolidayPanelOpen, setIsHolidayPanelOpen] = useState(false)
  const [isAddHolidayDialogOpen, setIsAddHolidayDialogOpen] = useState(false)
  const [isEditHolidayDialogOpen, setIsEditHolidayDialogOpen] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [newHolidayName, setNewHolidayName] = useState("")
  const [newHolidayDate, setNewHolidayDate] = useState("")

  const [holidaySearchTerm, setHolidaySearchTerm] = useState("")
  const [holidaySortConfig, setHolidaySortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "date",
    direction: "asc",
  })
  const [holidayCurrentPage, setHolidayCurrentPage] = useState(1)

  useEffect(() => {
    setHolidayCurrentPage(1)
  }, [holidaySearchTerm, holidaySortConfig])

  const saveHolidaysToStorage = (holidayList: Holiday[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shift-scheduler-holidays", JSON.stringify(holidayList))
    }
  }

  const processedHolidays = useMemo(() => {
    const filteredHolidays = holidays.filter((holiday) =>
      holiday.name.toLowerCase().includes(holidaySearchTerm.toLowerCase()),
    )
    filteredHolidays.sort((a, b) => {
      if (a[holidaySortConfig.key] < b[holidaySortConfig.key]) {
        return holidaySortConfig.direction === "asc" ? -1 : 1
      }
      if (a[holidaySortConfig.key] > b[holidaySortConfig.key]) {
        return holidaySortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
    return filteredHolidays
  }, [holidays, holidaySearchTerm, holidaySortConfig])

  const paginatedHolidays = useMemo(() => {
    const startIndex = (holidayCurrentPage - 1) * ITEMS_PER_PAGE
    return processedHolidays.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [processedHolidays, holidayCurrentPage])

  const totalHolidayPages = Math.max(1, Math.ceil(processedHolidays.length / ITEMS_PER_PAGE))

  const addHoliday = () => {
    if (!newHolidayName.trim() || !newHolidayDate) return
    const newHoliday: Holiday = {
      id: crypto.randomUUID(),
      name: newHolidayName.trim(),
      date: newHolidayDate,
      isCustom: true,
    }
    const updatedHolidays = [...holidays, newHoliday]
    setHolidays(updatedHolidays)
    saveHolidaysToStorage(updatedHolidays)
    setNewHolidayName("")
    setNewHolidayDate("")
    setIsAddHolidayDialogOpen(false)
    toast({ title: "Holiday added", description: `${newHoliday.name} has been added.` })
  }

  const editHoliday = () => {
    if (!editingHoliday || !newHolidayName.trim() || !newHolidayDate) return
    const updatedHolidays = holidays.map((h) =>
      h.id === editingHoliday.id ? { ...h, name: newHolidayName.trim(), date: newHolidayDate } : h,
    )
    setHolidays(updatedHolidays)
    saveHolidaysToStorage(updatedHolidays)
    setEditingHoliday(null)
    setNewHolidayName("")
    setNewHolidayDate("")
    setIsEditHolidayDialogOpen(false)
    toast({ title: "Holiday updated", description: `Holiday has been updated.` })
  }

  const deleteHoliday = (holidayId: string) => {
    const holidayToDelete = holidays.find((h) => h.id === holidayId)
    const updatedHolidays = holidays.filter((h) => h.id !== holidayId)
    setHolidays(updatedHolidays)
    saveHolidaysToStorage(updatedHolidays)
    toast({ title: "Holiday deleted", description: `${holidayToDelete?.name} has been removed.` })
    if (paginatedHolidays.length === 1 && holidayCurrentPage > 1 && totalHolidayPages > 1) {
      setHolidayCurrentPage(holidayCurrentPage - 1)
    } else if (paginatedHolidays.length === 1 && holidayCurrentPage === totalHolidayPages && totalHolidayPages === 1) {
      // If it was the last item on the only page, and now it's empty
      setHolidayCurrentPage(1) // or handle empty state appropriately
    }
  }

  const openEditDialog = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setNewHolidayName(holiday.name)
    setNewHolidayDate(holiday.date)
    setIsEditHolidayDialogOpen(true)
  }

  const isHoliday = (date: string) => holidays.some((holiday) => holiday.date === date)

  const addInterval = (dayIndex: number) => {
    const newSchedule = [...schedule]
    newSchedule[dayIndex].intervals.push({
      id: crypto.randomUUID(),
      name: `Shift ${newSchedule[dayIndex].intervals.length + 1}`,
      start: "09:00",
      end: "17:00",
      enabled: true,
    })
    setSchedule(newSchedule)
  }

  const updateInterval = (dayIndex: number, intervalIndex: number, field: keyof TimeInterval, value: any) => {
    const newSchedule = [...schedule]
    newSchedule[dayIndex].intervals[intervalIndex] = {
      ...newSchedule[dayIndex].intervals[intervalIndex],
      [field]: value,
    }
    setSchedule(newSchedule)
  }

  const removeInterval = (dayIndex: number, intervalIndex: number) => {
    const newSchedule = [...schedule]
    newSchedule[dayIndex].intervals.splice(intervalIndex, 1)
    setSchedule(newSchedule)
  }

  const openCopyDialog = (dayIndex: number, intervalIndex: number) => {
    setCopySourceDay(dayIndex)
    setCopySourceInterval(intervalIndex)
    setSelectedDays(weekdays.map((_, index) => index).filter((index) => index !== dayIndex))
    setIsCopyDialogOpen(true)
  }

  const copyToSelectedDays = () => {
    if (copySourceDay === null || copySourceInterval === null) return
    const sourceInterval = schedule[copySourceDay].intervals[copySourceInterval]
    const newSchedule = [...schedule]
    selectedDays.forEach((dayIndex) => {
      newSchedule[dayIndex].intervals.push({
        ...JSON.parse(JSON.stringify(sourceInterval)),
        id: crypto.randomUUID(),
      })
    })
    setSchedule(newSchedule)
    setIsCopyDialogOpen(false)
    toast({
      title: "Shift copied",
      description: `Shift copied to ${selectedDays.length} day${selectedDays.length !== 1 ? "s" : ""}.`,
    })
  }

  const toggleDaySelection = (dayIndex: number) => {
    setSelectedDays((prev) => (prev.includes(dayIndex) ? prev.filter((day) => day !== dayIndex) : [...prev, dayIndex]))
  }

  const selectAllDays = () => {
    if (copySourceDay === null) return
    setSelectedDays(weekdays.map((_, index) => index).filter((index) => index !== copySourceDay))
  }

  const deselectAllDays = () => setSelectedDays([])

  const addOverride = () => {
    console.log("Override added for", overrideDate, overrideIntervals)
    setIsOverrideDialogOpen(false)
    setOverrideDate("")
    setOverrideIntervals([])
    toast({
      title: "Schedule override created",
      description: `Override for ${new Date(overrideDate).toLocaleDateString()} has been saved.`,
    })
  }

  const addOverrideInterval = () => {
    setOverrideIntervals((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Shift ${prev.length + 1}`,
        start: "09:00",
        end: "17:00",
        enabled: true,
      },
    ])
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shift Scheduler</h1>
            <p className="text-muted-foreground">Manage and schedule operational shifts for production lines</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isOverrideDialogOpen} onOpenChange={setIsOverrideDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Override Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Schedule Override</DialogTitle>
                  <DialogDescription>Create a one-time override for a specific date.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="override-date">Date</Label>
                    <Input
                      id="override-date"
                      type="date"
                      value={overrideDate}
                      onChange={(e) => setOverrideDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Time Intervals</Label>
                      <Button variant="outline" size="sm" onClick={addOverrideInterval}>
                        <Plus className="h-4 w-4" /> Add Interval
                      </Button>
                    </div>
                    {overrideIntervals.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No intervals added.</div>
                    ) : (
                      overrideIntervals.map((interval, index) => (
                        <div key={interval.id} className="space-y-2">
                          <Input
                            type="text"
                            placeholder="Shift name"
                            value={interval.name || ""}
                            onChange={(e) => {
                              const newIntervals = [...overrideIntervals]
                              newIntervals[index].name = e.target.value
                              setOverrideIntervals(newIntervals)
                            }}
                            className="flex-1"
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={interval.start}
                              onChange={(e) => {
                                const ni = [...overrideIntervals]
                                ni[index].start = e.target.value
                                setOverrideIntervals(ni)
                              }}
                              className="w-24"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={interval.end}
                              onChange={(e) => {
                                const ni = [...overrideIntervals]
                                ni[index].end = e.target.value
                                setOverrideIntervals(ni)
                              }}
                              className="w-24"
                            />
                            <Switch
                              checked={interval.enabled}
                              onCheckedChange={(c) => {
                                const ni = [...overrideIntervals]
                                ni[index].enabled = c
                                setOverrideIntervals(ni)
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const ni = [...overrideIntervals]
                                ni.splice(index, 1)
                                setOverrideIntervals(ni)
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOverrideDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addOverride}>Save Override</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-6">
          <Collapsible open={isHolidayPanelOpen} onOpenChange={setIsHolidayPanelOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIconLucide className="h-5 w-5" />
                      Holiday Management
                    </CardTitle>
                    <CardDescription>
                      Manage holidays that affect shift scheduling ({processedHolidays.length} holidays found)
                    </CardDescription>
                  </div>
                  {isHolidayPanelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                  <div className="relative w-full sm:w-auto sm:flex-grow max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search holidays..."
                      value={holidaySearchTerm}
                      onChange={(e) => setHolidaySearchTerm(e.target.value)}
                      className="pl-8 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={holidaySortConfig.key + "_" + holidaySortConfig.direction}
                      onValueChange={(value) => {
                        const [key, direction] = value.split("_") as [SortKey, SortDirection]
                        setHolidaySortConfig({ key, direction })
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date_asc">Date (Oldest first)</SelectItem>
                        <SelectItem value="date_desc">Date (Newest first)</SelectItem>
                        <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog open={isAddHolidayDialogOpen} onOpenChange={setIsAddHolidayDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Add Holiday
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Custom Holiday</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Input
                            id="holiday-name"
                            placeholder="Holiday Name"
                            value={newHolidayName}
                            onChange={(e) => setNewHolidayName(e.target.value)}
                          />
                          <Input
                            id="holiday-date"
                            type="date"
                            value={newHolidayDate}
                            onChange={(e) => setNewHolidayDate(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddHolidayDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addHoliday} disabled={!newHolidayName.trim() || !newHolidayDate}>
                            Add
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Holiday List - Removed max-h and overflow-y-auto */}
                <div className="space-y-2">
                  {paginatedHolidays.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground min-h-[100px] flex flex-col justify-center items-center">
                      <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>{holidaySearchTerm ? "No holidays match your search." : "No holidays configured."}</p>
                    </div>
                  ) : (
                    paginatedHolidays.map((holiday) => (
                      <div
                        key={holiday.id}
                        className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <CalendarDays className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" title={holiday.name}>
                              {holiday.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(holiday.date + "T00:00:00").toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                weekday: "short",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          {holiday.isCustom && (
                            <Badge variant="secondary" className="text-xs h-6">
                              Custom
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(holiday)}
                            title="Edit holiday"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHoliday(holiday.id)}
                            title="Delete holiday"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {totalHolidayPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHolidayCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={holidayCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {holidayCurrentPage} of {totalHolidayPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHolidayCurrentPage((prev) => Math.min(totalHolidayPages, prev + 1))}
                      disabled={holidayCurrentPage === totalHolidayPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Dialog open={isEditHolidayDialogOpen} onOpenChange={setIsEditHolidayDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Holiday</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Holiday Name"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
              />
              <Input type="date" value={newHolidayDate} onChange={(e) => setNewHolidayDate(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditHolidayDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editHoliday} disabled={!newHolidayName.trim() || !newHolidayDate}>
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>
                  Configure shifts for each day of the week. Shifts on holidays will be highlighted.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monday" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                {weekdays.map((day) => (
                  <TabsTrigger key={day} value={day.toLowerCase()}>
                    {day.substring(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {weekdays.map((day, dayIndex) => (
                <TabsContent key={day} value={day.toLowerCase()} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{day}</h3>
                    <Button variant="outline" size="sm" onClick={() => addInterval(dayIndex)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Shift
                    </Button>
                  </div>
                  {schedule[dayIndex].intervals.length === 0 ? (
                    <div className="rounded-md border border-dashed p-8 text-center">
                      <h3 className="font-medium">No shifts scheduled</h3>
                      <p className="text-sm text-muted-foreground mt-1">Add a shift for this day.</p>
                      <Button variant="outline" className="mt-4" onClick={() => addInterval(dayIndex)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Shift
                      </Button>
                    </div>
                  ) : (
                    schedule[dayIndex].intervals.map((interval, intervalIndex) => {
                      const todayStr = new Date().toISOString().split("T")[0]
                      const isShiftOnHoliday = isHoliday(todayStr)

                      return (
                        <div
                          key={interval.id}
                          className={`flex items-center gap-2 rounded-md border p-3 ${
                            interval.enabled
                              ? isShiftOnHoliday
                                ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-700"
                                : "border-green-200 bg-green-50 dark:bg-green-900/30 dark:border-green-700"
                              : "border-gray-200 bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex-1 grid grid-cols-1 gap-4">
                            <Input
                              type="text"
                              placeholder="Shift name"
                              value={interval.name || ""}
                              onChange={(e) => updateInterval(dayIndex, intervalIndex, "name", e.target.value)}
                              className="w-full sm:w-auto flex-1"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  value={interval.start}
                                  onChange={(e) => updateInterval(dayIndex, intervalIndex, "start", e.target.value)}
                                  className="w-24"
                                />
                                <span>to</span>
                                <Input
                                  type="time"
                                  value={interval.end}
                                  onChange={(e) => updateInterval(dayIndex, intervalIndex, "end", e.target.value)}
                                  className="w-24"
                                />
                              </div>
                              <div className="flex items-center gap-2 justify-end sm:justify-start">
                                <Switch
                                  id={`shift-${interval.id}`}
                                  checked={interval.enabled}
                                  onCheckedChange={(c) => updateInterval(dayIndex, intervalIndex, "enabled", c)}
                                />
                                <Label htmlFor={`shift-${interval.id}`}>
                                  {interval.enabled ? "Active" : "Inactive"}
                                </Label>
                                <div className="ml-auto flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openCopyDialog(dayIndex, intervalIndex)}
                                    title="Copy"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeInterval(dayIndex, intervalIndex)}
                                    title="Delete"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Copy Shift to Other Days</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex justify-between mb-2">
                <Button variant="outline" size="sm" onClick={selectAllDays}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllDays}>
                  Deselect All
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {weekdays.map((day, index) => {
                  if (index === copySourceDay) return null
                  return (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`copy-${day}`}
                        checked={selectedDays.includes(index)}
                        onCheckedChange={() => toggleDaySelection(index)}
                      />
                      <Label htmlFor={`copy-${day}`}>{day}</Label>
                    </div>
                  )
                })}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={copyToSelectedDays} disabled={selectedDays.length === 0}>
                Copy to {selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
