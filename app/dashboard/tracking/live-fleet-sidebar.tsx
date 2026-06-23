import * as React from "react"
import type { VehicleData } from "@/lib/fleet-telemetry"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface LiveFleetSidebarProps {
  vehicles: VehicleData[]
  selectedVehicleId: string | null
  onSelectVehicle: (id: string | null) => void
}

export function LiveFleetSidebar({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}: LiveFleetSidebarProps) {
  return (
    <Card className="flex h-full flex-col rounded-none border border-border shadow-none">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase">
          Active Fleet
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-2">
          {vehicles.map((vehicle) => {
            const isSelected = vehicle.id === selectedVehicleId
            return (
              <div
                key={vehicle.id}
                onClick={() => onSelectVehicle(isSelected ? null : vehicle.id)}
                className={`${isSelected ? "border-primary/50 bg-primary/5" : "border-border bg-card"} cursor-pointer border p-3 transition-colors hover:bg-muted/50`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium tracking-tight tabular-nums">
                    {vehicle.id}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 text-[10px] tracking-widest text-primary uppercase"
                  >
                    Live
                  </Badge>
                </div>
                <div className="space-y-1 text-xs tracking-tight text-muted-foreground tabular-nums">
                  <div>Lat: {vehicle.lat.toFixed(4)}</div>
                  <div>Lng: {vehicle.lng.toFixed(4)}</div>
                  <div>Hdg: {Math.round(vehicle.heading)}°</div>
                </div>
              </div>
            )
          })}
          {vehicles.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No active vehicles found.
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
