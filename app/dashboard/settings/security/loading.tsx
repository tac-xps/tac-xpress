import { PageHeaderSkeleton } from "@/components/ui/skeleton-patterns"
import { Skeleton } from "@/components/ui/skeleton"

export default function SecurityLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-6 md:gap-8">
      <PageHeaderSkeleton hasAction={false} />
      <div className="max-w-3xl rounded-none border border-border p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
