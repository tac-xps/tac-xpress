"use client"

import * as React from "react"
import Map, {
  Marker,
  NavigationControl,
  Popup,
  useMap,
} from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { VehicleData } from "@/lib/fleet-telemetry"
import { ConnectionStatus } from "./use-live-fleet"

interface LiveDispatchMapProps {
  vehicles: VehicleData[]
  connectionStatus: ConnectionStatus
  selectedVehicleId: string | null
  onSelectVehicle: (id: string | null) => void
}

function MapController({
  selectedVehicleId,
  vehicles,
}: {
  selectedVehicleId: string | null
  vehicles: VehicleData[]
}) {
  const { current: map } = useMap()

  React.useEffect(() => {
    if (selectedVehicleId && map) {
      const v = vehicles.find((v) => v.id === selectedVehicleId)
      if (v) {
        map.flyTo({ center: [v.lng, v.lat], zoom: 14, duration: 1000 })
      }
    }
  }, [selectedVehicleId, map, vehicles])

  return null
}

export function LiveDispatchMap({
  vehicles,
  connectionStatus,
  selectedVehicleId,
  onSelectVehicle,
}: LiveDispatchMapProps) {
  const [viewState, setViewState] = React.useState({
    longitude: 77.209,
    latitude: 28.6139,
    zoom: 10,
  })

  return (
    <Card className="relative h-full w-full overflow-hidden rounded-none border border-border shadow-none">
      <Map
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        <MapController
          selectedVehicleId={selectedVehicleId}
          vehicles={vehicles}
        />

        {vehicles.map((vehicle) => (
          <React.Fragment key={vehicle.id}>
            <Marker
              longitude={vehicle.lng}
              latitude={vehicle.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                onSelectVehicle(vehicle.id)
              }}
            >
              <div className="relative flex h-8 w-8 cursor-pointer items-center justify-center">
                <span
                  className={`${selectedVehicleId === vehicle.id ? "bg-status-pending" : "bg-primary"} absolute inline-flex h-full w-full animate-ping rounded-full opacity-75`}
                ></span>
                <span
                  className={`${selectedVehicleId === vehicle.id ? "bg-status-pending" : "bg-primary"} relative inline-flex h-4 w-4 rounded-full border-2 border-background shadow-sm`}
                ></span>
              </div>
            </Marker>

            {selectedVehicleId === vehicle.id && (
              <Popup
                longitude={vehicle.lng}
                latitude={vehicle.lat}
                anchor="bottom"
                offset={16}
                onClose={() => onSelectVehicle(null)}
                closeButton={false}
                className="z-50"
              >
                <div className="flex flex-col p-1 text-sm">
                  <span className="mb-1 font-bold">{vehicle.id}</span>
                  <span className="text-xs tracking-tight text-muted-foreground tabular-nums">
                    Hdg: {Math.round(vehicle.heading)}°
                  </span>
                  <span className="text-xs tracking-tight text-muted-foreground tabular-nums">
                    Speed: ~40 km/h
                  </span>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}
      </Map>

      <div className="absolute top-4 left-4 z-10">
        <Badge
          variant="outline"
          className={`${connectionStatus === "live" ? "border-primary/20 text-primary" : "border-status-pending/20 text-status-pending"} bg-background shadow-sm`}
        >
          {connectionStatus === "live"
            ? "● LIVE CONNECTION"
            : "◌ CONNECTING..."}
        </Badge>
      </div>
    </Card>
  )
}
