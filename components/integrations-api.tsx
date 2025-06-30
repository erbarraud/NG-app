"use client"

import { useState } from "react"
import { Plus, RefreshCw, Settings, Code, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for integrations
const integrations = [
  {
    id: "INT-001",
    name: "ERP System",
    type: "API",
    status: "active",
    lastSync: "2025-03-18 09:30",
    description: "Integration with company ERP for inventory management",
  },
  {
    id: "INT-002",
    name: "Production MES",
    type: "Webhook",
    status: "active",
    lastSync: "2025-03-18 08:45",
    description: "Manufacturing Execution System integration for production data",
  },
  {
    id: "INT-003",
    name: "Quality Database",
    type: "Database",
    status: "inactive",
    lastSync: "2025-03-15 14:20",
    description: "Connection to quality management database",
  },
]

// Sample data for API keys
const apiKeys = [
  {
    id: "API-001",
    name: "Production API Key",
    key: "ng_prod_a1b2c3d4e5f6g7h8i9j0",
    created: "2025-01-15",
    lastUsed: "2025-03-18 10:15",
    permissions: ["read", "write"],
    status: "active",
  },
  {
    id: "API-002",
    name: "Read-Only API Key",
    key: "ng_read_z9y8x7w6v5u4t3s2r1q0",
    created: "2025-02-10",
    lastUsed: "2025-03-17 16:30",
    permissions: ["read"],
    status: "active",
  },
]

// Sample data for webhooks
const webhooks = [
  {
    id: "WH-001",
    name: "Batch Completion",
    url: "https://example.com/webhooks/neural-grader/batch-complete",
    events: ["batch.completed"],
    created: "2025-02-20",
    lastTriggered: "2025-03-18 14:30",
    status: "active",
  },
  {
    id: "WH-002",
    name: "Error Notifications",
    url: "https://example.com/webhooks/neural-grader/errors",
    events: ["system.error", "batch.error"],
    created: "2025-02-25",
    lastTriggered: "2025-03-16 09:15",
    status: "active",
  },
]

export function IntegrationsApi() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Integrations & API</h1>
        <p className="text-muted-foreground">Connect Neural Grader with other systems and manage API access</p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="documentation">API Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Connected Systems</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Integration
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Integration</DialogTitle>
                  <DialogDescription>Connect Neural Grader with another system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="integration-name">Integration Name</Label>
                    <Input id="integration-name" placeholder="Enter a name for this integration" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="integration-type">Integration Type</Label>
                    <Select>
                      <SelectTrigger id="integration-type">
                        <SelectValue placeholder="Select integration type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API Connection</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                        <SelectItem value="database">Database Connection</SelectItem>
                        <SelectItem value="file">File Export/Import</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="integration-details">Connection Details</Label>
                    <Textarea
                      id="integration-details"
                      placeholder="Enter connection details, such as URL, credentials, or other configuration information"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="integration-enabled">Enable Integration</Label>
                      <Switch id="integration-enabled" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Integration will be active immediately after creation
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Integration</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => {
              let statusColor = "bg-gray-500"
              let statusText = "Inactive"

              if (integration.status === "active") {
                statusColor = "bg-emerald-500"
                statusText = "Active"
              }

              return (
                <Card key={integration.id} className="border border-border overflow-hidden relative">
                  {integration.status === "active" && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                  )}
                  <CardHeader className="border-b border-border pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{integration.name}</CardTitle>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                        <span className="text-sm font-medium">{statusText}</span>
                      </div>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ID:</span>
                        <span>{integration.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{integration.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Sync:</span>
                        <span>{integration.lastSync}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                      <Button className="flex-1">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}

            <Card className="border border-border">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="text-lg font-medium">Add Integration</CardTitle>
                <CardDescription>Connect with another system</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Add a new integration to connect with external systems
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Integration</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Integration</DialogTitle>
                      <DialogDescription>Connect Neural Grader with another system</DialogDescription>
                    </DialogHeader>
                    {/* Dialog content would be the same as above */}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Generate New API Key</DialogTitle>
                  <DialogDescription>Create a new API key for programmatic access to Neural Grader</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input id="key-name" placeholder="Enter a name for this API key" />
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="permission-read" defaultChecked />
                        <Label htmlFor="permission-read">Read (GET requests)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="permission-write" />
                        <Label htmlFor="permission-write">Write (POST, PUT, DELETE requests)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="permission-admin" />
                        <Label htmlFor="permission-admin">Admin (system configuration)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Expiration</Label>
                    <Select defaultValue="never">
                      <SelectTrigger>
                        <SelectValue placeholder="Select expiration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 days</SelectItem>
                        <SelectItem value="90days">90 days</SelectItem>
                        <SelectItem value="1year">1 year</SelectItem>
                        <SelectItem value="never">Never expires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Generate Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="space-y-6">
                {apiKeys.map((apiKey) => {
                  let statusColor = "bg-gray-500"
                  let statusText = "Inactive"

                  if (apiKey.status === "active") {
                    statusColor = "bg-emerald-500"
                    statusText = "Active"
                  }
                  return (
                    <div key={apiKey.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{apiKey.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {apiKey.id}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                          <span className="text-sm font-medium">{statusText}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted p-2 rounded-md flex-1 font-mono text-sm">
                            {apiKeyVisible ? apiKey.key : "•".repeat(apiKey.key.length)}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                            {apiKeyVisible ? "Hide" : "Show"}
                          </Button>
                          <Button variant="outline" size="sm">
                            Copy
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p>{apiKey.created}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Used</p>
                            <p>{apiKey.lastUsed}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Permissions</p>
                            <div className="flex gap-1 mt-1">
                              {apiKey.permissions.map((permission) => (
                                <Badge key={permission} variant="outline">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Webhooks</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Webhook</DialogTitle>
                  <DialogDescription>Create a new webhook to receive event notifications</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-name">Webhook Name</Label>
                    <Input id="webhook-name" placeholder="Enter a name for this webhook" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">URL</Label>
                    <Input id="webhook-url" placeholder="https://example.com/webhook" />
                  </div>

                  <div className="space-y-2">
                    <Label>Events to Subscribe</Label>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="event-batch-completed" />
                        <Label htmlFor="event-batch-completed">batch.completed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="event-batch-created" />
                        <Label htmlFor="event-batch-created">batch.created</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="event-batch-error" />
                        <Label htmlFor="event-batch-error">batch.error</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="event-system-error" />
                        <Label htmlFor="event-system-error">system.error</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="event-user-login" />
                        <Label htmlFor="event-user-login">user.login</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="webhook-active">Active</Label>
                      <Switch id="webhook-active" defaultChecked />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Webhook</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="space-y-6">
                {webhooks.map((webhook) => {
                  let statusColor = "bg-gray-500"
                  let statusText = "Inactive"

                  if (webhook.status === "active") {
                    statusColor = "bg-emerald-500"
                    statusText = "Active"
                  }

                  return (
                    <div key={webhook.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{webhook.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {webhook.id}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                          <span className="text-sm font-medium">{statusText}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">URL</p>
                          <p className="text-sm font-mono break-all">{webhook.url}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p>{webhook.created}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Triggered</p>
                            <p>{webhook.lastTriggered}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Events</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {webhook.events.map((event) => (
                                <Badge key={event} variant="outline">
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Test
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-lg font-medium">API Documentation</CardTitle>
              <CardDescription>Reference documentation for the Neural Grader API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Getting Started</h3>
                <p className="text-muted-foreground">
                  The Neural Grader API allows you to programmatically access and control your wood grading system. Use
                  the API to integrate with other systems, automate workflows, and build custom applications.
                </p>

                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Base URL</h4>
                  <code className="text-sm font-mono">https://api.neuralgrader.com/v1</code>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    All API requests require authentication using an API key. Include your API key in the request
                    header:
                  </p>
                  <div className="bg-muted p-4 rounded-md">
                    <code className="text-sm font-mono">Authorization: Bearer YOUR_API_KEY</code>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Available Endpoints</h3>

                <div className="border rounded-md">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <span className="font-mono text-sm">/batches</span>
                    </div>
                    <p className="text-sm text-muted-foreground">List all batches with optional filtering</p>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <span className="font-mono text-sm">/batches/{"{batch_id}"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Get details for a specific batch</p>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-500">POST</Badge>
                      <span className="font-mono text-sm">/batches</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Create a new batch</p>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <span className="font-mono text-sm">/defects</span>
                    </div>
                    <p className="text-sm text-muted-foreground">List all detected defects with optional filtering</p>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <span className="font-mono text-sm">/profiles</span>
                    </div>
                    <p className="text-sm text-muted-foreground">List all grading profiles</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-500">GET</Badge>
                      <span className="font-mono text-sm">/stats</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Get system statistics and performance metrics</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Code className="mr-2 h-4 w-4" />
                View Full Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
