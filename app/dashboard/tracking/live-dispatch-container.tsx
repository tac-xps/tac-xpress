"use client"
import * as React from "react"
import dynamic from "next/dynamic"
import { useLiveFleet } from "./use-live-fleet"
import { LiveFleetSidebar } from "./live-fleet-sidebar"
import { Skeleton } from "@/components/ui/skeleton"

const LiveDispatchMap = dynamic(
  () => import("./live-dispatch-map").then((mod) => mod.LiveDispatchMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center border border-border bg-card p-4">
        <Skeleton className="h-full w-full" />
      </div>
    ),
  }
)

export function LiveDispatchContainer() {
  const { vehicles, connectionStatus } = useLiveFleet()
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<
    string | null
  >(null)

  return (
    <div className="mb-8 grid h-[600px] w-full grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="h-full lg:col-span-3">
        <LiveDispatchMap
          vehicles={vehicles}
          connectionStatus={connectionStatus}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
        />
      </div>
      <div className="hidden h-full lg:col-span-1 lg:block">
        <LiveFleetSidebar
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
        />
      </div>
    </div>
  )
}
