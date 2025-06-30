import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="border rounded-lg">
        <div className="p-4">
          <Skeleton className="h-6 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-t p-4 grid grid-cols-4 gap-4 items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
      {/* Fallback loading spinner if needed, though skeletons are primary */}
      {/* <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
         <LoadingSpinner text="Loading claims..." />
       </div> */}
    </div>
  )
}
