import "server-only"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { queryRows } from "@/lib/jobs/store"
import type { VehicleData } from "@/lib/fleet-telemetry"
import { FLEET_TELEMETRY_STALE_AFTER_MS } from "@/lib/fleet-telemetry"

export const fleetTelemetryStore = {
  async listVehicleStates(now = Date.now()): Promise<VehicleData[]> {
    const result = await db.execute(
      sql`select t.vehicle_id as id, t.latitude as lat, t.longitude as lng, t.heading, t.speed, t.observed_at as timestamp from fleet_telemetry t join vehicles v on v.id = t.vehicle_id where v.deleted_at is null and v.status = 'active' and t.observed_at >= ${new Date(now - FLEET_TELEMETRY_STALE_AFTER_MS).toISOString()}::timestamptz order by t.vehicle_id limit 1000`
    )
    return queryRows<VehicleData & { timestamp: Date | string }>(result).map(
      (row) => ({ ...row, timestamp: new Date(row.timestamp).toISOString() })
    )
  },
  async updateVehicleState(payload: VehicleData) {
    const vehicle = queryRows<{ id: string }>(
      await db.execute(
        sql`select id from vehicles where (id::text = ${payload.id} or registration_number = ${payload.id}) and deleted_at is null and status = 'active' limit 1`
      )
    )[0]
    if (!vehicle) throw new Error("Vehicle is not registered or active.")
    const result = await db.execute(
      sql`insert into fleet_telemetry (vehicle_id, latitude, longitude, heading, speed, observed_at) values (${vehicle.id}::uuid, ${payload.lat}, ${payload.lng}, ${payload.heading}, ${payload.speed ?? 0}, ${payload.timestamp}::timestamptz) on conflict (vehicle_id) do update set latitude = excluded.latitude, longitude = excluded.longitude, heading = excluded.heading, speed = excluded.speed, observed_at = excluded.observed_at, received_at = now() where excluded.observed_at > fleet_telemetry.observed_at returning vehicle_id`
    )
    return { updated: queryRows(result).length > 0 }
  },
}
