"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Comparison, ComparisonItem } from "@/components/ui/comparison"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, CreditCard, LogOut, Settings, User } from "lucide-react"

export default function DesignComparisonPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Design System Comparison</h1>
        <p className="text-muted-foreground">Compare different design systems and component variations side by side</p>
      </div>

      {/* Button Comparison */}
      <Comparison title="Button Styles">
        <ComparisonItem title="shadcn/ui">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </ComparisonItem>
        <ComparisonItem title="Material Design">
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
              Filled
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
              Destructive
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
              Outlined
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
              Secondary
            </button>
            <button className="text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
              Text
            </button>
            <button className="text-blue-600 underline text-sm font-medium hover:text-blue-800 transition-colors">
              Link
            </button>
          </div>
        </ComparisonItem>
      </Comparison>

      {/* Card Comparison */}
      <Comparison title="Card Components">
        <ComparisonItem title="shadcn/ui">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="john.doe@example.com" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </ComparisonItem>
        <ComparisonItem title="Material Design">
          <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-1">Account</div>
              <p className="text-gray-500 text-sm mb-4">Manage your account settings</p>
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="john.doe@example.com"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full">
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </ComparisonItem>
      </Comparison>

      {/* Tabs Comparison */}
      <Comparison title="Tabs Components">
        <ComparisonItem title="shadcn/ui">
          <Tabs defaultValue="account" className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Account Settings</h4>
                <p className="text-sm text-muted-foreground">Update your account information and email preferences.</p>
              </div>
            </TabsContent>
            <TabsContent value="password" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Password Settings</h4>
                <p className="text-sm text-muted-foreground">Change your password and security settings.</p>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Application Settings</h4>
                <p className="text-sm text-muted-foreground">Manage your notification and display preferences.</p>
              </div>
            </TabsContent>
          </Tabs>
        </ComparisonItem>
        <ComparisonItem title="Material Design">
          <div className="w-full max-w-md mx-auto">
            <div className="border-b flex">
              <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">Account</button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Password</button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">Settings</button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <h4 className="text-base font-medium">Account Settings</h4>
                <p className="text-sm text-gray-600">Update your account information and email preferences.</p>
              </div>
            </div>
          </div>
        </ComparisonItem>
      </Comparison>

      {/* Menu Comparison */}
      <Comparison title="Menu Components" orientation="vertical">
        <ComparisonItem title="shadcn/ui">
          <div className="w-full max-w-xs mx-auto">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </ComparisonItem>
        <ComparisonItem title="Material Design">
          <div className="w-full max-w-xs mx-auto">
            <div className="space-y-1">
              <button className="flex items-center w-full px-3 py-2 text-left text-gray-700 rounded-lg hover:bg-gray-100">
                <User className="mr-3 h-5 w-5 text-gray-500" />
                <span>Profile</span>
              </button>
              <button className="flex items-center w-full px-3 py-2 text-left text-gray-700 rounded-lg hover:bg-gray-100">
                <CreditCard className="mr-3 h-5 w-5 text-gray-500" />
                <span>Billing</span>
              </button>
              <button className="flex items-center w-full px-3 py-2 text-left text-gray-700 rounded-lg hover:bg-gray-100">
                <Settings className="mr-3 h-5 w-5 text-gray-500" />
                <span>Settings</span>
              </button>
              <button className="flex items-center w-full px-3 py-2 text-left text-red-600 rounded-lg hover:bg-red-50">
                <LogOut className="mr-3 h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </ComparisonItem>
      </Comparison>

      {/* Form Validation Comparison */}
      <Comparison title="Form Validation Styles">
        <ComparisonItem title="shadcn/ui">
          <div className="w-full max-w-md mx-auto space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-valid">Email (Valid)</Label>
              <Input
                id="email-valid"
                value="valid@example.com"
                className="border-green-500 focus-visible:ring-green-500"
              />
              <p className="text-sm text-green-600 flex items-center">
                <Check className="h-3 w-3 mr-1" /> Email is valid
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-invalid">Email (Invalid)</Label>
              <Input id="email-invalid" value="invalid-email" className="border-red-500 focus-visible:ring-red-500" />
              <p className="text-sm text-red-600">Please enter a valid email address</p>
            </div>
          </div>
        </ComparisonItem>
        <ComparisonItem title="Material Design">
          <div className="w-full max-w-md mx-auto space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email (Valid)</label>
              <input
                value="valid@example.com"
                className="w-full px-3 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Check className="h-3 w-3 mr-1" /> Email is valid
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email (Invalid)</label>
              <input
                value="invalid-email"
                className="w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-red-600 mt-1">Please enter a valid email address</p>
            </div>
          </div>
        </ComparisonItem>
      </Comparison>
    </div>
  )
}
