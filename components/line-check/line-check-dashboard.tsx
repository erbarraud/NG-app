"use client"

import { useEffect, useState, useCallback } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Clock,
  RefreshCw,
  PowerIcon,
  Wind,
  XCircle,
  ChevronDown,
  ImageIcon,
  Zap,
  Layers,
  Leaf,
  BarChart3,
} from "lucide-react"
import CameraCard from "./camera-card" // Ensure this path is correct
import { ShiftStatusDisplay } from "@/components/shift-status-display"

// Define types for camera and row data
export interface CameraType {
  id: string
  name: string
  label: string // e.g., 1.2 [09SC8]
  rowId: string
  zone: "Entry" | "Scanner" | "Sorter" | "Printer" | "Exit" | "Other"
  connectionStatus: "connected" | "disconnected" | "warning"
  streamStatus: "streaming" | "idle" | "error" | "no_signal"
  thumbnailUrl: string
  isTriggerActive: boolean
  lastSnapshot?: string
}

export interface CameraRow {
  id: string
  name: string // e.g., Row 1
  cameras: CameraType[]
  triggerInfo: string // e.g., “Triggered by: Row 1 & 2”
  isGloballyTriggerActive: boolean
  overallStatus: "operational" | "warning" | "error"
  streamingUptime?: number // Optional: 0-100
}

// Sample Data (Replace with actual data fetching)
const initialCameraRows: CameraRow[] = [
  {
    id: "lc-row-1",
    name: "Line Check Row 1",
    cameras: [
      {
        id: "lc-cam-1-1",
        name: "LC Entry Top",
        label: "LC1.1 [ENT-T]",
        rowId: "lc-row-1",
        zone: "Entry",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/ornate-entryway.png",
        isTriggerActive: true,
      },
      {
        id: "lc-cam-1-2a",
        name: "LC Scanner Top",
        label: "LC1.2a [SCN-T]",
        rowId: "lc-row-1",
        zone: "Scanner",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/camera-placeholder-boards.png",
        isTriggerActive: false,
      },
      {
        id: "lc-cam-1-2b",
        name: "LC Scanner Side A",
        label: "LC1.2b [SCN-SA]",
        rowId: "lc-row-1",
        zone: "Scanner",
        connectionStatus: "connected",
        streamStatus: "idle",
        thumbnailUrl: "/camera-placeholder-boards.png",
        isTriggerActive: true,
      },
      {
        id: "lc-cam-1-2c",
        name: "LC Scanner Side B",
        label: "LC1.2c [SCN-SB]",
        rowId: "lc-row-1",
        zone: "Scanner",
        connectionStatus: "warning",
        streamStatus: "no_signal",
        thumbnailUrl: "/camera-placeholder-boards.png",
        isTriggerActive: false,
      },
      {
        id: "lc-cam-1-3",
        name: "LC Sorter Exit",
        label: "LC1.3 [SRT-EX]",
        rowId: "lc-row-1",
        zone: "Sorter",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/sorting-machine-exit.png",
        isTriggerActive: true,
      },
    ],
    triggerInfo: "Entry Sensor, Sorter Gate",
    isGloballyTriggerActive: true,
    overallStatus: "warning",
    streamingUptime: 97,
  },
  {
    id: "lc-row-2",
    name: "Line Check Row 2",
    cameras: [
      {
        id: "lc-cam-2-1",
        name: "LC Printer Input",
        label: "LC2.1 [PRN-IN]",
        rowId: "lc-row-2",
        zone: "Printer",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/lc_printer_input.png",
        isTriggerActive: false,
      },
      {
        id: "lc-cam-2-2",
        name: "LC Printer Output",
        label: "LC2.2 [PRN-OUT]",
        rowId: "lc-row-2",
        zone: "Printer",
        connectionStatus: "connected",
        streamStatus: "idle",
        thumbnailUrl: "/camera-placeholder-boards.png",
        isTriggerActive: true,
      },
      {
        id: "lc-cam-2-3",
        name: "LC Exit Conveyor",
        label: "LC2.3 [EXT-CV]",
        rowId: "lc-row-2",
        zone: "Exit",
        connectionStatus: "warning",
        streamStatus: "streaming",
        thumbnailUrl: "/camera-placeholder-boards.png",
        isTriggerActive: false,
      },
    ],
    triggerInfo: "Printer Sensor",
    isGloballyTriggerActive: false,
    overallStatus: "operational",
    streamingUptime: 99,
  },
]

const ZONES_ORDER: CameraType["zone"][] = ["Entry", "Scanner", "Sorter", "Printer", "Exit", "Other"]

