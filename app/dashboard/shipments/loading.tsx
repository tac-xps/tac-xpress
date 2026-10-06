import {
  PageHeaderSkeleton,
  MetricsRowSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton-patterns"

export default function ShipmentsLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeaderSkeleton />
      <MetricsRowSkeleton count={4} />
      <TableSkeleton rows={8} columns={7} />
    </div>
  )
}
