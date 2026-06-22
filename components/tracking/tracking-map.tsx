"use client"

import React, { useState } from "react"
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
} from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { Package, MapPin } from "lucide-react"
import { useTheme } from "next-themes"

const INITIAL_VIEW_STATE = {
  longitude: 74.5,
  latitude: 23.5,
  zoom: 4,
}

const ROUTE_COORDS = [
  [77.209, 28.6139], // Delhi
  [74.0, 25.0], // Transit
  [72.8777, 19.076], // Mumbai
]

export function TrackingMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"
  const mapStyle =
    mounted && isDark
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

  const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: ROUTE_COORDS,
    },
  }

  return (
    <div className="absolute inset-0 z-0">
      <Map
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapLib={maplibregl}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        interactive={true}
      >
        <NavigationControl position="bottom-right" />

        <Source id="routeLine" type="geojson" data={routeGeoJSON}>
          <Layer
            id="routeLayer"
            type="line"
            source="routeLine"
            paint={{
              "line-color": "#10b981",
              "line-width": 3,
              "line-dasharray": [2, 2],
            }}
          />
        </Source>

        {/* Origin */}
        <Marker
          longitude={ROUTE_COORDS[0][0]}
          latitude={ROUTE_COORDS[0][1]}
          anchor="bottom"
        >
          <div className="rounded-full bg-background/80 p-1.5 ring-2 ring-border backdrop-blur-md">
            <MapPin className="size-4 text-muted-foreground" />
          </div>
        </Marker>

        {/* Current Location */}
        <Marker
          longitude={ROUTE_COORDS[2][0]}
          latitude={ROUTE_COORDS[2][1]}
          anchor="bottom"
        >
          <div className="animate-pulse rounded-full bg-status-delivered/20 p-2 ring-2 ring-status-delivered/50 backdrop-blur-md">
            <Package className="size-5 text-status-delivered" />
          </div>
        </Marker>
      </Map>
      {/* Vignette overlay for blending */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_var(--color-background)_100%)] opacity-80" />
    </div>
  )
}
