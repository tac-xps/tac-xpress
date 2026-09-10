import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { drivers } from "@/lib/db/schema"
import { and, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { requireDashboardApi } from "@/lib/auth/guards"
import { lookupParams, LookupInputError } from "@/lib/server/lookup-params"
import * as Sentry from "@sentry/nextjs"
export async function GET(request: Request) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  try {
    const { id, pattern } = lookupParams(request)
    const rows = await db.select({ id: drivers.id, name: drivers.name, phone: drivers.phone, licenseNumber: drivers.licenseNumber }).from(drivers).where(and(isNull(drivers.deletedAt), eq(drivers.status, "active"), or(ilike(drivers.name, pattern), ilike(drivers.phone, pattern), ilike(drivers.licenseNumber, pattern), id ? eq(drivers.id, id) : undefined))).orderBy(id ? sql`case when ${drivers.id} = ${id} then 0 else 1 end` : drivers.name, drivers.name, drivers.id).limit(15)
    return NextResponse.json(rows, { headers: { "Cache-Control": "private, no-store" } })
  } catch (error) { if (error instanceof LookupInputError) return NextResponse.json({ error: error.message }, { status: 400 }); Sentry.captureException(error, { tags: { area: "drivers_lookup" } }); return NextResponse.json({ error: "Unable to load drivers." }, { status: 500 }) }
}


