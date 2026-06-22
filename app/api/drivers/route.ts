import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { drivers } from "@/lib/db/schema"
import { isNull, and, or, ilike } from "drizzle-orm"
import { requireDashboardApi } from "@/lib/auth/guards"

export async function GET(request: Request) {
  try {
    const authResult = await requireDashboardApi()
    if (!authResult.ok) return authResult.response

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""

    if (!query) {
      // If no query, return recent active drivers
      const recentDrivers = await db
        .select({
          id: drivers.id,
          name: drivers.name,
          phone: drivers.phone,
          licenseNumber: drivers.licenseNumber,
        })
        .from(drivers)
        .where(isNull(drivers.deletedAt))
        .limit(10)

      return NextResponse.json(recentDrivers)
    }

    const searchPattern = `%${query}%`
    const finalResults = await db
      .select({
        id: drivers.id,
        name: drivers.name,
        phone: drivers.phone,
        licenseNumber: drivers.licenseNumber,
      })
      .from(drivers)
      .where(
        and(
          isNull(drivers.deletedAt),
          or(
            ilike(drivers.name, searchPattern),
            ilike(drivers.phone, searchPattern),
            ilike(drivers.licenseNumber, searchPattern)
          )
        )
      )
      .limit(10)

    return NextResponse.json(finalResults)
  } catch (error) {
    console.error("Error fetching drivers:", error)
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    )
  }
}
