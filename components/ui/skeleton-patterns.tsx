import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function PageHeaderSkeleton({
  hasAction = true,
  className,
}: {
  hasAction?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56 sm:w-72" />
        <Skeleton className="h-4 w-72 sm:w-96" />
      </div>
      {hasAction && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
        </div>
      )}
    </div>
  )
}

export function MetricsRowSkeleton({
  count = 4,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-none border border-border/80 bg-card",
        className
      )}
    >
      <div className="border-b border-border/80 bg-muted/20 px-5 py-2.5">
        <Skeleton className="h-3 w-48" />
      </div>
      <div
        className={cn(
          "grid grid-cols-2 p-5",
          count === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
        )}
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="px-2 lg:border-l lg:px-6 lg:first:border-0 lg:first:pl-0 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 shrink-0" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({
  rows = 8,
  columns = 6,
  hasToolbar = true,
  className,
}: {
  rows?: number
  columns?: number
  hasToolbar?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-none border border-border/80 bg-card",
        className
      )}
    >
      {hasToolbar && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/80 p-3 sm:px-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-8 w-full sm:w-64" />
            <Skeleton className="h-8 w-32 shrink-0 hidden sm:block" />
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      )}

      {/* Table Head */}
      <div className="border-b border-border/80 bg-muted/40 px-4 py-3 flex items-center justify-between gap-4">
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton
            key={idx}
            className={cn(
              "h-3.5",
              idx === 0
                ? "w-28"
                : idx === 1
                ? "w-36 hidden md:block"
                : idx === columns - 1
                ? "w-16"
                : "w-24 hidden sm:block"
            )}
          />
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="px-4 py-3.5 flex items-center justify-between gap-4"
          >
            {Array.from({ length: columns }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={cn(
                  "h-4",
                  cIdx === 0
                    ? "w-24"
                    : cIdx === 1
                    ? "w-40 hidden md:block"
                    : cIdx === columns - 1
                    ? "w-12"
                    : "w-20 hidden sm:block"
                )}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-border/80 bg-muted/10 px-4 py-3 flex items-center justify-between">
        <Skeleton className="h-3 w-36" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

export function DetailViewSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-6", className)}>
      {/* Header with Title and Badges */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Key Facts Metric Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-none border border-border/80 bg-card p-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        ))}
      </div>

      {/* 2-Column Party Information Cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-none border border-border/80 bg-card p-5 space-y-3"
          >
            <Skeleton className="h-4 w-28 border-b pb-2" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3.5 w-56" />
          </div>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="rounded-none border border-border/80 bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-3 pl-4 border-l-2 border-border/60">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div className="rounded-none border border-border/80 bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-3.5 w-72" />
        <Skeleton className="h-28 w-full border border-dashed border-border/80" />
      </div>
    </div>
  )
}

export function AnalyticsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <Skeleton className="size-12 shrink-0 rounded-none" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* Tabs bar shimmer */}
      <div className="flex items-center justify-between border-y border-border/80 py-3">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-none border border-border/80 bg-card p-4 space-y-2"
          >
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-none border border-border/80 bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-72" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-none border border-border/80 bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-56" />
          </div>
          <div className="flex items-center justify-center py-6">
            <Skeleton className="size-44 rounded-full" />
          </div>
        </div>
      </div>

      {/* Top Routes Horizontal Bar Chart */}
      <div className="rounded-none border border-border/80 bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-36 w-full" />
      </div>
    </div>
  )
}
