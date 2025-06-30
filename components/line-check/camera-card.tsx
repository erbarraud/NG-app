"use client"

import type React from "react"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertTriangle, WifiOff, Video, VideoOff, CameraIcon, Zap, PowerOff } from "lucide-react"
import type { CameraType } from "./line-check-dashboard" // Assuming type is exported

interface CameraCardProps {
  camera: CameraType
  onTakeSnapshot: (cameraId: string) => void
}

const CameraCard: React.FC<CameraCardProps> = ({ camera, onTakeSnapshot }) => {
  let connectionIcon, streamIcon
  let connectionColorClass = "text-muted-foreground"
  let streamColorClass = "text-muted-foreground"

  switch (camera.connectionStatus) {
    case "connected":
      connectionIcon = <CheckCircle className="w-4 h-4" />
      connectionColorClass = "text-green-600"
      break
    case "disconnected":
      connectionIcon = <XCircle className="w-4 h-4" />
      connectionColorClass = "text-red-600"
      break
    case "warning":
      connectionIcon = <AlertTriangle className="w-4 h-4" />
      connectionColorClass = "text-yellow-600"
      break
    default:
      connectionIcon = <WifiOff className="w-4 h-4" />
  }

  switch (camera.streamStatus) {
    case "streaming":
      streamIcon = <Video className="w-4 h-4" />
      streamColorClass = "text-blue-600"
      break
    case "idle":
      streamIcon = <PowerOff className="w-4 h-4" /> // Using PowerOff for idle
      streamColorClass = "text-gray-500"
      break
    case "error":
      streamIcon = <VideoOff className="w-4 h-4" />
      streamColorClass = "text-orange-600"
      break
    case "no_signal":
      streamIcon = <VideoOff className="w-4 h-4" />
      streamColorClass = "text-red-500" // More prominent for no signal
      break
    default:
      streamIcon = <VideoOff className="w-4 h-4" />
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-3">
        <div className="relative w-full aspect-video rounded overflow-hidden mb-2">
          <Image
            src={camera.thumbnailUrl || "/placeholder.svg?width=160&height=120&query=camera_feed"}
            alt={`Preview for ${camera.name}`}
            layout="fill"
            objectFit="cover"
            className="bg-muted"
          />
          {camera.isTriggerActive && (
            <Badge className="absolute top-1 right-1 bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5">
              <Zap className="w-3 h-3 mr-1" /> Trigger
            </Badge>
          )}
        </div>
        <CardTitle className="text-sm font-medium leading-tight">{camera.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{camera.label}</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">
        <div className="space-y-1.5 text-xs">
          <div className={`flex items-center gap-1.5 ${connectionColorClass}`}>
            {connectionIcon}
            <span>Connection: {camera.connectionStatus}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${streamColorClass}`}>
            {streamIcon}
            <span>Stream: {camera.streamStatus}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          size="sm"
          variant="outline"
          className="w-full flex items-center gap-1.5 text-xs"
          onClick={() => onTakeSnapshot(camera.id)}
        >
          <CameraIcon className="w-3.5 h-3.5" />
          Take Shot
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CameraCard
