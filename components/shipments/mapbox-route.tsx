"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { Layers } from "lucide-react"
import { useMapboxRoute } from "./use-mapbox-route"

interface MapboxRouteProps {
  origin: string
  destination: string
  currentLocation?: [number, number]
}

export function MapboxRoute({
  origin,
  destination,
  currentLocation,
}: MapboxRouteProps) {
  const { mapContainer, style, setStyle, hasToken } = useMapboxRoute(
    origin,
    destination,
    currentLocation
  )

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border">
      <div ref={mapContainer} className="absolute inset-0" />

      {!hasToken && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/80 backdrop-blur-sm">
          <p className="font-medium text-muted-foreground">
            Mapbox Token Missing in .env.local
          </p>
        </div>
      )}

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-md"
          onClick={() =>
            setStyle((s) =>
              s === "satellite-v9"
                ? "dark-v11"
                : s === "dark-v11"
                  ? "streets-v12"
                  : "satellite-v9"
            )
          }
        >
          <Layers className="mr-2 h-4 w-4" />
          Toggle Style
        </Button>
      </div>
    </div>
  )
}
