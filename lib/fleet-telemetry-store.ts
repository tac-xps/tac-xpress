import type { VehicleData } from "@/lib/fleet-telemetry"
import { FLEET_TELEMETRY_STALE_AFTER_MS } from "@/lib/fleet-telemetry"

class FleetTelemetryStore {
  private vehicles = new Map<string, VehicleData>()

  listVehicleStates(now = Date.now()) {
    const freshVehicles = Array.from(this.vehicles.values()).filter(
      (vehicle) => {
        if (!vehicle.timestamp) {
          return true
        }

        const timestamp = new Date(vehicle.timestamp).getTime()
        if (Number.isNaN(timestamp)) {
          return true
        }

        return now - timestamp <= FLEET_TELEMETRY_STALE_AFTER_MS
      }
    )

    for (const vehicle of freshVehicles) {
      this.vehicles.set(vehicle.id, vehicle)
    }

    return freshVehicles.sort((left, right) => left.id.localeCompare(right.id))
  }

  updateVehicleState(payload: VehicleData) {
    const existing = this.vehicles.get(payload.id)
    this.vehicles.set(payload.id, {
      ...existing,
      ...payload,
    })
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __fleetTelemetryStore: FleetTelemetryStore | undefined
}

export const fleetTelemetryStore =
  globalThis.__fleetTelemetryStore ?? new FleetTelemetryStore()

if (!globalThis.__fleetTelemetryStore) {
  globalThis.__fleetTelemetryStore = fleetTelemetryStore
}
