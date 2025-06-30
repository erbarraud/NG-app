"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera, Upload, Search, AlertCircle, CheckCircle2, Loader2, Smartphone, QrCode } from "lucide-react"
import { BoardDetailView } from "@/components/board-detail-view"
import { sampleBoards } from "@/data/sample-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the states for the board identification process
enum IdentificationState {
  INITIAL = "initial",
  CAMERA_ACTIVE = "camera_active",
  PROCESSING = "processing",
  RESULT_SUCCESS = "result_success",
  RESULT_ERROR = "result_error",
}

export default function BoardIdPage() {
  const [state, setState] = useState<IdentificationState>(IdentificationState.INITIAL)
  const [identifiedBoard, setIdentifiedBoard] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle camera initialization
  useEffect(() => {
    if (state === IdentificationState.CAMERA_ACTIVE) {
      initCamera()
    } else {
      // Stop the camera when not in camera active state
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    }
  }, [state])

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setErrorMessage("Could not access camera. Please check permissions and try again.")
      setState(IdentificationState.RESULT_ERROR)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Process the image
        processImage()
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current
            const context = canvas.getContext("2d")

            if (context) {
              canvas.width = img.width
              canvas.height = img.height
              context.drawImage(img, 0, 0)
              processImage()
            }
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
      setState(IdentificationState.PROCESSING)
    }
  }

  const processImage = () => {
    setState(IdentificationState.PROCESSING)

    // Simulate processing delay
    setTimeout(() => {
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.3 // 70% success rate

      if (success) {
        // Randomly select a board from sample data
        const randomIndex = Math.floor(Math.random() * sampleBoards.length)
        setIdentifiedBoard(sampleBoards[randomIndex])
        setState(IdentificationState.RESULT_SUCCESS)
      } else {
        setErrorMessage(
          "Could not identify board from image. Please try again with better lighting or a clearer view of the board ID.",
        )
        setState(IdentificationState.RESULT_ERROR)
      }
    }, 2000)
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setErrorMessage("Please enter a board ID to search")
      return
    }

    setState(IdentificationState.PROCESSING)

    // Simulate search delay
    setTimeout(() => {
      // Search for board ID in sample data
      const foundBoard = sampleBoards.find((board) => board.id.toLowerCase().includes(searchQuery.toLowerCase()))

      if (foundBoard) {
        setIdentifiedBoard(foundBoard)
        setState(IdentificationState.RESULT_SUCCESS)
      } else {
        setErrorMessage(`No board found with ID containing "${searchQuery}". Please check the ID and try again.`)
        setState(IdentificationState.RESULT_ERROR)
      }
    }, 1000)
  }

  const resetToInitial = () => {
    setState(IdentificationState.INITIAL)
    setIdentifiedBoard(null)
    setSearchQuery("")
    setErrorMessage("")
  }

  const renderInitialState = () => (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Primary action - Camera */}
      <Button
        className="w-full h-24 text-xl flex flex-col items-center justify-center gap-2 shadow-lg"
        onClick={() => setState(IdentificationState.CAMERA_ACTIVE)}
      >
        <Camera className="h-8 w-8" />
        <span>Scan Board with Camera</span>
      </Button>

      <div className="grid grid-cols-2 gap-4">
        {/* Secondary action - Upload */}
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center gap-2 border-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-6 w-6" />
          <span>Upload Photo</span>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        </Button>

        {/* Secondary action - QR Code */}
        <Button
          variant="outline"
          className="h-20 flex flex-col items-center justify-center gap-2 border-2"
          onClick={() => setState(IdentificationState.CAMERA_ACTIVE)}
        >
          <QrCode className="h-6 w-6" />
          <span>Scan QR Code</span>
        </Button>
      </div>

      {/* Search option */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Manual Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter board ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="text-lg h-12"
            />
            <Button onClick={handleSearch} className="h-12 px-6">
              Go
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Field tips */}
      <Alert className="bg-blue-50 border-blue-200">
        <Smartphone className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Field Tips</AlertTitle>
        <AlertDescription className="text-blue-600 text-sm">
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Hold your device steady when scanning</li>
            <li>Ensure the board ID is clearly visible</li>
            <li>Avoid shadows and glare on the board</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderCameraActive = () => (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="relative rounded-lg overflow-hidden aspect-[4/3] border-4 border-primary shadow-lg">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* Guide overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3/4 h-1/3 border-2 border-white rounded-md flex items-center justify-center">
            <span className="text-white text-lg font-bold bg-black/30 px-3 py-1 rounded-full">
              Center Board ID Here
            </span>
          </div>
        </div>

        {/* Instructions overlay */}
        <div className="absolute top-0 left-0 right-0 bg-black/70 text-white p-3 text-center">
          Position the board ID in the frame
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" size="lg" className="h-16 text-lg" onClick={resetToInitial}>
          Cancel
        </Button>
        <Button size="lg" className="h-16 text-lg" onClick={captureImage}>
          Capture
        </Button>
      </div>
    </div>
  )

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-12 max-w-md mx-auto">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
      <h3 className="text-2xl font-medium mb-2 text-center">Identifying Board</h3>
      <p className="text-lg text-muted-foreground text-center">Please wait a moment...</p>
    </div>
  )

  const renderSuccess = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-800">Board Identified</h3>
            <p className="text-sm text-green-700">Board {identifiedBoard?.id}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-green-200 text-green-700 hover:bg-green-100"
          onClick={resetToInitial}
        >
          Scan Another
        </Button>
      </div>

      {identifiedBoard && (
        <Card className="border-2">
          <CardContent className="p-0">
            <BoardDetailView
              board={identifiedBoard}
              showAllDefects={true}
              onInspect={() => {}}
              onToggleShowAllDefects={() => {}}
              onAgreeWithAI={() => {}}
              onDisagreeWithAI={() => {}}
              onViewGradeReasons={() => {}}
              agreedWithAI={false}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderError = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-medium text-red-800 mb-2">Identification Failed</h3>
        <p className="text-red-700 mb-4">{errorMessage}</p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button variant="outline" size="lg" className="h-16 text-lg border-2" onClick={resetToInitial}>
            Try Another Method
          </Button>
          <Button
            size="lg"
            className="h-16 text-lg bg-red-600 hover:bg-red-700"
            onClick={() => setState(IdentificationState.CAMERA_ACTIVE)}
          >
            Try Again
          </Button>
        </div>
      </div>

      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-700">Troubleshooting Tips</AlertTitle>
        <AlertDescription className="text-amber-600">
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Ensure the board ID is clearly visible</li>
            <li>Try with better lighting conditions</li>
            <li>Hold your device steady</li>
            <li>Make sure the board is flat and not at an angle</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )

  // Render the appropriate UI based on the current state
  const renderContent = () => {
    switch (state) {
      case IdentificationState.INITIAL:
        return renderInitialState()
      case IdentificationState.CAMERA_ACTIVE:
        return renderCameraActive()
      case IdentificationState.PROCESSING:
        return renderProcessing()
      case IdentificationState.RESULT_SUCCESS:
        return renderSuccess()
      case IdentificationState.RESULT_ERROR:
        return renderError()
      default:
        return renderInitialState()
    }
  }

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Board Identification</h1>
      </div>
      {renderContent()}
    </div>
  )
}
