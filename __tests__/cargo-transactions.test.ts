import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { createRequire } from "node:module"
import { readFile } from "node:fs/promises"
import { drizzle } from "drizzle-orm/pglite"
import { getTableConfig, PgDialect } from "drizzle-orm/pg-core"
import { eq, SQL } from "drizzle-orm"
import * as schema from "@/lib/db/schema"

// Reuse the embedded PostgreSQL dependency already installed with gbrain.
// These tests do not read environment files or connect to a hosted database.
const require = createRequire(import.meta.url)
const { PGlite } = createRequire(require.resolve("gbrain"))(
  "@electric-sql/pglite"
)
const client = new PGlite()
const database = drizzle(client, { schema })
const state = vi.hoisted(() => ({ db: undefined as unknown }))
vi.mock("server-only", () => ({}))
vi.mock("@/lib/db", () => ({
  get db() {
    return state.db
  },
}))
vi.mock("@/lib/supabase/clients", () => ({
  supabaseAdmin: {
    from: () => {
      throw new Error("Unexpected external audit write")
    },
  },
}))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn(), captureMessage: vi.fn(), startSpan: (_options: unknown, callback: () => unknown) => callback() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/lib/auth/guards", () => ({
  requireDashboardSession: async () => ({
    user: {
      id: "11111111-1111-4111-8111-111111111111",
      email: "staff@example.test",
      role: "staff",
    },
  }),
}))
vi.mock("@/lib/safe-action", () => ({
  authActionClient: {
    schema: (validator: { parse: (input: unknown) => unknown }) => ({
      action:
        (handler: (args: unknown) => Promise<unknown>) => (input: unknown) =>
          handler({
            parsedInput: validator.parse(input),
            ctx: {
              session: {
                user: {
                  id: "11111111-1111-4111-8111-111111111111",
                  email: "staff@example.test",
                },
              },
            },
          }),
    }),
  },
}))

import {
  createShipmentAction,
  createTrackingEventAction,
  updateShipmentAction,
  deleteShipmentAction,
} from "@/app/dashboard/shipments/actions"
import {
  createManifestAction,
  scanShipmentAction,
  updateManifestAction,
  deleteManifestAction,
} from "@/app/dashboard/manifests/actions"
import {
  createDispatchRunAction,
  startDispatchRunAction,
  completeDispatchRunAction,
  updateDispatchRunAction,
  deleteDispatchRunAction,
} from "@/app/dashboard/dispatch/actions"
import { logAuditInTransaction } from "@/lib/audit"
import { createStoredInvoice, updateStoredInvoice, voidStoredInvoice } from "@/lib/invoices/persistence"
import { saveContactTicket } from "@/lib/support/create-ticket"
import { saveInboundMessage } from "@/lib/whatsapp/inbound-store"
import { createWizardInvoiceAction } from "@/app/dashboard/invoices/actions"
import { fleetTelemetryStore } from "@/lib/fleet-telemetry-store"
import { claimJob, finishJob } from "@/lib/jobs/store"
import { recordDeliveryReceipt } from "@/lib/whatsapp/delivery-status"
import { updateScannedShipmentStatus } from "@/app/actions/scanner-actions"

