import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { vehicles } from "@/lib/db/schema"
import { and, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { requireDashboardApi } from "@/lib/auth/guards"
import { lookupParams, LookupInputError } from "@/lib/server/lookup-params"
import * as Sentry from "@sentry/nextjs"
export async function GET(request: Request) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  try {
    const { id, pattern } = lookupParams(request)
    const rows = await db.select({ id: vehicles.id, registrationNumber: vehicles.registrationNumber, capacityKg: vehicles.capacityKg }).from(vehicles).where(and(isNull(vehicles.deletedAt), eq(vehicles.status, "active"), or(ilike(vehicles.registrationNumber, pattern), id ? eq(vehicles.id, id) : undefined))).orderBy(id ? sql`case when ${vehicles.id} = ${id} then 0 else 1 end` : vehicles.registrationNumber, vehicles.registrationNumber, vehicles.id).limit(15)
    return NextResponse.json(rows, { headers: { "Cache-Control": "private, no-store" } })
  } catch (error) { if (error instanceof LookupInputError) return NextResponse.json({ error: error.message }, { status: 400 }); Sentry.captureException(error, { tags: { area: "vehicles_lookup" } }); return NextResponse.json({ error: "Unable to load vehicles." }, { status: 500 }) }
}


