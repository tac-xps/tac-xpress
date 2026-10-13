import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton-patterns"

export default function CommunicationsLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-none border border-border/80 bg-card p-5 space-y-3"
          >
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
            <div className="pt-2">
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
      <TableSkeleton rows={8} columns={5} />
    </div>
  )
}