const staffId = "11111111-1111-4111-8111-111111111111"
const customerId = "22222222-2222-4222-8222-222222222222"
const driverId = "33333333-3333-4333-8333-333333333333"
const vehicleId = "44444444-4444-4444-8444-444444444444"
const originHubId = "55555555-5555-4555-8555-555555555555"
const destinationHubId = "66666666-6666-4666-8666-666666666666"
const invoiceActor = { id: staffId, email: "staff@example.test" }
const cargo = {
  origin: "Delhi",
  destination: "Mumbai",
  serviceType: "express_air" as const,
  weightKg: 1,
}
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`

beforeAll(async () => {
  state.db = database
  const dialect = new PgDialect()
  for (const value of [
    schema.roleEnum,
    schema.shipmentStatusEnum,
    schema.serviceTypeEnum,
    schema.idProofTypeEnum,
    schema.natureOfGoodsEnum,
    schema.itemConditionEnum,
    schema.packagingTypeEnum,
    schema.manifestStatusEnum,
    schema.hubTypeEnum,
    schema.vehicleStatusEnum,
    schema.driverStatusEnum,
    schema.invoiceStatusEnum,
    schema.whatsappStatusEnum,
    schema.paymentModeEnum,
    schema.ticketStatusEnum,
  ]) {
    await client.exec(
      `create type "${value.enumName}" as enum (${value.enumValues.map(quote).join(",")})`
    )
  }
  // Materialize only the operational tables needed by the real action handlers.
  for (const table of [
    schema.users,
    schema.shipments,
    schema.drivers,
    schema.vehicles,
    schema.hubs,
    schema.manifests,
    schema.manifestItems,
    schema.trackingEvents,
    schema.invoices,
    schema.tickets,
    schema.ticketReplies,
    schema.whatsappSubscribers,
    schema.messageOutbound,
  ]) {
    const config = getTableConfig(table)
    const columns = config.columns.map((column) => {
      const value = column.default
      const defaultSql =
        value === undefined
          ? ""
          : ` default ${value instanceof SQL ? dialect.sqlToQuery(value).sql : typeof value === "string" ? quote(value) : String(value)}`
      return `"${column.name}" ${column.getSQLType()}${defaultSql}${column.primary ? " primary key" : ""}${column.notNull ? " not null" : ""}${column.isUnique ? " unique" : ""}`
    })
    const foreignKeys = config.foreignKeys.map((key) => {
      const reference = key.reference()
      return `foreign key (${reference.columns.map((column) => `"${column.name}"`).join(",")}) references "${getTableConfig(reference.foreignTable).name}" (${reference.foreignColumns.map((column) => `"${column.name}"`).join(",")}) on delete ${key.onDelete}`
    })
    await client.exec(
      `create table "${config.name}" (${[...columns, ...foreignKeys].join(",")})`
    )
  }
  await client.exec(
    "create unique index manifest_items_manifest_shipment_unique on manifest_items(manifest_id, shipment_id)"
  )
  await client.exec(
    await readFile(
      new URL("../supabase/migrations/0010_audit_log.sql", import.meta.url),
      "utf8"
    )
  )
  const hardening = await readFile(
    new URL(
      "../supabase/migrations/0019_enterprise_hardening.sql",
      import.meta.url
    ),
    "utf8"
  )
  await client.exec(hardening.match(/ALTER TABLE audit_log[\s\S]*?;/)![0])
  await client.exec("create role anon; create role authenticated; create role service_role bypassrls")
  await client.exec(await readFile(new URL("../supabase/migrations/20260907233111_durable_communication_jobs.sql", import.meta.url), "utf8"))
  await client.exec(await readFile(new URL("../supabase/migrations/20260908000855_durable_fleet_telemetry.sql", import.meta.url), "utf8"))
}, 30_000)

beforeEach(async () => {
  await client.exec(
    "alter table audit_log drop constraint if exists test_audit_failure"
  )
  await client.exec(
    "truncate background_jobs, email_notifications, dead_letter_queue, message_outbound, ticket_replies, whatsapp_subscribers, tickets, invoices, audit_log, tracking_events, manifest_items, manifests, shipments, vehicles, drivers, hubs, users cascade"
  )
  await database.insert(schema.users).values([
    { id: staffId, role: "staff" },
    { id: customerId, role: "customer" },
  ])
  await database.insert(schema.drivers).values({
    id: driverId,
    name: "Driver",
    phone: "9999999999",
    licenseNumber: "TEST-LICENSE",
  })
  await database.insert(schema.vehicles).values({
    id: vehicleId,
    registrationNumber: "TEST-VEHICLE",
    capacityKg: 1000,
  })
  await database.insert(schema.hubs).values([
    { id: originHubId, name: "Delhi hub", location: "Delhi" },
    { id: destinationHubId, name: "Mumbai hub", location: "Mumbai" },
  ])
})

afterAll(async () => {
  await client.close()
})

async function seedShipment(awbNumber = "TEST-AWB") {
  const [shipment] = await database
    .insert(schema.shipments)
    .values({
      ...cargo,
      customerId,
      awbNumber,
      dimensionsL: 10,
      dimensionsW: 10,
      dimensionsH: 10,
      chargedWeightKg: 1,
    })
    .returning()
  return shipment
}

describe("invoice persistence uses real PostgreSQL transactions", () => {
  it("reuses an existing active invoice when creation is retried", async () => {
    const shipment = await seedShipment()
    const first = await createStoredInvoice(shipment.id, 10000, invoiceActor)
    const retry = await createStoredInvoice(shipment.id, 10000, invoiceActor)
    expect(retry.id).toBe(first.id)
    expect(await database.select().from(schema.invoices)).toHaveLength(1)
    expect(first.pdfUrl).toBe(`/invoice/${first.id}`)
  })
  it("recalculates edits and ignores forged totals and tax splits", async () => {
    const shipment = await seedShipment()
    const invoice = await createStoredInvoice(shipment.id, 10000, invoiceActor)
    const result = await updateStoredInvoice(invoice.id, { freightCharge: 10000, docketCharge: 125, gstRate: 5, amount: 1, subtotal: 1, cgst: 999999, sgst: 999999, balanceDue: -100, advancePaid: 1000, status: "unpaid" }, invoiceActor)
    expect(result).toMatchObject({ subtotal: 10125, amount: 10631, advancePaid: 1000, balanceDue: 9631 })
    expect((result.cgst ?? 0) + (result.sgst ?? 0)).toBe(506)
  })
  it("rolls payment back when its audit insert fails", async () => {
    const shipment = await seedShipment()
    const invoice = await createStoredInvoice(shipment.id, 10000, invoiceActor)
    await client.exec("alter table audit_log add constraint test_audit_failure check (action <> 'invoice.payment_updated')")
    await expect(updateStoredInvoice(invoice.id, { amount: 10000, status: "paid" }, invoiceActor, { paymentOnly: true })).rejects.toThrow()
    const [saved] = await database.select().from(schema.invoices).where(eq(schema.invoices.id, invoice.id))
    expect(saved).toMatchObject({ status: "unpaid", advancePaid: 0, balanceDue: 10000 })
  })
  it("rejects stale payment amounts and preserves void financial records", async () => {
    const shipment = await seedShipment()
    const invoice = await createStoredInvoice(shipment.id, 10000, invoiceActor)
    await expect(updateStoredInvoice(invoice.id, { amount: 9999, status: "paid" }, invoiceActor, { paymentOnly: true })).rejects.toThrow(/changed/)
    await voidStoredInvoice(invoice.id, invoiceActor)
    const [saved] = await database.select().from(schema.invoices).where(eq(schema.invoices.id, invoice.id))
    expect(saved.status).toBe("void")
    await expect(updateStoredInvoice(invoice.id, { status: "paid" }, invoiceActor)).rejects.toThrow(/void/)
  })
})

describe("durable communication and receipt boundaries", () => {
  const contact = { customer_name: "Test contact", customer_email: "contact@example.test", subject: "Packing enquiry", message: "How should I prepare this shipment?", category: "general" as const }
  it("commits a contact and both background jobs together", async () => {
    const ticket = await saveContactTicket(contact)
    const jobs = await client.query("select kind, dedupe_key from background_jobs")
    expect(jobs.rows).toHaveLength(2)
    expect(jobs.rows.every((job: { dedupe_key: string }) => job.dedupe_key === ticket.id)).toBe(true)
  })
  it("rolls back contact intake if the outbox cannot be written", async () => {
    await client.exec("alter table background_jobs add constraint test_job_failure check (kind <> 'support_email')")
    try {
      await expect(saveContactTicket(contact)).rejects.toThrow()
      expect(await database.select().from(schema.tickets)).toHaveLength(0)
    } finally { await client.exec("alter table background_jobs drop constraint test_job_failure") }
  })
  it("leases each job once and rejects completion by a stale worker", async () => {
    await saveContactTicket(contact)
    const first = await claimJob()
    const second = await claimJob()
    expect(first?.id).not.toBe(second?.id)
    expect(await claimJob()).toBeNull()
    if (!first) throw new Error("Expected a queued job")
    await finishJob({ ...first, lease_token: crypto.randomUUID() }, true)
    const state = await client.query("select status from background_jobs where id = $1", [first.id])
    expect(state.rows[0]).toMatchObject({ status: "processing" })
    await finishJob(first, true)
    const completed = await client.query("select status from background_jobs where id = $1", [first.id])
    expect(completed.rows[0]).toMatchObject({ status: "completed" })
  })
  it("denies client roles direct access to the job payloads", async () => {
    await client.exec("set role authenticated")
    try { await expect(client.query("select * from background_jobs")).rejects.toThrow(/permission denied/) }
    finally { await client.exec("reset role") }
  })
  it("ignores reordered receipts and failed older invoice attempts", async () => {
    const shipment = await seedShipment()
    const invoice = await createStoredInvoice(shipment.id, 10000, invoiceActor)
    const [oldMessage] = await database.insert(schema.messageOutbound).values({ phone: "919999999999", body: "test", status: "sent", metaMessageId: "wamid.old", relatedInvoiceId: invoice.id, createdAt: new Date("2026-09-01"), lastStatusAt: new Date("2026-09-01") }).returning()
    const [latest] = await database.insert(schema.messageOutbound).values({ phone: "919999999999", body: "test", status: "sent", metaMessageId: "wamid.new", relatedInvoiceId: invoice.id, createdAt: new Date("2026-09-02"), lastStatusAt: new Date("2026-09-02") }).returning()
    await recordDeliveryReceipt({ id: "wamid.new", status: "delivered", timestamp: new Date("2026-09-03").getTime() / 1000 })
    await recordDeliveryReceipt({ id: "wamid.new", status: "sent", timestamp: new Date("2026-09-04").getTime() / 1000 })
    await recordDeliveryReceipt({ id: "wamid.old", status: "failed", timestamp: new Date("2026-09-05").getTime() / 1000 })
    const [saved] = await database.select().from(schema.invoices).where(eq(schema.invoices.id, invoice.id))
    const [receipt] = await database.select().from(schema.messageOutbound).where(eq(schema.messageOutbound.id, latest.id))
    expect(saved.whatsappStatus).toBe("sent")
    expect(receipt.status).toBe("delivered")
    expect(oldMessage.id).not.toBe(latest.id)
  })
})
async function seedLoad(
  shipmentId: string,
  referenceId = "DL-TEST",
  status: "draft" | "finalized" = "draft"
) {
  const [manifest] = await database
    .insert(schema.manifests)
    .values({
      referenceId,
      driverId,
      vehicleId,
      originHubId,
      destinationHubId,
      status,
    })
    .returning()
  await database
    .insert(schema.manifestItems)
    .values({ manifestId: manifest.id, shipmentId })
  return manifest
}
async function failAudits() {
  await client.exec(
    "alter table audit_log add constraint test_audit_failure check (false) not valid"
  )
}
async function shipmentState(id: string) {
  return database.query.shipments.findFirst({
    where: eq(schema.shipments.id, id),
  })
}

describe("cargo transactions against embedded PostgreSQL", () => {
  it("rolls back scanner status and its event when the audit fails, then permits a safe retry", async () => {
    const shipment = await seedShipment()
    await failAudits()
    expect(
      await updateScannedShipmentStatus(
        shipment.id,
        "in-transit",
        "Delhi hub",
        "Loaded for departure"
      )
    ).toMatchObject({ success: false })
    expect((await shipmentState(shipment.id))?.status).toBe("pending")
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(0)
    await client.exec(
      "alter table audit_log drop constraint test_audit_failure"
    )
    expect(
      await updateScannedShipmentStatus(
        shipment.id,
        "in-transit",
        "Delhi hub",
        "Loaded for departure"
      )
    ).toMatchObject({ success: true })
    expect((await shipmentState(shipment.id))?.status).toBe("in-transit")
    expect(await database.select().from(schema.trackingEvents)).toMatchObject([
      { loggedBy: staffId, isPublic: false },
    ])
    expect((await client.query("select action from audit_log")).rows).toEqual([
      { action: "scanner_status_transition" },
    ])
    expect(
      await updateScannedShipmentStatus(
        shipment.id,
        "in-transit",
        "Delhi hub",
        "Duplicate scan"
      )
    ).toMatchObject({ success: false })
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(1)
  })
  it("commits a delivery run, its departure and delivery with one audit per operation", async () => {
    const shipment = await seedShipment()
    expect(
      await createDispatchRunAction({
        driverId,
        vehicleId,
        runType: "delivery",
        shipmentIds: [shipment.id],
      })
    ).toMatchObject({ success: true })
    const manifest = (await database.query.manifests.findFirst())!
    expect(
      await updateDispatchRunAction({ id: manifest.id, driverId, vehicleId })
    ).toMatchObject({ success: true })
    expect(await startDispatchRunAction({ id: manifest.id })).toMatchObject({
      success: true,
    })
    expect(await completeDispatchRunAction({ id: manifest.id })).toMatchObject({
      success: true,
    })
    expect((await shipmentState(shipment.id))?.status).toBe("delivered")
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(2)
    expect(
      (await client.query("select action from audit_log order by created_at"))
        .rows
    ).toEqual([
      { action: "create" },
      { action: "update" },
      { action: "start" },
      { action: "complete" },
    ])
  })

  it("commits manifest scanning and finalization with the matching tracking events and audits", async () => {
    const first = await seedShipment()
    const second = await seedShipment("SECOND-AWB")
    expect(
      await createManifestAction({
        originHubId,
        destinationHubId,
        driverId,
        vehicleId,
        shipmentIds: [first.id],
      })
    ).toMatchObject({ success: true })
    const manifest = (await database.query.manifests.findFirst())!
    expect(
      await scanShipmentAction({
        manifestId: manifest.id,
        awbNumber: second.awbNumber,
      })
    ).toMatchObject({ success: true })
    expect(
      await updateManifestAction({ id: manifest.id, status: "finalized" })
    ).toMatchObject({ success: true })
    expect((await shipmentState(first.id))?.status).toBe("in-transit")
    expect((await shipmentState(second.id))?.status).toBe("in-transit")
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(2)
    expect(
      (await client.query("select action from audit_log order by created_at"))
        .rows
    ).toEqual([
      { action: "create" },
      { action: "add_shipment" },
      { action: "finalize" },
    ])
  })

  it.each(["manifest", "dispatch"])(
    "releases draft %s assignments only when deletion and its audit commit",
    async (kind) => {
      const shipment = await seedShipment()
      const manifest = await seedLoad(
        shipment.id,
        kind === "manifest" ? "MAN-TEST" : "PU-TEST"
      )
      const result =
        kind === "manifest"
          ? await deleteManifestAction({ id: manifest.id })
          : await deleteDispatchRunAction({ id: manifest.id })
      expect(result).toMatchObject({ success: true })
      expect(await database.select().from(schema.manifests)).toHaveLength(0)
      expect(await database.select().from(schema.manifestItems)).toHaveLength(0)
      expect((await client.query("select action from audit_log")).rows).toEqual(
        [{ action: "delete" }]
      )
    }
  )

  it("rolls back the shipment, AWB and initial tracking event when its audit cannot be inserted", async () => {
    await failAudits()
    await expect(
      createShipmentAction({ ...cargo, customerId })
    ).rejects.toThrow("Failed to create shipment")
    expect(await database.select().from(schema.shipments)).toHaveLength(0)
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(0)
    await client.exec(
      "alter table audit_log drop constraint test_audit_failure"
    )
    await createShipmentAction({ ...cargo, customerId })
    expect(await database.select().from(schema.shipments)).toHaveLength(1)
    const records = await client.query("select action, user_id from audit_log")
    expect(records.rows).toEqual([{ action: "create", user_id: staffId }])
  })

  it.each(["manifest", "dispatch"])(
    "rolls back %s creation and assignment on audit failure",
    async (kind) => {
      const shipment = await seedShipment()
      await failAudits()
      const result =
        kind === "manifest"
          ? await createManifestAction({
              originHubId,
              destinationHubId,
              driverId,
              vehicleId,
              shipmentIds: [shipment.id],
            })
          : await createDispatchRunAction({
              driverId,
              vehicleId,
              runType: "pickup",
              shipmentIds: [shipment.id],
            })
      expect(result).toMatchObject({ success: false })
      expect(await database.select().from(schema.manifests)).toHaveLength(0)
      expect(await database.select().from(schema.manifestItems)).toHaveLength(0)
    }
  )

  it("rolls back load departure, shipment status and its tracking event together", async () => {
    const shipment = await seedShipment()
    const manifest = await seedLoad(shipment.id)
    await failAudits()
    expect(await startDispatchRunAction({ id: manifest.id })).toMatchObject({
      success: false,
    })
    expect((await shipmentState(shipment.id))?.status).toBe("pending")
    expect((await database.query.manifests.findFirst())?.status).toBe("draft")
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(0)
  })

  it("never treats pickup completion as delivery or releases its historical assignment", async () => {
    const shipment = await seedShipment()
    const manifest = await seedLoad(shipment.id, "PU-TEST", "finalized")
    await database
      .update(schema.shipments)
      .set({ status: "in-transit" })
      .where(eq(schema.shipments.id, shipment.id))
    expect(await completeDispatchRunAction({ id: manifest.id })).toMatchObject({
      success: false,
    })
    expect((await shipmentState(shipment.id))?.status).toBe("in-transit")
    expect(
      await createDispatchRunAction({
        driverId,
        vehicleId,
        runType: "delivery",
        shipmentIds: [shipment.id],
      })
    ).toMatchObject({ success: false })
    expect(await database.select().from(schema.manifestItems)).toHaveLength(1)
  })

  it("rolls back delivery when audit persistence fails", async () => {
    const shipment = await seedShipment()
    const manifest = await seedLoad(shipment.id, "DL-TEST", "finalized")
    await database
      .update(schema.shipments)
      .set({ status: "in-transit" })
      .where(eq(schema.shipments.id, shipment.id))
    await failAudits()
    expect(await completeDispatchRunAction({ id: manifest.id })).toMatchObject({
      success: false,
    })
    expect((await shipmentState(shipment.id))?.status).toBe("in-transit")
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(0)
  })

  it("rolls back scans, line-haul finalization and draft deletion when audit persistence fails", async () => {
    const first = await seedShipment()
    const second = await seedShipment("SECOND-AWB")
    const manifest = await seedLoad(first.id, "MAN-TEST")
    await failAudits()
    expect(
      await scanShipmentAction({
        manifestId: manifest.id,
        awbNumber: second.awbNumber,
      })
    ).toMatchObject({ success: false })
    expect(
      await updateManifestAction({ id: manifest.id, status: "finalized" })
    ).toMatchObject({ success: false })
    expect(await deleteManifestAction({ id: manifest.id })).toMatchObject({
      success: false,
    })
    expect((await database.query.manifests.findFirst())?.status).toBe("draft")
    expect(await database.select().from(schema.manifestItems)).toHaveLength(1)
    expect((await shipmentState(first.id))?.status).toBe("pending")
  })

  it("rolls back dispatch edits and removal while preserving their assignments", async () => {
    const shipment = await seedShipment()
    const manifest = await seedLoad(shipment.id)
    await failAudits()
    expect(
      await updateDispatchRunAction({ id: manifest.id, driverId })
    ).toMatchObject({ success: false })
    expect(await deleteDispatchRunAction({ id: manifest.id })).toMatchObject({
      success: false,
    })
    expect(await database.select().from(schema.manifests)).toHaveLength(1)
    expect(await database.select().from(schema.manifestItems)).toHaveLength(1)
  })

  it("rejects assigned or moving shipment removal and permits unassigned pending removal", async () => {
    const assigned = await seedShipment()
    await seedLoad(assigned.id)
    await expect(deleteShipmentAction({ id: assigned.id })).rejects.toThrow(
      "Failed to delete shipment"
    )
    expect((await shipmentState(assigned.id))?.deletedAt).toBeNull()
    const moving = await seedShipment("MOVING-AWB")
    await database
      .update(schema.shipments)
      .set({ status: "in-transit" })
      .where(eq(schema.shipments.id, moving.id))
    await expect(deleteShipmentAction({ id: moving.id })).rejects.toThrow(
      "Failed to delete shipment"
    )
    const removable = await seedShipment("REMOVABLE-AWB")
    await deleteShipmentAction({ id: removable.id })
    expect((await shipmentState(removable.id))?.deletedAt).toBeInstanceOf(Date)
  })

  it("rolls back shipment tracking, weight updates and removal on audit failure", async () => {
    const shipment = await seedShipment()
    await failAudits()
    await expect(
      createTrackingEventAction({
        shipmentId: shipment.id,
        status: "delivered",
        location: "Mumbai",
        description: "Delivered",
      })
    ).rejects.toThrow()
    await expect(
      updateShipmentAction({ ...cargo, id: shipment.id, dimensionsL: 100 })
    ).rejects.toThrow("Failed to update shipment")
    await expect(deleteShipmentAction({ id: shipment.id })).rejects.toThrow(
      "Failed to delete shipment"
    )
    expect(await shipmentState(shipment.id)).toMatchObject({
      status: "pending",
      dimensionsL: 10,
      chargedWeightKg: 1,
      deletedAt: null,
    })
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(0)
  })

  it("serializes simultaneous partial cargo edits and persists weight from the combined dimensions", async () => {
    const shipment = await seedShipment()
    await Promise.all([
      updateShipmentAction({ ...cargo, id: shipment.id, dimensionsL: 100 }),
      updateShipmentAction({ ...cargo, id: shipment.id, dimensionsW: 100 }),
    ])
    expect(await shipmentState(shipment.id)).toMatchObject({
      dimensionsL: 100,
      dimensionsW: 100,
      dimensionsH: 10,
      chargedWeightKg: 20,
    })
  })

  it("writes a fallback audit email and SQL NULL optional JSON on the same connection", async () => {
    await database.transaction((tx) =>
      logAuditInTransaction(tx, { action: "test", userEmail: null })
    )
    const records = await client.query(
      'select user_email, metadata is null as no_metadata, "before" is null as no_before, "after" is null as no_after from audit_log'
    )
    expect(records.rows).toEqual([
      {
        user_email: "unknown",
        no_metadata: true,
        no_before: true,
        no_after: true,
      },
    ])
  })
})


describe("WhatsApp inbox persistence", () => {
  const incoming = { messageId: "wamid.test-1", phone: "919876543210", name: "Test sender", text: "Where is my shipment?", timestamp: new Date("2026-09-07T10:00:00Z"), awb: null }
  it("deduplicates callback retries and appends new messages to the same open ticket", async () => {
    const [a, b] = await Promise.all([saveInboundMessage(incoming), saveInboundMessage(incoming)])
    expect([a, b].filter(result => result.duplicate)).toHaveLength(1)
    await saveInboundMessage({ ...incoming, messageId: "wamid.test-2", text: "One more detail" })
    expect(await database.select().from(schema.tickets)).toHaveLength(1)
    expect(await database.select().from(schema.ticketReplies)).toHaveLength(2)
    expect((await client.query("select kind from background_jobs")).rows).toEqual([{ kind: "support_triage" }])
  })
  it("rolls back subscriber, ticket, reply and triage job when the audit cannot be saved", async () => {
    await failAudits()
    await expect(saveInboundMessage(incoming)).rejects.toThrow()
    expect(await database.select().from(schema.tickets)).toHaveLength(0)
    expect(await database.select().from(schema.ticketReplies)).toHaveLength(0)
    expect(await database.select().from(schema.whatsappSubscribers)).toHaveLength(0)
    expect((await client.query("select id from background_jobs")).rows).toHaveLength(0)
  })
  it("preserves opt-out across ordinary messages and stale opt-in callbacks", async () => {
    await saveInboundMessage({ ...incoming, consent: false })
    await saveInboundMessage({ ...incoming, messageId: "wamid.stale", consent: true, timestamp: new Date("2026-09-07T09:00:00Z") })
    await saveInboundMessage({ ...incoming, messageId: "wamid.ordinary", timestamp: new Date("2026-09-07T11:00:00Z") })
    expect((await database.select().from(schema.whatsappSubscribers))[0].optedIn).toBe(false)
    await saveInboundMessage({ ...incoming, messageId: "wamid.start", consent: true, timestamp: new Date("2026-09-07T12:00:00Z") })
    expect((await database.select().from(schema.whatsappSubscribers))[0].optedIn).toBe(true)
  })
})

describe("invoice wizard transaction", () => {
  const wizard = { requestId: "88888888-8888-4888-8888-888888888888", serviceType: "express_air", origin: "New Delhi", destination: "Imphal", originState: "Delhi", destinationState: "Manipur", consignorName: "Test Sender", consignorPhone: "919876543210", consignorIdType: "none", consigneeName: "Test Recipient", consigneePhone: "919876543211", contentDescription: "Packaged books", natureOfGoods: "others", itemCondition: "new", declaredValue: 100, pieces: 2, weightKg: 1, dimensionsL: 100, dimensionsW: 10, dimensionsH: 10, packagingType: "corrugated_box", freightCharge: 100, pickupCharge: 0, packingCharge: 0, docketCharge: 10, insuranceCharge: 0, otherCharges: 5, gstRate: 18, paymentMode: "cash", advancePaid: 50, termsAccepted: true, prohibitedAccepted: true } as const
  it("reuses the same booking on retry without calling PDF or external providers", async () => {
    vi.stubEnv("POSTHOG_KEY", ""); vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "")
    const external = vi.fn(() => { throw new Error("Unexpected external provider request") })
    vi.stubGlobal("fetch", external)
    try {
      const first = await createWizardInvoiceAction(wizard)
      const second = await createWizardInvoiceAction(wizard)
      expect(first).toMatchObject({ success: true, invoiceId: wizard.requestId })
      expect(second).toEqual(first)
      expect(await database.select().from(schema.invoices)).toHaveLength(1)
      expect(await database.select().from(schema.shipments)).toHaveLength(1)
      expect((await database.select().from(schema.trackingEvents))[0]).toMatchObject({ status: "pending", isPublic: true })
      expect((await database.select().from(schema.invoices))[0]).toMatchObject({ subtotal: 11500, amount: 13570, igst: 2070, cgst: 0, sgst: 0, advancePaid: 5000, balanceDue: 8570 })
      expect((await database.select().from(schema.shipments))[0].chargedWeightKg).toBe(2)
      expect(external).not.toHaveBeenCalled()
    } finally { vi.unstubAllGlobals(); vi.unstubAllEnvs() }
  })
  it("rolls back customer records, shipment, tracking and invoice together on audit failure", async () => {
    await failAudits()
    expect(await createWizardInvoiceAction(wizard)).toMatchObject({ success: false })
    expect(await database.select().from(schema.invoices)).toHaveLength(0)
    expect(await database.select().from(schema.shipments)).toHaveLength(0)
    expect(await database.select().from(schema.trackingEvents)).toHaveLength(0)
    expect(await database.select().from(schema.users).where(eq(schema.users.phone, wizard.consignorPhone))).toHaveLength(0)
  })
})

describe("persistent fleet telemetry", () => {
  const position = { id: vehicleId, lat: 28.6, lng: 77.2, heading: 45, speed: 30, timestamp: "2026-09-07T10:00:00.000Z" }
  it("uses persisted positions and ignores older callbacks", async () => {
    expect(await fleetTelemetryStore.updateVehicleState(position)).toEqual({ updated: true })
    expect(await fleetTelemetryStore.updateVehicleState({ ...position, lat: 20, timestamp: "2026-09-07T09:59:00Z" })).toEqual({ updated: false })
    const stored = (await client.query("select latitude, longitude from fleet_telemetry")).rows
    expect(stored).toEqual([{ latitude: 28.6, longitude: 77.2 }])
    expect(await fleetTelemetryStore.listVehicleStates(new Date(position.timestamp).getTime())).toEqual([position])
    expect(await fleetTelemetryStore.listVehicleStates(new Date(position.timestamp).getTime() + 16 * 60_000)).toEqual([])
  })
  it("rejects unregistered vehicles and hides inactive vehicles", async () => {
    await expect(fleetTelemetryStore.updateVehicleState({ ...position, id: "unknown" })).rejects.toThrow("not registered")
    await fleetTelemetryStore.updateVehicleState({ ...position, id: "TEST-VEHICLE" })
    await database.update(schema.vehicles).set({ status: "maintenance" }).where(eq(schema.vehicles.id, vehicleId))
    expect(await fleetTelemetryStore.listVehicleStates(new Date(position.timestamp).getTime())).toEqual([])
  })
})

describe("invoice settlement integrity", () => {
  it("does not manufacture a payment when charges on a paid invoice increase", async () => {
    const shipment = await seedShipment()
    const invoice = await createStoredInvoice(shipment.id, 10000, invoiceActor)
    await updateStoredInvoice(invoice.id, { status: "paid", amount: 10000 }, invoiceActor, { paymentOnly: true })
    const revised = await updateStoredInvoice(invoice.id, { status: "paid", freightCharge: 20000, advancePaid: 10000 }, invoiceActor)
    expect(revised).toMatchObject({ amount: 20000, advancePaid: 10000, balanceDue: 10000, status: "unpaid" })
  })
})

