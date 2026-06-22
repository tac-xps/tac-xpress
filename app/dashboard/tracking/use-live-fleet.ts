import { useEffect, useState } from "react"
import type { VehicleData } from "@/lib/fleet-telemetry"

export type ConnectionStatus = "connecting" | "live" | "disconnected"

export function useLiveFleet() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting")
  const [vehicles, setVehicles] = useState<VehicleData[]>([])

  useEffect(() => {
    let isMounted = true

    const fetchTelemetry = async () => {
      try {
        const response = await fetch("/api/fleet/telemetry", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Telemetry request failed with ${response.status}`)
        }

        const payload = (await response.json()) as {
          data?: VehicleData[]
        }

        if (!isMounted) {
          return
        }

        setVehicles(payload.data || [])
        setConnectionStatus("live")
      } catch (error) {
        if (!isMounted) {
          return
        }

        setConnectionStatus("disconnected")
      }
    }

    void fetchTelemetry()
    const poller = window.setInterval(() => {
      void fetchTelemetry()
    }, 5_000)

    return () => {
      isMounted = false
      window.clearInterval(poller)
    }
  }, [])

  return {
    vehicles,
    connectionStatus,
  }
}