// Current batch data (kept from original for context, can be removed if not needed)
const currentBatchData = {
  batchId: "B-4873",
  species: "Douglas Fir",
  startTime: "08:30 AM",
  processedVolume: "28.3 m³",
  totalVolume: "45.6 m³",
}

export function LineCheckDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const [cameraRows, setCameraRows] = useState<CameraRow[]>(initialCameraRows)

  // System Toggles State
  const [scannerOn, setScannerOn] = useState(true)
  const [airOn, setAirOn] = useState(true)
  const [lightsOn, setLightsOn] = useState(true)

  // Accordion State - default open for active/warning rows
  const [activeAccordionItems, setActiveAccordionItems] = useState<string[]>(
    cameraRows
      .filter((row) => row.isGloballyTriggerActive || row.overallStatus === "warning" || row.overallStatus === "error")
      .map((row) => row.id),
  )

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      const updatedRows = cameraRows.map((row) => ({
        ...row,
        cameras: row.cameras.map((cam) => ({
          ...cam,
          connectionStatus:
            Math.random() > 0.8
              ? "warning"
              : ((Math.random() > 0.9 ? "disconnected" : "connected") as CameraType["connectionStatus"]),
          streamStatus:
            Math.random() > 0.7
              ? "idle"
              : ((Math.random() > 0.85 ? "error" : "streaming") as CameraType["streamStatus"]),
          isTriggerActive: Math.random() > 0.6,
          thumbnailUrl: `/placeholder.svg?width=160&height=120&query=${cam.label.toLowerCase().replace(/\[|\]|\s/g, "_")}&rand=${Math.random()}`,
        })),
        overallStatus: Math.random() > 0.7 ? "warning" : ("operational" as CameraRow["overallStatus"]),
        isGloballyTriggerActive: Math.random() > 0.5,
      }))
      setCameraRows(updatedRows)
      setActiveAccordionItems(
        updatedRows
          .filter((r) => r.isGloballyTriggerActive || r.overallStatus === "warning" || r.overallStatus === "error")
          .map((r) => r.id),
      )
      setRefreshing(false)
    }, 1500)
  }, [cameraRows]) // Added cameraRows dependency

  useEffect(() => {
    const refreshInterval = setInterval(handleRefresh, 45000)
    return () => clearInterval(refreshInterval)
  }, [handleRefresh])

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const handleTakeSnapshot = (cameraId: string) => {
    console.log(`Line Check: Taking snapshot for camera: ${cameraId}`)
  }

  const handleTakeSnapshotAllForRow = (rowId: string) => {
    console.log(`Line Check: Taking snapshot for all cameras in row: ${rowId}`)
    const row = cameraRows.find((r) => r.id === rowId)
    row?.cameras.forEach((cam) => handleTakeSnapshot(cam.id))
  }

  const allCamerasConnected = cameraRows.every((row) =>
    row.cameras.every((cam) => cam.connectionStatus === "connected"),
  )
  const allStreamsHealthy = cameraRows.every((row) => row.cameras.every((cam) => cam.streamStatus === "streaming"))
  const activeTriggerRows = cameraRows
    .filter((row) => row.isGloballyTriggerActive)
    .map((row) => row.name.split(" ").pop()) // Gets the number part of "Row X"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Line Check Camera Monitoring</h2>
          <p className="text-muted-foreground">Real-time camera status and controls for line check stations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${refreshing ? "animate-pulse bg-green-500" : "bg-green-500"}`}></div>
          <span className="text-sm text-muted-foreground">Live</span>
          <div className="text-sm text-muted-foreground ml-4">{formattedTime}</div>
        </div>
      </div>

      {/* Header Toolbar */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
              <div className="flex items-center gap-2" title="Scanner Run Status">
                <PowerIcon className={`w-5 h-5 ${scannerOn ? "text-green-500" : "text-red-500"}`} />
                <Switch id="scanner-toggle-lc" checked={scannerOn} onCheckedChange={setScannerOn} />
                <label htmlFor="scanner-toggle-lc" className="text-sm">
                  Scanner
                </label>
              </div>
              <div className="flex items-center gap-2" title="Air System Status">
                <Wind className={`w-5 h-5 ${airOn ? "text-blue-500" : "text-gray-500"}`} />
                <Switch id="air-toggle-lc" checked={airOn} onCheckedChange={setAirOn} />
                <label htmlFor="air-toggle-lc" className="text-sm">
                  Air
                </label>
              </div>
              <div className="flex items-center gap-2" title="Lighting System Status">
                <Lightbulb className={`w-5 h-5 ${lightsOn ? "text-yellow-500" : "text-gray-500"}`} />
                <Switch id="lights-toggle-lc" checked={lightsOn} onCheckedChange={setLightsOn} />
                <label htmlFor="lights-toggle-lc" className="text-sm">
                  Lights
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={allCamerasConnected ? "outline" : "destructive"}
                className={
                  allCamerasConnected
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-red-300 bg-red-50 text-red-700"
                }
              >
                {allCamerasConnected ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-1" />
                )}
                Cameras: {allCamerasConnected ? "All Connected" : "Check Status"}
              </Badge>
              <Badge
                variant={allStreamsHealthy ? "outline" : "destructive"}
                className={
                  allStreamsHealthy
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-yellow-300 bg-yellow-50 text-yellow-700"
                }
              >
                {allStreamsHealthy ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-1" />
                )}
                Streams: {allStreamsHealthy ? "All Healthy" : "Check Streams"}
              </Badge>
              {activeTriggerRows.length > 0 && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  <Zap className="w-4 h-4 mr-1" />
                  Trigger: Row(s) {activeTriggerRows.join(", ")}
                </Badge>
              )}
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh Data">
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Batch Information & Shift Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center">
                <Layers className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium text-sm">Batch:</span>
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                  {currentBatchData.batchId}
                </Badge>
              </div>
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">{currentBatchData.species}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">{currentBatchData.startTime}</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">
                  {currentBatchData.processedVolume} / {currentBatchData.totalVolume}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <ShiftStatusDisplay variant="compact" showHeader={false} />
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Camera Rows Accordion */}
      <Accordion
        type="multiple"
        value={activeAccordionItems}
        onValueChange={setActiveAccordionItems}
        className="w-full space-y-4"
      >
        {cameraRows.map((row) => {
          const camerasByZone: { [key in CameraType["zone"]]?: CameraType[] } = {}
          row.cameras.forEach((cam) => {
            if (!camerasByZone[cam.zone]) camerasByZone[cam.zone] = []
            camerasByZone[cam.zone]!.push(cam)
          })

          let rowStatusIcon = <CheckCircle className="w-5 h-5 text-green-600" />
          if (row.overallStatus === "warning") rowStatusIcon = <AlertTriangle className="w-5 h-5 text-yellow-600" />
          if (row.overallStatus === "error") rowStatusIcon = <XCircle className="w-5 h-5 text-red-600" />

          return (
            <AccordionItem
              key={row.id}
              value={row.id}
              className="bg-card rounded-lg border data-[state=open]:border-primary"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-3 text-lg font-medium">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    {rowStatusIcon}
                    <span>
                      {row.name} [{row.cameras.length} Cameras]
                    </span>
                    {row.isGloballyTriggerActive && (
                      <Badge className="bg-green-100 text-green-700 text-xs border-green-300">
                        <Zap className="w-3 h-3 mr-1" />
                        Trigger Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {typeof row.streamingUptime === "number" && (
                      <Badge variant="outline" className="text-xs">
                        {row.streamingUptime}% Uptime
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="secondary" // Changed to secondary for better theme adaptability
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTakeSnapshotAllForRow(row.id)
                      }}
                    >
                      <ImageIcon className="w-4 h-4 mr-1" /> Snapshot Row
                    </Button>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 text-muted-foreground" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">Trigger Info: {row.triggerInfo}</p>
                {ZONES_ORDER.map((zoneName) => {
                  const camerasInZone = camerasByZone[zoneName]
                  if (!camerasInZone || camerasInZone.length === 0) return null
                  return (
                    <div key={zoneName} className="mb-6">
                      <h4 className="text-md font-semibold mt-2 mb-3 border-b pb-1 text-foreground">
                        {zoneName} ({camerasInZone.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {camerasInZone.map((camera) => (
                          <CameraCard key={camera.id} camera={camera} onTakeSnapshot={handleTakeSnapshot} />
                        ))}
                      </div>
                    </div>
                  )
                })}
                {row.cameras.length === 0 && (
                  <p className="text-muted-foreground">No cameras configured for this row.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4 mt-4">
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <div
              className={`h-2 w-2 rounded-full ${allCamerasConnected && allStreamsHealthy ? "bg-green-500" : "bg-yellow-500"} mr-2`}
            ></div>
            <span>System {allCamerasConnected && allStreamsHealthy ? "Operational" : "Needs Attention"}</span>
          </div>
          <div className="flex items-center">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            <span>Auto-refreshing</span>
          </div>
        </div>
        <div>Neural Grader Line Check v2.5.3</div>
      </div>
    </div>
  )
}
