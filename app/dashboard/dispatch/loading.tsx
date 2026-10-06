import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton-patterns"

export default function DispatchLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} columns={6} />
    </div>
  )
}
