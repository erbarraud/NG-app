// Ensure this file uses named import for LoadingSpinner if it uses it
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
      <LoadingSpinner size="lg" text="Loading order details..." />
    </div>
  )
}
