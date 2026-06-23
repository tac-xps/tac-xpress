import type { VehicleData } from "@/lib/fleet-telemetry"
import { FLEET_TELEMETRY_STALE_AFTER_MS } from "@/lib/fleet-telemetry"

class FleetTelemetryStore {
  private vehicles = new Map<string, VehicleData>()

  listVehicleStates(now = Date.now()) {
    for (const [id, vehicle] of this.vehicles.entries()) {
      if (!vehicle.timestamp) continue
      const timestamp = new Date(vehicle.timestamp).getTime()
      if (!Number.isNaN(timestamp) && now - timestamp > FLEET_TELEMETRY_STALE_AFTER_MS) {
        this.vehicles.delete(id)
      }
    }

    return Array.from(this.vehicles.values()).sort((left, right) => left.id.localeCompare(right.id))
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
