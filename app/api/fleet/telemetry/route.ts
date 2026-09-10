import { NextResponse } from "next/server"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"
import { verifyMobileClient } from "@/lib/auth/verify-mobile-client"
import { requireDashboardApi } from "@/lib/auth/guards"
import { fleetTelemetryStore } from "@/lib/fleet-telemetry-store"
import { readBoundedJson } from "@/lib/server/read-json"
export const dynamic = "force-dynamic"
const telemetrySchema = z.object({
  vehicleId: z.string().trim().min(1).max(64),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  heading: z.number().min(0).lt(360),
  speed: z.number().min(0).max(400),
  timestamp: z.string().datetime(),
})
export async function POST(request: Request) {
  const denied = verifyMobileClient(request)
  if (denied) return denied
  const parsed = telemetrySchema.safeParse(await readBoundedJson(request, 8000))
  if (
    !parsed.success ||
    new Date(parsed.data.timestamp).getTime() > Date.now() + 5 * 60_000
  )
    return NextResponse.json(
      { error: "Invalid telemetry coordinates or timestamp." },
      { status: 400 }
    )
  try {
    const data = parsed.data
    const result = await fleetTelemetryStore.updateVehicleState({
      id: data.vehicleId,
      lat: data.latitude,
      lng: data.longitude,
      heading: data.heading,
      speed: data.speed,
      timestamp: data.timestamp,
    })
    return NextResponse.json(
      { success: true, ...result },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "fleet_telemetry" } })
    return NextResponse.json(
      {
        error: "Unable to record telemetry. Verify that the vehicle is active.",
      },
      { status: 503 }
    )
  }
}
export async function GET() {
  const auth = await requireDashboardApi()
  if (!auth.ok) return auth.response
  try {
    return NextResponse.json(
      { success: true, data: await fleetTelemetryStore.listVehicleStates() },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "fleet_telemetry" } })
    return NextResponse.json(
      { error: "Fleet positions are temporarily unavailable." },
      { status: 503 }
    )
  }
}
