import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { requireDashboardApi } from "@/lib/auth/guards"
import { lookupParams, LookupInputError } from "@/lib/server/lookup-params"
import * as Sentry from "@sentry/nextjs"
export async function GET(request: Request) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  try {
    const { id, pattern } = lookupParams(request)
    const rows = await db.select({ id: users.id, name: users.name, email: users.email, phone: users.phone, address: users.address, pinCode: users.pinCode, city: users.city, state: users.state }).from(users).where(and(eq(users.role, "customer"), isNull(users.deletedAt), or(ilike(users.name, pattern), ilike(users.email, pattern), ilike(users.phone, pattern), id ? eq(users.id, id) : undefined))).orderBy(id ? sql`case when ${users.id} = ${id} then 0 else 1 end` : users.name, users.name, users.id).limit(15)
    return NextResponse.json(rows, { headers: { "Cache-Control": "private, no-store" } })
  } catch (error) { if (error instanceof LookupInputError) return NextResponse.json({ error: error.message }, { status: 400 }); Sentry.captureException(error, { tags: { area: "customers_lookup" } }); return NextResponse.json({ error: "Unable to load customers." }, { status: 500 }) }
}


