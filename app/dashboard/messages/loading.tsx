import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton-patterns"

export default function MessagesLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} columns={5} />
      <div className="space-y-3">
        <Skeleton className="h-4 w-72" />
        <TableSkeleton rows={5} columns={4} hasToolbar={false} />
      </div>
    </div>
  )
}
