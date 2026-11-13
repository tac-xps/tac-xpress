import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import {
  DASHBOARD_ROLES,
  isWorkspaceUserId,
  readDashboardApiSession,
} from "@/lib/auth/guards"
import { lookupParams, LookupInputError } from "@/lib/server/lookup-params"
import {
  customerLookupTiming,
  customerLookupTimingEnabled,
  timeCustomerQuery,
} from "@/lib/server/customer-lookup-timing"
import * as Sentry from "@sentry/nextjs"

async function lookupCustomers(request: Request) {
  const session = await readDashboardApiSession()
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isWorkspaceUserId(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let criteria: ReturnType<typeof lookupParams> | undefined
  let inputError: LookupInputError | undefined
  try {
    criteria = lookupParams(request)
  } catch (error) {
    if (!(error instanceof LookupInputError)) throw error
    inputError = error
  }

  try {
    const staff = alias(users, "lookup_staff")
    const results = await timeCustomerQuery((annotate) => {
      const matches = db.select({
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
        .where(criteria ? and(
          eq(users.role, "customer"),
          isNull(users.deletedAt),
          or(
            ilike(users.name, criteria.pattern),
            ilike(users.email, criteria.pattern),
            ilike(users.phone, criteria.pattern),
            criteria.id ? eq(users.id, criteria.id) : undefined
          )
        ) : sql`false`)
        .orderBy(
          criteria?.id ? sql`case when ${users.id} = ${criteria.id} then 0 else 1 end` : users.name,
          users.name,
          users.id
        )
        .limit(15)
        .as("matches")

      return db.select({
        customer: {
          id: matches.id,
          name: matches.name,
          email: matches.email,
          phone: matches.phone,
          address: matches.address,
          pinCode: matches.pinCode,
          city: matches.city,
          state: matches.state,
        },
      })
        .from(staff)
        .leftJoinLateral(matches, sql`true`)
        .where(annotate(and(
          eq(staff.id, userId),
          isNull(staff.deletedAt),
          inArray(staff.role, DASHBOARD_ROLES)
        )))
        .orderBy(
          criteria?.id ? sql`case when ${matches.id} = ${criteria.id} then 0 else 1 end` : matches.name,
          matches.name,
          matches.id
        )
    })
    if (!results.length) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (inputError) {
      return NextResponse.json({ error: inputError.message }, { status: 400 })
    }
    const timing = customerLookupTiming.getStore()
    const responseStarted = timing ? performance.now() : 0
    const rows = results.flatMap(({ customer }) => customer ? [customer] : [])
    const response = NextResponse.json(rows, {
      headers: { "Cache-Control": "private, no-store" },
    })
    if (timing) timing.durations.response = performance.now() - responseStarted
    return response
  } catch (error) {
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
