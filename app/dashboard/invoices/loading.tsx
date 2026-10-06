import {
  PageHeaderSkeleton,
  MetricsRowSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton-patterns"

export default function InvoicesLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeaderSkeleton />
      <MetricsRowSkeleton count={3} />
      <TableSkeleton rows={8} columns={6} />
    </div>
  )
}
