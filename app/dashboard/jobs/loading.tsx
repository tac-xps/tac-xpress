import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton-patterns"

export default function JobsLoading() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <PageHeaderSkeleton hasAction={false} />
      <div className="grid gap-6">
        <TableSkeleton rows={6} columns={5} />
        <TableSkeleton rows={6} columns={5} />
      </div>
    </div>
  )
}
