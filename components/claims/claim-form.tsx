"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, X } from "lucide-react"

interface ClaimFormProps {
  customerInfo: string
  onSubmit: (formData: any) => void
}

export function ClaimForm({ customerInfo, onSubmit }: ClaimFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    customerName: getCustomerName(customerInfo),
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    batchId: "",
    issueType: "",
    description: "",
  })

  // Photos state
  const [photos, setPhotos] = useState<string[]>([])

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setPhotos((prev) => [...prev, ...newPhotos])
    }
  }

  // Remove photo
  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required"
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Email is invalid"
    }

    if (!formData.batchId.trim()) {
      newErrors.batchId = "Batch ID is required"
    }

    if (!formData.issueType) {
      newErrors.issueType = "Issue type is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({
        ...formData,
        photos,
        dateSubmitted: new Date().toISOString().split("T")[0],
      })
    }
  }

  // Helper function to get customer name from token
  function getCustomerName(customerInfo: string): string {
    switch (customerInfo) {
      case "northland":
        return "Northland Lumber Co."
      case "pacific":
        return "Pacific Coast Timber"
      case "eastwood":
        return "Eastwood Building Supply"
      case "mountain":
        return "Mountain Ridge Contractors"
      case "riverside":
        return "Riverside Lumber Yard"
      default:
        return "Customer"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Customer Information</h3>

        <div>
          <Label htmlFor="customerName">Company Name</Label>
          <Input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="mt-1"
            disabled
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="mt-1"
              placeholder="Your full name"
            />
            {errors.contactName && <p className="text-sm text-red-500 mt-1">{errors.contactName}</p>}
          </div>

          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              className="mt-1"
              placeholder="your.email@example.com"
            />
            {errors.contactEmail && <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="mt-1"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Claim Details</h3>

        <div>
          <Label htmlFor="batchId">Batch ID</Label>
          <Input
            id="batchId"
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter the batch ID (e.g., BATCH-1234)"
          />
          <p className="text-xs text-muted-foreground mt-1">
            You can find the Batch ID on your invoice or delivery paperwork
          </p>
          {errors.batchId && <p className="text-sm text-red-500 mt-1">{errors.batchId}</p>}
        </div>

        <div>
          <Label htmlFor="issueType">Issue Type</Label>
          <Select value={formData.issueType} onValueChange={(value) => handleSelectChange("issueType", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade">Grade Dispute</SelectItem>
              <SelectItem value="damage">Delivery Damage</SelectItem>
              <SelectItem value="quantity">Quantity Discrepancy</SelectItem>
              <SelectItem value="quality">Quality Issues</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.issueType && <p className="text-sm text-red-500 mt-1">{errors.issueType}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1"
            placeholder="Please describe the issue in detail..."
            rows={4}
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div>
          <Label>Photos</Label>
          <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6">
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-center text-muted-foreground mb-2">
                Drag and drop photos here, or click to select files
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Photos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => document.getElementById("camera-capture")?.click()}
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <input
                id="camera-capture"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Uploaded photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Upload photos of the issue to help us process your claim faster
          </p>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Submit Claim
        </Button>
      </div>
    </form>
  )
}
