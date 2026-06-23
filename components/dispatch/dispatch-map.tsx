"use client"

import React, { useState } from "react"
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { Truck, MapPin } from "lucide-react"
import { useTheme } from "next-themes"

const INITIAL_VIEW_STATE = {
  longitude: 79.0,
  latitude: 22.5,
  zoom: 4.2,
}

type MarkerType = {
  id: string
  longitude: number
  latitude: number
  type: "hub" | "truck"
  name?: string
  route?: string
}

const MARKERS: MarkerType[] = [
  {
    id: "M1",
    longitude: 77.209,
    latitude: 28.6139,
    type: "hub",
    name: "DEL Hub",
  },
  {
    id: "M2",
    longitude: 93.9368,
    latitude: 24.817,
    type: "hub",
    name: "IMF Hub",
  },
]

const routeGeojson = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: [
      [77.209, 28.6139], // DEL
      [93.9368, 24.817], // IMF
    ],
  },
}

export function DispatchMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="absolute inset-0 z-0 flex animate-pulse items-center justify-center bg-muted/20">
        <MapPin className="size-8 animate-bounce text-muted-foreground/30" />
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"
  const mapStyle = isDark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

  return (
    <div className="absolute inset-0 z-0">
      <Map
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapLib={maplibregl}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {/* Route Line */}
        <Source id="route" type="geojson" data={routeGeojson as any}>
          <Layer
            id="route-line"
            type="line"
            source="route"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "#3b82f6",
              "line-width": 4,
              "line-opacity": 0.8,
            }}
          />
        </Source>

        {MARKERS.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
          >
            {marker.type === "hub" ? (
              <div className="group flex cursor-pointer flex-col items-center">
                <div className="rounded-full bg-primary/20 p-2 ring-2 ring-primary/50 backdrop-blur-md">
                  <MapPin className="size-5 text-primary" />
                </div>
                <span className="mt-1 rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold text-foreground opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100">
                  {marker.name}
                </span>
              </div>
            ) : (
              <div className="group flex animate-bounce cursor-pointer flex-col items-center">
                <div className="rounded-full bg-primary/20 p-1.5 ring-2 ring-primary/50 backdrop-blur-md">
                  <Truck className="size-4 text-primary" />
                </div>
                <span className="mt-1 rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold text-primary opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100">
                  {marker.route}
                </span>
              </div>
            )}
          </Marker>
        ))}
      </Map>
      {/* Vignette overlay for blending */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_var(--background)_100%)] opacity-80" />
    </div>
  )
}
