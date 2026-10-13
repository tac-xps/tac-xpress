import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton-patterns"

export default function FleetLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
      <TableSkeleton rows={8} columns={5} />
    </div>
  )
}
