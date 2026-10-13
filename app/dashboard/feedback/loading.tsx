import {
  PageHeaderSkeleton,
  MetricsRowSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton-patterns"

export default function FeedbackLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton />
      <MetricsRowSkeleton count={4} />
      <TableSkeleton rows={8} columns={4} />
    </div>
  )
}
