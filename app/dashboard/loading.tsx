import {
  PageHeaderSkeleton,
  MetricsRowSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton-patterns"

export default function DashboardLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6 md:gap-8">
      <PageHeaderSkeleton />
      <MetricsRowSkeleton count={4} />
      <TableSkeleton rows={6} columns={5} />
    </div>
  )
}
