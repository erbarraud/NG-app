"use client"

import { useState } from "react"
import { Copy, Edit, MoreHorizontal, Plus, Save, Trash2, Search, TestTube, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Sample data for grading rules
const gradingRules = [
  {
    id: "GR-001",
    name: "Soft Maple FAS - Light Color",
    species: ["Soft Maple"],
    lastEdited: "2025-01-15T10:30:00Z",
    inUseIn: 3,
    baseTemplate: "NHLA",
    colorFilter: true,
    boardAspect: "Surfaced",
    status: "active",
  },
  {
    id: "GR-002",
    name: "Oak Premium Grade",
    species: ["Red Oak", "White Oak"],
    lastEdited: "2025-01-12T14:20:00Z",
    inUseIn: 5,
    baseTemplate: "Custom",
    colorFilter: false,
    boardAspect: "Rough",
    status: "active",
  },
  {
    id: "GR-003",
    name: "Beech Standard EU",
    species: ["Beech"],
    lastEdited: "2025-01-10T09:15:00Z",
    inUseIn: 2,
    baseTemplate: "EU",
    colorFilter: true,
    boardAspect: "Planed",
    status: "active",
  },
  {
    id: "GR-004",
    name: "Mixed Hardwood Economy",
    species: ["Beech", "Oak", "Maple", "Cherry"],
    lastEdited: "2025-01-08T16:45:00Z",
    inUseIn: 0,
    baseTemplate: "Custom",
    colorFilter: false,
    boardAspect: "Rough",
    status: "draft",
  },
]

const speciesOptions = [
  "Beech",
  "Red Oak",
  "White Oak",
  "Soft Maple",
  "Hard Maple",
  "Cherry",
  "Walnut",
  "Ash",
  "Birch",
  "Hickory",
  "Pine",
  "Spruce",
]

const defectTypes = [
  { id: "knot", label: "Knot Size", unit: "inches" },
  { id: "wane", label: "Wane Allowance", unit: "%" },
  { id: "rot", label: "Rot/Decay", unit: "count" },
  { id: "cracks", label: "Cracks/Splits", unit: "inches" },
  { id: "stain", label: "Stain", unit: "%" },
  { id: "bark", label: "Bark Pockets", unit: "count" },
  { id: "holes", label: "Holes", unit: "count" },
  { id: "grain", label: "Grain Deviation", unit: "degrees" },
]

export function GradingRules() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<any>(null)

  // Form state for create/edit modal
  const [formData, setFormData] = useState({
    name: "",
    species: [] as string[],
    baseTemplate: "Custom",
    colorFilter: false,
    colorGroups: [] as string[],
    boardAspect: "Rough",
    defectThresholds: {} as Record<string, any>,
    dimensions: {
      minLength: "",
      maxLength: "",
      minWidth: "",
      maxWidth: "",
      minThickness: "",
      maxThickness: "",
    },
    notes: "",
    description: "",
  })

  const filteredRules = gradingRules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.species.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSpecies = selectedSpecies === "all" || rule.species.includes(selectedSpecies)
    const matchesTemplate = selectedTemplate === "all" || rule.baseTemplate === selectedTemplate

    return matchesSearch && matchesSpecies && matchesTemplate
  })

  const handleCreateRule = () => {
    setFormData({
      name: "",
      species: [],
      baseTemplate: "Custom",
      colorFilter: false,
      colorGroups: [],
      boardAspect: "Rough",
      defectThresholds: {},
      dimensions: {
        minLength: "",
        maxLength: "",
        minWidth: "",
        maxWidth: "",
        minThickness: "",
        maxThickness: "",
      },
      notes: "",
      description: "",
    })
    setEditingRule(null)
    setIsCreateModalOpen(true)
  }

  const handleEditRule = (rule: any) => {
    setFormData({
      name: rule.name,
      species: rule.species,
      baseTemplate: rule.baseTemplate,
      colorFilter: rule.colorFilter,
      colorGroups: [],
      boardAspect: rule.boardAspect,
      defectThresholds: {},
      dimensions: {
        minLength: "",
        maxLength: "",
        minWidth: "",
        maxWidth: "",
        minThickness: "",
        maxThickness: "",
      },
      notes: "",
      description: "",
    })
    setEditingRule(rule)
    setIsCreateModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Grading Configuration</h1>
        <p className="text-muted-foreground">
          Manage grading rules used in board evaluation. Define defect thresholds, dimensions, and species criteria for
          automated grading.
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Species</SelectItem>
                  {speciesOptions.map((species) => (
                    <SelectItem key={species} value={species}>
                      {species}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="NHLA">NHLA</SelectItem>
                  <SelectItem value="EU">EU</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateRule}>
              <Plus className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Grading Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grading Rules ({filteredRules.length})</CardTitle>
          <CardDescription>Manage and configure grading rules for board evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead>In Use In</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{rule.name}</span>
                      <span className="text-xs text-muted-foreground">{rule.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.species.map((species) => (
                        <Badge key={species} variant="outline" className="text-xs">
                          {species}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.baseTemplate === "Custom" ? "secondary" : "default"}>
                      {rule.baseTemplate}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(rule.lastEdited)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rule.inUseIn}</span>
                      <span className="text-xs text-muted-foreground">sorts</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.status === "active" ? "default" : "secondary"}>{rule.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TestTube className="mr-2 h-4 w-4" />
                          Simulate Grading
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" disabled={rule.inUseIn > 0}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit Grading Rule" : "Create New Grading Rule"}</DialogTitle>
            <DialogDescription>
              Define grading criteria for board evaluation including defect thresholds, dimensions, and species
              requirements.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="defects">Defect Thresholds</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="notes">Notes & Logic</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Grading Rule Name *</Label>
                  <Input
                    id="rule-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Soft Maple FAS - Light Color"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Base Template</Label>
                  <Select
                    value={formData.baseTemplate}
                    onValueChange={(value) => setFormData({ ...formData, baseTemplate: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NHLA">NHLA Standard</SelectItem>
                      <SelectItem value="EU">EU Standard</SelectItem>
                      <SelectItem value="Custom">Custom Rules</SelectItem>
                      <SelectItem value="Duplicate">Duplicate Existing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Species (Multi-select)</Label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                  {speciesOptions.map((species) => (
                    <div key={species} className="flex items-center space-x-2">
                      <Checkbox
                        id={species}
                        checked={formData.species.includes(species)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, species: [...formData.species, species] })
                          } else {
                            setFormData({ ...formData, species: formData.species.filter((s) => s !== species) })
                          }
                        }}
                      />
                      <Label htmlFor={species} className="text-sm">
                        {species}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Board Aspect</Label>
                  <Select
                    value={formData.boardAspect}
                    onValueChange={(value) => setFormData({ ...formData, boardAspect: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rough">Rough</SelectItem>
                      <SelectItem value="Planed">Planed</SelectItem>
                      <SelectItem value="Surfaced">Surfaced</SelectItem>
                      <SelectItem value="S4S">S4S</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.colorFilter}
                      onCheckedChange={(checked) => setFormData({ ...formData, colorFilter: checked })}
                    />
                    <Label>Enable Color Filter</Label>
                  </div>
                  {formData.colorFilter && <Input placeholder="e.g., White Beech, Red Beech" className="mt-2" />}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="defects" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Defect Thresholds</h4>
                  <Badge variant="outline">Per-face rules supported</Badge>
                </div>

                <div className="grid gap-4">
                  {defectTypes.map((defect) => (
                    <Card key={defect.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{defect.label}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Min ({defect.unit})</Label>
                            <Input type="number" placeholder="0" className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Max ({defect.unit})</Label>
                            <Input type="number" placeholder="∞" className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Count/Face</Label>
                            <Input type="number" placeholder="0" className="h-8" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Tolerance</Label>
                            <Select>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Standard" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="strict">Strict</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="relaxed">Relaxed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dimensions" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Dimension Rules</h4>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-medium">Length</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Min (inches)</Label>
                        <Input
                          type="number"
                          value={formData.dimensions.minLength}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: { ...formData.dimensions, minLength: e.target.value },
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Max (inches)</Label>
                        <Input
                          type="number"
                          value={formData.dimensions.maxLength}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: { ...formData.dimensions, maxLength: e.target.value },
                            })
                          }
                          placeholder="∞"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium">Width</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Min (inches)</Label>
                        <Input
                          type="number"
                          value={formData.dimensions.minWidth}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: { ...formData.dimensions, minWidth: e.target.value },
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Max (inches)</Label>
                        <Input
                          type="number"
                          value={formData.dimensions.maxWidth}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: { ...formData.dimensions, maxWidth: e.target.value },
                            })
                          }
                          placeholder="∞"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium">Thickness</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Min (inches)</Label>
                        <Input
                          type="number"
                          value={formData.dimensions.minThickness}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: { ...formData.dimensions, minThickness: e.target.value },
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Max (inches)</Label>
                        <Input
                          type="number"
                          value={formData.dimensions.maxThickness}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: { ...formData.dimensions, maxThickness: e.target.value },
                            })
                          }
                          placeholder="∞"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium">Piece Fit Simulation</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select logic reference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Fit</SelectItem>
                        <SelectItem value="tight">Tight Fit</SelectItem>
                        <SelectItem value="loose">Loose Fit</SelectItem>
                        <SelectItem value="custom">Custom Logic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this grading rule..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Reference / Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Used for client X #Q3 rules, Special requirements..."
                    rows={4}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="font-medium">Additional Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="default-species" />
                      <Label htmlFor="default-species">Set as default for selected species</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="auto-update" />
                      <Label htmlFor="auto-update">Auto-update when base template changes</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              <TestTube className="mr-2 h-4 w-4" />
              Simulate Grading
            </Button>
            <Button variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Save & Duplicate
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
