"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  Check,
  Edit,
  Key,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash2,
  User,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

// Sample data for users
const users = [
  {
    id: "U-001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2025-03-18 09:45",
    permissions: ["view", "edit", "create", "delete", "manage_users"],
  },
  {
    id: "U-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Operator",
    status: "active",
    lastLogin: "2025-03-18 08:30",
    permissions: ["view", "edit", "create"],
  },
  {
    id: "U-003",
    name: "Mike Davis",
    email: "mike.davis@example.com",
    role: "Operator",
    status: "active",
    lastLogin: "2025-03-17 16:15",
    permissions: ["view", "edit", "create"],
  },
  {
    id: "U-004",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    role: "Quality Manager",
    status: "active",
    lastLogin: "2025-03-17 14:20",
    permissions: ["view", "edit", "create", "delete"],
  },
  {
    id: "U-005",
    name: "Robert Chen",
    email: "robert.chen@example.com",
    role: "Viewer",
    status: "inactive",
    lastLogin: "2025-03-10 11:30",
    permissions: ["view"],
  },
]

// Sample data for roles
const roles = [
  {
    id: "R-001",
    name: "Admin",
    description: "Full system access with user management",
    userCount: 1,
    permissions: ["view", "edit", "create", "delete", "manage_users", "system_config"],
  },
  {
    id: "R-002",
    name: "Quality Manager",
    description: "Can manage grading rules and view all data",
    userCount: 1,
    permissions: ["view", "edit", "create", "delete"],
  },
  {
    id: "R-003",
    name: "Operator",
    description: "Can operate the grading system and view results",
    userCount: 2,
    permissions: ["view", "edit", "create"],
  },
  {
    id: "R-004",
    name: "Viewer",
    description: "Read-only access to grading data",
    userCount: 1,
    permissions: ["view"],
  },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage users, roles, and permissions for the Neural Grader system</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Quality Manager">Quality Manager</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account for the Neural Grader system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="Enter first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Enter last name" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="operator">
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="quality-manager">Quality Manager</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Temporary Password</Label>
                    <Input id="password" type="password" placeholder="Enter temporary password" />
                    <p className="text-sm text-muted-foreground">
                      User will be prompted to change password on first login
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="send-email" />
                    <Label htmlFor="send-email">Send welcome email with login instructions</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-8 font-medium">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      let statusColor = "bg-gray-500"
                      let statusText = "Inactive"

                      if (user.status === "active") {
                        statusColor = "bg-emerald-500"
                        statusText = "Active"
                      }

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "Admin"
                                  ? "default"
                                  : user.role === "Quality Manager"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                              <span className="text-sm font-medium">{statusText}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <User className="mr-2 h-4 w-4" />
                                  <span>View Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit User</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Key className="mr-2 h-4 w-4" />
                                  <span>Reset Password</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === "active" ? (
                                  <DropdownMenuItem>
                                    <Lock className="mr-2 h-4 w-4" />
                                    <span>Deactivate</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <Check className="mr-2 h-4 w-4" />
                                    <span>Activate</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Roles & Permissions</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>Define a new role with specific permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input id="role-name" placeholder="Enter role name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description</Label>
                    <Input id="role-description" placeholder="Enter role description" />
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Data Access</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="view-data" />
                            <Label htmlFor="view-data">View Data</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="export-data" />
                            <Label htmlFor="export-data">Export Data</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Batch Management</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="create-batch" />
                            <Label htmlFor="create-batch">Create Batches</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="edit-batch" />
                            <Label htmlFor="edit-batch">Edit Batches</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="delete-batch" />
                            <Label htmlFor="delete-batch">Delete Batches</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Grading Configuration</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="view-rules" />
                            <Label htmlFor="view-rules">View Rules</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="edit-rules" />
                            <Label htmlFor="edit-rules">Edit Rules</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="create-profile" />
                            <Label htmlFor="create-profile">Create Profiles</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">User Management</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="view-users" />
                            <Label htmlFor="view-users">View Users</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="manage-users" />
                            <Label htmlFor="manage-users">Manage Users</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="manage-roles" />
                            <Label htmlFor="manage-roles">Manage Roles</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">System</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="system-config" />
                            <Label htmlFor="system-config">System Configuration</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="view-logs" />
                            <Label htmlFor="view-logs">View Logs</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <Card key={role.id} className="border border-border overflow-hidden relative">
                <CardHeader className="border-b border-border pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <Badge variant="outline">
                      {role.userCount} {role.userCount === 1 ? "user" : "users"}
                    </Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <h4 className="text-sm font-medium mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.includes("view") && <Badge variant="outline">View Data</Badge>}
                    {role.permissions.includes("edit") && <Badge variant="outline">Edit Data</Badge>}
                    {role.permissions.includes("create") && <Badge variant="outline">Create Batches</Badge>}
                    {role.permissions.includes("delete") && <Badge variant="outline">Delete Data</Badge>}
                    {role.permissions.includes("manage_users") && <Badge variant="outline">Manage Users</Badge>}
                    {role.permissions.includes("system_config") && <Badge variant="outline">System Config</Badge>}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    {role.name !== "Admin" && (
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-lg font-medium">Security Settings</CardTitle>
              <CardDescription>Configure security policies for user accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Minimum Password Length</Label>
                      <p className="text-sm text-muted-foreground">Minimum number of characters required</p>
                    </div>
                    <Select defaultValue="8">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 characters</SelectItem>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password Complexity</Label>
                      <p className="text-sm text-muted-foreground">Requirements for password composition</p>
                    </div>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (letters only)</SelectItem>
                        <SelectItem value="medium">Medium (letters + numbers)</SelectItem>
                        <SelectItem value="high">High (letters, numbers, symbols)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password Expiration</Label>
                      <p className="text-sm text-muted-foreground">How often users must change passwords</p>
                    </div>
                    <Select defaultValue="90">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select expiration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password History</Label>
                      <p className="text-sm text-muted-foreground">Prevent reuse of previous passwords</p>
                    </div>
                    <Select defaultValue="5">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select history" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Remember 3 passwords</SelectItem>
                        <SelectItem value="5">Remember 5 passwords</SelectItem>
                        <SelectItem value="10">Remember 10 passwords</SelectItem>
                        <SelectItem value="0">Don't remember</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Account Lockout</Label>
                      <p className="text-sm text-muted-foreground">Lock account after failed login attempts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="5">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select attempts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                          <SelectItem value="0">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="0">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for account access</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="optional">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select 2FA policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="disabled">Disabled</SelectItem>
                          <SelectItem value="optional">Optional</SelectItem>
                          <SelectItem value="required-admin">Required for Admins</SelectItem>
                          <SelectItem value="required-all">Required for All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
