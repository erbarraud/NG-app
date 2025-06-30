"use client"

import { useEffect, useState, useCallback } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Clock,
  RefreshCw,
  Eye,
  PowerIcon,
  Wind,
  XCircle,
  ChevronDown,
  ImageIcon,
  Zap,
} from "lucide-react"
import CameraCard from "./camera-card" // New component

// Define types for camera and row data
export interface CameraType {
  id: string
  name: string
  label: string
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
  name: string
  cameras: CameraType[]
  triggerInfo: string
  isGloballyTriggerActive: boolean
  overallStatus: "operational" | "warning" | "error"
  streamingUptime?: number // Optional: 0-100
}

// Sample Data (Replace with actual data fetching)
const initialCameraRows: CameraRow[] = [
  {
    id: "row-1",
    name: "Production Line 1",
    cameras: [
      {
        id: "cam-1-1",
        name: "Entry Camera Alpha",
        label: "1.1 [ENT-A]",
        rowId: "row-1",
        zone: "Entry",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/entry-camera-alpha.png",
        isTriggerActive: true,
        lastSnapshot: "2025-06-04T16:10:00Z",
      },
      {
        id: "cam-1-2",
        name: "Scanner Top Rig",
        label: "1.2 [SCN-T]",
        rowId: "row-1",
        zone: "Scanner",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/scanner-top-rig.png",
        isTriggerActive: false,
      },
      {
        id: "cam-1-3",
        name: "Scanner Bottom Rig",
        label: "1.3 [SCN-B]",
        rowId: "row-1",
        zone: "Scanner",
        connectionStatus: "warning",
        streamStatus: "idle",
        thumbnailUrl: "/scanner-bottom-rig.png",
        isTriggerActive: false,
      },
      {
        id: "cam-1-4",
        name: "Sorter Input View",
        label: "1.4 [SRT-IN]",
        rowId: "row-1",
        zone: "Sorter",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/sorter-input-view.png",
        isTriggerActive: true,
      },
      {
        id: "cam-1-5",
        name: "Printer Quality Check",
        label: "1.5 [PRN-QC]",
        rowId: "row-1",
        zone: "Printer",
        connectionStatus: "disconnected",
        streamStatus: "error",
        thumbnailUrl: "/placeholder-bmcrs.png",
        isTriggerActive: false,
      },
      {
        id: "cam-1-6",
        name: "Exit Camera Alpha",
        label: "1.6 [EXT-A]",
        rowId: "row-1",
        zone: "Exit",
        connectionStatus: "connected",
        streamStatus: "no_signal",
        thumbnailUrl: "/placeholder.svg?width=200&height=150",
        isTriggerActive: false,
      },
    ],
    triggerInfo: "Entry Sensor, Sorter Gate",
    isGloballyTriggerActive: true,
    overallStatus: "warning",
    streamingUptime: 98,
  },
  {
    id: "row-2",
    name: "Production Line 2",
    cameras: [
      {
        id: "cam-2-1",
        name: "Entry Camera Beta",
        label: "2.1 [ENT-B]",
        rowId: "row-2",
        zone: "Entry",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/placeholder.svg?width=200&height=150",
        isTriggerActive: false,
      },
      {
        id: "cam-2-2",
        name: "Scanner Main",
        label: "2.2 [SCN-M]",
        rowId: "row-2",
        zone: "Scanner",
        connectionStatus: "connected",
        streamStatus: "idle",
        thumbnailUrl: "/placeholder.svg?width=200&height=150",
        isTriggerActive: true,
      },
    ],
    triggerInfo: "Scanner Beam",
    isGloballyTriggerActive: false,
    overallStatus: "operational",
    streamingUptime: 100,
  },
]

const ZONES_ORDER: CameraType["zone"][] = ["Entry", "Scanner", "Sorter", "Printer", "Exit", "Other"]

