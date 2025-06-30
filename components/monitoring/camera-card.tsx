"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CameraIcon, Video, Wifi, XCircle, CheckCircle, AlertTriangle, ImageIcon, Zap } from "lucide-react"
import type { Camera } from "./monitoring-dashboard" // Assuming type is exported

interface CameraCardProps {
  camera: Camera
  onTakeSnapshot: (cameraId: string) => void
}

export default function CameraCard({ camera, onTakeSnapshot }: CameraCardProps) {
  const getStatusColor = (status: Camera["connectionStatus"] | Camera["streamStatus"]) => {
    switch (status) {
      case "connected":
      case "streaming":
        return "text-green-400"
      case "warning":
      case "idle": // Assuming idle is a neutral/warning state for streams
        return "text-yellow-400"
      case "disconnected":
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const ConnectionStatusIcon = () => {
    switch (camera.connectionStatus) {
      case "connected":
        return <CheckCircle className={`w-4 h-4 ${getStatusColor(camera.connectionStatus)}`} />
      case "warning":
        return <AlertTriangle className={`w-4 h-4 ${getStatusColor(camera.connectionStatus)}`} />
      case "disconnected":
        return <XCircle className={`w-4 h-4 ${getStatusColor(camera.connectionStatus)}`} />
      default:
        return <AlertTriangle className={`w-4 h-4 ${getStatusColor(camera.connectionStatus)}`} />
    }
  }

  const StreamStatusIcon = () => {
    switch (camera.streamStatus) {
      case "streaming":
        return <Wifi className={`w-4 h-4 ${getStatusColor(camera.streamStatus)}`} />
      case "idle":
        return <Video className={`w-4 h-4 ${getStatusColor(camera.streamStatus)}`} /> // Or WifiOff
      case "error":
        return <XCircle className={`w-4 h-4 ${getStatusColor(camera.streamStatus)}`} />
      default:
        return <AlertTriangle className={`w-4 h-4 ${getStatusColor(camera.streamStatus)}`} />
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-white flex flex-col h-full">
      <CardHeader className="p-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center">
            <CameraIcon className="w-4 h-4 mr-2 text-blue-400" />
            {camera.label}
          </CardTitle>
          {camera.isTriggerActive && <Zap className="w-4 h-4 text-green-400" title="Trigger Active" />}
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <div className="aspect-video bg-black rounded overflow-hidden mb-2 relative">
          <Image
            src={camera.thumbnailUrl || "/placeholder.svg"}
            alt={`Preview for ${camera.name}`}
            layout="fill"
            objectFit="cover"
          />
          {/* Placeholder for live feed indicator or diagnostics overlay */}
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <ConnectionStatusIcon /> <span className="ml-1 capitalize">{camera.connectionStatus}</span>
            </span>
            <span className="flex items-center">
              <StreamStatusIcon /> <span className="ml-1 capitalize">{camera.streamStatus}</span>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t border-gray-700">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-gray-700 hover:bg-gray-600 border-gray-600 text-xs"
          onClick={() => onTakeSnapshot(camera.id)}
        >
          <ImageIcon className="w-3 h-3 mr-1" />
          Take Shot
        </Button>
      </CardFooter>
    </Card>
  )
}
