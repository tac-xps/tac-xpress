import { NextResponse } from "next/server"
import { z } from "zod"
import { verifyMobileClient } from "@/lib/auth/verify-mobile-client"
import { requireDashboardApi } from "@/lib/auth/guards"
import { fleetTelemetryStore } from "@/lib/fleet-telemetry-store"

export const dynamic = "force-dynamic"

export const telemetrySchema = z.object({
  vehicleId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  heading: z.number(),
  speed: z.number(),
  timestamp: z.string().datetime(),
})

/**
 * Note on Telemetry Storage:
 * Currently, fleetTelemetryStore is an in-memory Map. In a Vercel serverless environment, 
 * this data will not persist across different container invocations or regions. 
 * For production reliability with continuous telemetry, this should be migrated to Upstash Redis 
 * or Supabase Realtime/Postgres.
 */
export async function POST(request: Request) {
  // 1. Security Check
  const authErrorResponse = verifyMobileClient(request)
  if (authErrorResponse) return authErrorResponse

  try {
    // 2. Parse JSON Body
    const body = await request.json()

    // 3. Validate Payload
    const result = telemetrySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Bad Request", details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data

    // 4. Update Engine State
    fleetTelemetryStore.updateVehicleState({
      id: data.vehicleId,
      lat: data.latitude,
      lng: data.longitude,
      heading: data.heading,
      speed: data.speed,
      timestamp: data.timestamp,
    })

    // 5. Return Success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Telemetry Endpoint Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const authResult = await requireDashboardApi()
  if (!authResult.ok) {
    return authResult.response
  }

  return NextResponse.json({
    success: true,
    data: fleetTelemetryStore.listVehicleStates(),
  })
}
