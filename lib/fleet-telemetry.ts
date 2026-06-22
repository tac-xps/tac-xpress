export interface VehicleData {
  id: string
  lat: number
  lng: number
  heading: number
  speed?: number
  timestamp?: string
}

export const FLEET_TELEMETRY_STALE_AFTER_MS = 15 * 60 * 1000
