import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { requireDashboardApi } from "@/lib/auth/guards"
import { lookupParams, LookupInputError } from "@/lib/server/lookup-params"
import {
  customerLookupTiming,
  customerLookupTimingEnabled,
  timeCustomerQuery,
} from "@/lib/server/customer-lookup-timing"
import * as Sentry from "@sentry/nextjs"

async function lookupCustomers(request: Request) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response

  try {
    const { id, pattern } = lookupParams(request)
    const rows = await timeCustomerQuery("lookup", (annotate) =>
      db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        pinCode: users.pinCode,
        city: users.city,
        state: users.state,
      })
        .from(users)
        .where(annotate(and(
          eq(users.role, "customer"),
          isNull(users.deletedAt),
          or(
            ilike(users.name, pattern),
            ilike(users.email, pattern),
            ilike(users.phone, pattern),
            id ? eq(users.id, id) : undefined
          )
        )))
        .orderBy(
          id ? sql`case when ${users.id} = ${id} then 0 else 1 end` : users.name,
          users.name,
          users.id
        )
        .limit(15)
    )
    const timing = customerLookupTiming.getStore()
    const responseStarted = timing ? performance.now() : 0
    const response = NextResponse.json(rows, {
      headers: { "Cache-Control": "private, no-store" },
    })
    if (timing) timing.durations.response = performance.now() - responseStarted
    return response
  } catch (error) {
    if (error instanceof LookupInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    Sentry.captureException(error, { tags: { area: "customers_lookup" } })
    return NextResponse.json({ error: "Unable to load customers." }, { status: 500 })
  }
}

export async function GET(request: Request) {
  if (!customerLookupTimingEnabled) return lookupCustomers(request)

  const started = performance.now()
  const proxyId = request.headers.get("x-customer-lookup-id")
  const id = proxyId && /^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/.test(proxyId)
    ? proxyId
    : crypto.randomUUID()
  const durations: Record<string, number> = {}
  return customerLookupTiming.run({ id, durations }, async () => {
    let status = 500
    try {
      const response = await lookupCustomers(request)
      status = response.status
      response.headers.set("x-customer-lookup-id", id)
      return response
    } finally {
      durations.route = performance.now() - started
      console.info(JSON.stringify({
        event: "customer-lookup-route",
        id,
        status,
        durationsMs: Object.fromEntries(
          Object.entries(durations).map(([phase, ms]) => [phase, Math.round(ms * 10) / 10])
        ),
      }))
    }
  })
}
