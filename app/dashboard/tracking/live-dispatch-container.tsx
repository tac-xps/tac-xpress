"use client"
import * as React from "react"
import { useLiveFleet } from "./use-live-fleet"
import { LiveDispatchMap } from "./live-dispatch-map"
import { LiveFleetSidebar } from "./live-fleet-sidebar"

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
