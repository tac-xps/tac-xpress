import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hubs } from "@/lib/db/schema"
import { and, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { requireDashboardApi } from "@/lib/auth/guards"
import { lookupParams, LookupInputError } from "@/lib/server/lookup-params"
import * as Sentry from "@sentry/nextjs"
export async function GET(request: Request) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  try {
    const { id, pattern } = lookupParams(request)
    const rows = await db.select({ id: hubs.id, name: hubs.name, location: hubs.location }).from(hubs).where(and(isNull(hubs.deletedAt), or(ilike(hubs.name, pattern), ilike(hubs.location, pattern), id ? eq(hubs.id, id) : undefined))).orderBy(id ? sql`case when ${hubs.id} = ${id} then 0 else 1 end` : hubs.name, hubs.name, hubs.id).limit(20)
    return NextResponse.json(rows, { headers: { "Cache-Control": "private, no-store" } })
  } catch (error) { if (error instanceof LookupInputError) return NextResponse.json({ error: error.message }, { status: 400 }); Sentry.captureException(error, { tags: { area: "hubs_lookup" } }); return NextResponse.json({ error: "Unable to load hubs." }, { status: 500 }) }
}


