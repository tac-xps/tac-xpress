import {
  PageHeaderSkeleton,
  MetricsRowSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton-patterns"

export default function OperationsLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton hasAction={false} />
      <MetricsRowSkeleton count={3} />
      <TableSkeleton rows={8} columns={6} />
    </div>
  )
}
