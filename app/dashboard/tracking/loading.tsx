import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/ui/skeleton-patterns"

export default function TrackingLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton hasAction={false} />
      <div className="rounded-none border border-border/80 bg-card p-6 shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="rounded-none border border-dashed border-border/80 bg-muted/20 p-12 flex flex-col items-center justify-center gap-3 text-center">
        <Skeleton className="size-12 rounded-none" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
    </div>
  )
}
