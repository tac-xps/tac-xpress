import { PageHeaderSkeleton, MetricsRowSkeleton } from "@/components/ui/skeleton-patterns"
import { Skeleton } from "@/components/ui/skeleton"

export default function MetricsLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeaderSkeleton hasAction={false} />
      <MetricsRowSkeleton count={4} />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-none border border-border p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-none border border-border p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
