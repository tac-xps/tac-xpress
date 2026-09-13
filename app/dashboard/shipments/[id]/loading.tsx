import { Skeleton } from "@/components/ui/skeleton"

export default function ShipmentDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>

      <Skeleton className="h-28 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}
