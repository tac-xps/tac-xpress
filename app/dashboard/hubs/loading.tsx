import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton-patterns"

export default function HubsLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} columns={4} />
    </div>
  )
}
