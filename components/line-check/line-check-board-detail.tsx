"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/status-indicator"
import { AlertTriangle, ArrowLeft, Clock, FileText, Layers, Maximize, Minimize, Ruler, Tag } from "lucide-react"
import type { Board } from "@/types/board"

interface BoardDetailProps {
  board: Board
  onBack: () => void
}

export function LineCheckBoardDetail({ board, onBack }: BoardDetailProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "Major":
      case "Severe":
        return "text-red-500 bg-red-100"
      case "Moderate":
        return "text-orange-500 bg-orange-100"
      default:
        return "text-blue-500 bg-blue-100"
    }
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-6" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Live View
          </Button>
          <div className="h-4 border-l border-muted-foreground/20"></div>
          <h2 className="text-xl font-semibold">Board Details</h2>
        </div>
        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize className="h-4 w-4 mr-1" /> : <Maximize className="h-4 w-4 mr-1" />}
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{board.grade}</Badge>
                <Badge variant="secondary">{board.id}</Badge>
                {board.defects?.some((d) => d.severity === "Major" || d.severity === "Severe") && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Severe Defects
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {board.timestamp}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="face1" className="w-full">
              <div className="border-b px-4">
                <TabsList className="h-10">
                  <TabsTrigger value="face1" className="data-[state=active]:bg-background">
                    Face 1 (Front)
                  </TabsTrigger>
                  <TabsTrigger value="face2" className="data-[state=active]:bg-background">
                    Face 2 (Back)
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="face1" className="p-0">
                <div className="relative">
                  <img
                    src={board.imageFront || "/placeholder.svg"}
                    alt={`Board ${board.id} front view`}
                    className="w-full h-[300px] object-cover"
                  />
                  {/* Defect markers */}
                  {board.defects
                    ?.filter((d) => d.face === 1)
                    .map((defect, index) => (
                      <div
                        key={index}
                        className={`absolute w-8 h-8 rounded-full flex items-center justify-center -ml-4 -mt-4 border-2 ${getSeverityClass(defect.severity)}`}
                        style={{
                          left: `${(defect.position.x / 1000) * 100}%`,
                          top: `${(defect.position.y / 300) * 100}%`,
                        }}
                      >
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="face2" className="p-0">
                <div className="relative">
                  <img
                    src={board.imageBack || "/placeholder.svg"}
                    alt={`Board ${board.id} back view`}
                    className="w-full h-[300px] object-cover"
                  />
                  {/* Defect markers */}
                  {board.defects
                    ?.filter((d) => d.face === 2)
                    .map((defect, index) => (
                      <div
                        key={index}
                        className={`absolute w-8 h-8 rounded-full flex items-center justify-center -ml-4 -mt-4 border-2 ${getSeverityClass(defect.severity)}`}
                        style={{
                          left: `${(defect.position.x / 1000) * 100}%`,
                          top: `${(defect.position.y / 300) * 100}%`,
                        }}
                      >
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Board Information</CardTitle>
            <CardDescription>Details and specifications</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Batch:</span>
                </div>
                <div className="text-sm font-medium">
                  {board.batchId} ({board.batchName})
                </div>

                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Wood Type:</span>
                </div>
                <div className="text-sm font-medium">{board.woodType}</div>

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Processing:</span>
                </div>
                <div className="text-sm font-medium">{board.processing}</div>

                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Dimensions:</span>
                </div>
                <div className="text-sm font-medium">
                  {board.dimensions.length} × {board.dimensions.width} × {board.dimensions.thickness}
                </div>
              </div>

              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Defects Summary</h4>
                <div className="space-y-2">
                  {board.defectCount === 0 ? (
                    <div className="text-sm text-muted-foreground">No defects detected</div>
                  ) : (
                    board.defects?.map((defect, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityClass(defect.severity)}`}></div>
                          <span className="text-sm">{defect.type}</span>
                        </div>
                        <Badge variant="outline" className={getSeverityClass(defect.severity)}>
                          {defect.severity}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <StatusIndicator
              type={
                board.defects?.some((d) => d.severity === "Major" || d.severity === "Severe")
                  ? "error"
                  : board.defects?.some((d) => d.severity === "Moderate")
                    ? "warning"
                    : board.defectCount > 0
                      ? "info"
                      : "success"
              }
              caption={
                board.defects?.some((d) => d.severity === "Major" || d.severity === "Severe")
                  ? "Critical Issues"
                  : board.defects?.some((d) => d.severity === "Moderate")
                    ? "Moderate Issues"
                    : board.defectCount > 0
                      ? "Minor Issues"
                      : "No Issues"
              }
            />
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detailed Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Total SM</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-2xl font-bold">{board.totalSM}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Volume</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-2xl font-bold">{board.volume}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Value</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-2xl font-bold">${board.value.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Grade</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-2xl font-bold">{board.grade}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Scan History</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="font-medium">Board entered scanning area</p>
                  <p className="text-sm text-muted-foreground">15:45:10</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-3 h-3 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">Face 1 scanning complete</p>
                  <p className="text-sm text-muted-foreground">15:45:15</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-3 h-3 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">Face 2 scanning complete</p>
                  <p className="text-sm text-muted-foreground">15:45:20</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-3 h-3 rounded-full bg-orange-500"></div>
                <div>
                  <p className="font-medium">Defect detected: {board.defects?.[0]?.type}</p>
                  <p className="text-sm text-muted-foreground">15:45:22</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-3 h-3 rounded-full bg-purple-500"></div>
                <div>
                  <p className="font-medium">Grade assigned: {board.grade}</p>
                  <p className="text-sm text-muted-foreground">15:45:25</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="font-medium">Board exited scanning area</p>
                  <p className="text-sm text-muted-foreground">15:45:30</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="diagnostics" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Diagnostic Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Scanner Status</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <StatusIndicator type="success" caption="Operational" />
                  <p className="text-sm text-muted-foreground mt-2">All sensors functioning normally</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Scan Quality</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">95% - Excellent</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Camera Calibration</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <StatusIndicator type="success" caption="Calibrated" />
                  <p className="text-sm text-muted-foreground mt-2">Last calibration: Today, 08:00 AM</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Processing Time</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-2xl font-bold">320ms</p>
                  <p className="text-sm text-muted-foreground">Within normal range</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
