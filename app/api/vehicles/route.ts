import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { vehicles } from "@/lib/db/schema"
import { isNull, and, or, ilike } from "drizzle-orm"
import { requireDashboardApi } from "@/lib/auth/guards"
import * as Sentry from "@sentry/nextjs"

export async function GET(request: Request) {
  try {
    const authResult = await requireDashboardApi()
    if (!authResult.ok) return authResult.response

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""

    if (!query) {
      const recentVehicles = await db
        .select({
          id: vehicles.id,
          registrationNumber: vehicles.registrationNumber,
          capacityKg: vehicles.capacityKg,
        })
        .from(vehicles)
        .where(isNull(vehicles.deletedAt))
        .limit(10)

      return NextResponse.json(recentVehicles)
    }

    const searchPattern = `%${query}%`
    const finalResults = await db
      .select({
        id: vehicles.id,
        registrationNumber: vehicles.registrationNumber,
        capacityKg: vehicles.capacityKg,
      })
      .from(vehicles)
      .where(
        and(
          isNull(vehicles.deletedAt),
          or(ilike(vehicles.registrationNumber, searchPattern))
        )
      )
      .limit(10)

    return NextResponse.json(finalResults)
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "vehicles_api" } })
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    )
  }
}
