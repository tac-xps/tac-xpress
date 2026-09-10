import { describe, expect, it, vi } from "vitest"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "@/lib/db/schema"
vi.mock("server-only", () => ({}))
vi.mock("@/lib/db", async () => {
  const { drizzle } = await import("drizzle-orm/postgres-js")
  return { db: drizzle.mock() }
})
const { publicTrackingQuery } = await import("@/lib/tracking/public-query")
const { shipmentOwnerFilter, invoiceOwnerFilter } =
  await import("@/lib/auth/portal-ownership")

describe("public and customer data boundaries", () => {
  it("public tracking requires a published event and excludes personal fields", () => {
    const query = publicTrackingQuery("AWB-12345").toSQL()
    expect(query.sql).toContain('"tracking_events"."is_public" = $1')
    expect(query.sql).toContain('"shipments"."deleted_at" is null')
    expect(query.params).toEqual([true, "AWB-12345", 100])
    expect(query.sql).not.toMatch(
      /consignor|consignee|notes|amount|"shipments"\."status"/
    )
    expect(query.sql).toContain('"tracking_events"."status"')
  })
  it("AWB inputs are SQL parameters", () => {
    const input = "' OR true --"
    const query = publicTrackingQuery(input).toSQL()
    expect(query.sql).not.toContain(input)
    expect(query.params).toContain(input)
  })
  it("shipment access matches a verified sender or recipient and excludes deleted records", () => {
    const query = drizzle
      .mock()
      .select()
      .from(schema.shipments)
      .where(shipmentOwnerFilter("Sender@Example.com"))
      .toSQL()
    expect(query.sql).toContain('lower("shipments"."consignor_email") = $1')
    expect(query.sql).toContain('lower("shipments"."consignee_email") = $2')
    expect(query.sql).toContain('"shipments"."deleted_at" is null')
    expect(query.params).toEqual(["sender@example.com", "sender@example.com"])
  })
  it("invoice ownership only permits the sender", () => {
    const query = drizzle
      .mock()
      .select({ id: schema.shipments.id })
      .from(schema.shipments)
      .where(invoiceOwnerFilter("sender@example.com"))
      .toSQL()
    expect(query.sql).toContain('"consignor_email"')
    expect(query.sql).not.toContain('"consignee_email"')
  })
})
