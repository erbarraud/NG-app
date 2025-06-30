import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Skeleton className="h-9 w-60" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-px border bg-muted text-sm">
        {[...Array(7)].map((_, dayIndex) => (
          <div key={dayIndex} className="bg-background p-2">
            <Skeleton className="h-6 w-20 mb-3" />
            <div className="space-y-2">
              {[...Array(3)].map((_, shiftIndex) => (
                <Skeleton key={shiftIndex} className="h-20 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Fallback loading spinner if needed */}
      {/* <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
         <LoadingSpinner text="Loading schedule..." />
       </div> */}
    </div>
  )
}
