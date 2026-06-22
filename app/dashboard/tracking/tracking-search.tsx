"use client"

import { useRouter } from "next/navigation"
import { ExpandingSearchDock } from "@/components/ui-components/expanding-search-dock"

export function TrackingSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()

  return (
    <ExpandingSearchDock
      placeholder="Track AWB (e.g. AWB-123456)..."
      onSearch={(query) => {
        router.push(`/dashboard/tracking?awb=${encodeURIComponent(query)}`)
      }}
    />
  )
}