export default function MonitoringDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const [currentVolumePerHour, setCurrentVolumePerHour] = useState(4.2)
  const [cameraRows, setCameraRows] = useState<CameraRow[]>(initialCameraRows)

  // System Toggles State
  const [scannerOn, setScannerOn] = useState(true)
  const [airOn, setAirOn] = useState(true)
  const [lightsOn, setLightsOn] = useState(true)

  // Accordion State
  const [activeAccordionItems, setActiveAccordionItems] = useState<string[]>(
    cameraRows
      .filter((row) => row.isGloballyTriggerActive || row.overallStatus === "warning" || row.overallStatus === "error")
      .map((row) => row.id),
  )

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    // Simulate data fetch/update
    setTimeout(() => {
      // This is where you'd fetch new camera data
      // For demo, we can shuffle some statuses
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
        })),
      }))
      setCameraRows(updatedRows)
      setRefreshing(false)
    }, 1500)
  }, [cameraRows])

  useEffect(() => {
    // Periodically refresh data
    const refreshInterval = setInterval(handleRefresh, 30000) // Refresh every 30 seconds
    return () => clearInterval(refreshInterval)
  }, [handleRefresh])

  // Simulate data refresh every 10 seconds
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      setRefreshing(true)

      // Simulate data update
      setTimeout(() => {
        setCurrentVolumePerHour((prev) => {
          const change = (Math.random() - 0.5) * 0.4
          return Math.max(3.0, Math.min(5.0, prev + change))
        })
        setRefreshing(false)
      }, 1000)
    }, 10000)

    return () => clearInterval(refreshTimer)
  }, [])

  // Format the current time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleTakeSnapshot = (cameraId: string) => {
    console.log(`Taking snapshot for camera: ${cameraId}`)
    // Add actual snapshot logic here
  }

  const handleTakeSnapshotAllForRow = (rowId: string) => {
    console.log(`Taking snapshot for all cameras in row: ${rowId}`)
    const row = cameraRows.find((r) => r.id === rowId)
    row?.cameras.forEach((cam) => handleTakeSnapshot(cam.id))
  }

  // Calculate global statuses for header pills
  const allCamerasConnected = cameraRows.every((row) =>
    row.cameras.every((cam) => cam.connectionStatus === "connected"),
  )
  const allStreamsHealthy = cameraRows.every((row) => row.cameras.every((cam) => cam.streamStatus === "streaming"))
  const activeTriggerRows = cameraRows
    .filter((row) => row.isGloballyTriggerActive)
    .map((row) => row.name.split(" ").pop())

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4 overflow-hidden">
      {/* Header with current batch info and time */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
        <div className="flex items-center">
          <Eye className="h-8 w-8 mr-3 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold">Camera Monitoring</h1>
            <div className="text-gray-400">Real-time camera status and controls</div>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="h-6 w-6 mr-2 text-blue-400" />
          <div className="text-right">
            <div className="text-2xl font-bold">{formattedTime}</div>
            <div className="text-gray-400">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Header Toolbar: Toggles, Status Pills, Refresh */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 p-3 bg-gray-900 rounded-lg border border-gray-800">
        <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
          <div className="flex items-center gap-2" title="Scanner Run Status">
            <PowerIcon className={`w-5 h-5 ${scannerOn ? "text-green-500" : "text-red-500"}`} />
            <Switch id="scanner-toggle" checked={scannerOn} onCheckedChange={setScannerOn} />
            <label htmlFor="scanner-toggle" className="text-sm">
              Scanner
            </label>
          </div>
          <div className="flex items-center gap-2" title="Air System Status">
            <Wind className={`w-5 h-5 ${airOn ? "text-blue-500" : "text-gray-500"}`} />
            <Switch id="air-toggle" checked={airOn} onCheckedChange={setAirOn} />
            <label htmlFor="air-toggle" className="text-sm">
              Air
            </label>
          </div>
          <div className="flex items-center gap-2" title="Lighting System Status">
            <Lightbulb className={`w-5 h-5 ${lightsOn ? "text-yellow-400" : "text-gray-500"}`} />
            <Switch id="lights-toggle" checked={lightsOn} onCheckedChange={setLightsOn} />
            <label htmlFor="lights-toggle" className="text-sm">
              Lights
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={allCamerasConnected ? "default" : "destructive"}
            className={allCamerasConnected ? "bg-green-700 text-white" : "bg-red-700 text-white"}
          >
            {allCamerasConnected ? (
              <CheckCircle className="w-4 h-4 mr-1" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-1" />
            )}
            Cameras: {allCamerasConnected ? "All Connected" : "Check Status"}
          </Badge>
          <Badge
            variant={allStreamsHealthy ? "default" : "destructive"}
            className={allStreamsHealthy ? "bg-green-700 text-white" : "bg-yellow-600 text-white"}
          >
            {allStreamsHealthy ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertTriangle className="w-4 h-4 mr-1" />}
            Streams: {allStreamsHealthy ? "All Healthy" : "Check Streams"}
          </Badge>
          {activeTriggerRows.length > 0 && (
            <Badge className="bg-blue-600 text-white">
              <Zap className="w-4 h-4 mr-1" />
              Trigger Active: Row(s) {activeTriggerRows.join(", ")}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className="bg-gray-800 hover:bg-gray-700 border-gray-700"
          title="Refresh Data"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Main content grid */}
      {/* Main Content: Camera Rows Accordion */}
      <div className="flex-1 overflow-y-auto pr-2">
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

            const rowCameraCount = row.cameras.length
            const rowConnectedCount = row.cameras.filter((c) => c.connectionStatus === "connected").length
            const rowStreamingCount = row.cameras.filter((c) => c.streamStatus === "streaming").length

            let rowStatusIcon = <CheckCircle className="w-5 h-5 text-green-400" />
            if (row.overallStatus === "warning") rowStatusIcon = <AlertTriangle className="w-5 h-5 text-yellow-400" />
            if (row.overallStatus === "error" || rowConnectedCount < rowCameraCount)
              rowStatusIcon = <XCircle className="w-5 h-5 text-red-400" />

            return (
              <AccordionItem
                key={row.id}
                value={row.id}
                className="bg-gray-900 rounded-lg border border-gray-800 data-[state=open]:border-blue-500"
              >
                <AccordionTrigger className="hover:no-underline px-4 py-3 text-lg font-semibold">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {rowStatusIcon}
                      <span>
                        {row.name} [{rowCameraCount} Cameras]
                      </span>
                      {row.isGloballyTriggerActive && (
                        <Badge className="bg-green-600 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Trigger Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {typeof row.streamingUptime === "number" && (
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {row.streamingUptime}% Uptime
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTakeSnapshotAllForRow(row.id)
                        }}
                      >
                        <ImageIcon className="w-4 h-4 mr-1" /> Snapshot Row
                      </Button>
                      <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 text-gray-400" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-3">Trigger Info: {row.triggerInfo}</p>
                  {ZONES_ORDER.map((zoneName) => {
                    const camerasInZone = camerasByZone[zoneName]
                    if (!camerasInZone || camerasInZone.length === 0) return null
                    return (
                      <div key={zoneName} className="mb-6">
                        <h4 className="text-md font-semibold mt-2 mb-3 border-b border-gray-700 pb-1 text-blue-300">
                          {zoneName} ({camerasInZone.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {camerasInZone.map((camera) => (
                            <CameraCard key={camera.id} camera={camera} onTakeSnapshot={handleTakeSnapshot} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  {row.cameras.length === 0 && <p className="text-gray-500">No cameras configured for this row.</p>}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>

      {/* Footer with system status */}
      <div className="mt-6 border-t border-gray-800 pt-4 flex justify-between items-center text-sm">
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <div
              className={`h-3 w-3 rounded-full mr-2 ${allCamerasConnected && allStreamsHealthy ? "bg-green-500" : "bg-yellow-500"}`}
            ></div>
            <span className="text-gray-400">
              System {allCamerasConnected && allStreamsHealthy ? "Operational" : "Needs Attention"}
            </span>
          </div>
          <div className="flex items-center">
            <RefreshCw className={`h-4 w-4 mr-2 text-blue-400 ${refreshing ? "animate-spin" : ""}`} />
            <span className="text-gray-400">Last updated: {refreshing ? "Refreshing..." : "Just now"}</span>
          </div>
        </div>
        <div className="text-gray-400">Neural Grader v2.5.3</div>
      </div>
    </div>
  )
}
