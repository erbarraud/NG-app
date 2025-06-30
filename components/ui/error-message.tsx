"use client"

import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

/**
 * ErrorMessage Component
 *
 * A reusable error message component with optional retry button.
 *
 * @param title - Optional title for the error
 * @param message - Error message to display
 * @param onRetry - Optional retry handler
 * @param className - Additional CSS classes
 */
export function ErrorMessage({ title, message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={cn("rounded-lg border border-red-200 bg-red-50 p-4", className)}>
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium text-red-800">{title}</h3>}
          <div className="mt-1 text-sm text-red-700">{message}</div>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-red-300 hover:bg-red-100 text-red-700"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
