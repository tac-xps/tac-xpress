import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-8">
      {/* Header skeleton */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Statistics grid skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-none" />
        ))}
      </div>

      {/* Charts row skeleton */}
      <div className="grid grid-cols-12 gap-6">
        <Skeleton className="col-span-12 h-96 rounded-none xl:col-span-8" />
        <Skeleton className="col-span-12 h-96 rounded-none xl:col-span-4" />
      </div>

      {/* Table + widget row skeleton */}
      <div className="grid grid-cols-12 gap-6">
        <Skeleton className="col-span-12 h-80 rounded-none xl:col-span-8" />
        <Skeleton className="col-span-12 h-80 rounded-none xl:col-span-4" />
      </div>
    </div>
  )
}
