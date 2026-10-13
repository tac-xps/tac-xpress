import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/ui/skeleton-patterns"

export default function IntegrationsLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton hasAction={false} />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-none border border-border/80 bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      <div className="rounded-none border border-border/80 bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
