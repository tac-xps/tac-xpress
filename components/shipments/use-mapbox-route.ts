import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

const MOCK_COORDS: Record<string, [number, number]> = {
  Singapore: [103.8198, 1.3521],
  Rotterdam: [4.47917, 51.9225],
  "Long Beach": [-118.1937, 33.7701],
  "Los Angeles": [-118.2437, 34.0522],
}

export function useMapboxRoute(
  origin: string,
  destination: string,
  currentLocation?: [number, number]
) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [style, setStyle] = useState<
    "streets-v12" | "satellite-v9" | "dark-v11"
  >("satellite-v9")
  const [hasToken, setHasToken] = useState(!!mapboxgl.accessToken)

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return

    const startCoords = MOCK_COORDS[origin] || [103.8198, 1.3521]
    const endCoords = MOCK_COORDS[destination] || [4.47917, 51.9225]
    const current = currentLocation || startCoords

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${style}`,
        center: current,
        zoom: 2,
        projection: "globe",
      })

      map.current.on("style.load", () => {
        map.current?.setFog({})
      })

      map.current.on("load", () => {
        if (!map.current) return

        // Draw Route Line
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [startCoords, endCoords],
            },
          },
        })

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#10b981", // primary token
            "line-width": 4,
            "line-dasharray": [2, 2],
          },
        })

        // Origin Marker
        new mapboxgl.Marker({ color: "#9ca3af" })
          .setLngLat(startCoords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${origin}</h4>`)
          )
          .addTo(map.current)

        // Destination Marker
        new mapboxgl.Marker({ color: "#9ca3af" })
          .setLngLat(endCoords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h4>${destination}</h4>`
            )
          )
          .addTo(map.current)

        // Current Location Pulsing Marker
        const el = document.createElement("div")
        el.className =
          "w-4 h-4 bg-primary/80 rounded-full border-2 border-white shadow-lg animate-ping"

        const staticEl = document.createElement("div")
        staticEl.className =
          "w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg relative"
        staticEl.appendChild(el)

        new mapboxgl.Marker(staticEl).setLngLat(current).addTo(map.current)

        // Fit Bounds
        const bounds = new mapboxgl.LngLatBounds(startCoords, startCoords)
        bounds.extend(endCoords)
        map.current.fitBounds(bounds, { padding: 50 })
      })
    }

    return () => {
      // Cleanup happens when component unmounts
    }
  }, []) // Run once on mount

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${style}`)
    }
  }, [style])

  return { mapContainer, style, setStyle, hasToken }
}
