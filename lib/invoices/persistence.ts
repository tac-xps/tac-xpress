import "server-only"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { invoices, shipments } from "@/lib/db/schema"
import { logAuditInTransaction } from "@/lib/audit"
import { assertPaise, calculateInvoice, chargeKeys } from "./calculations"

interface Actor {
  id: string
  email?: string | null
}
type InvoicePatch = Partial<typeof invoices.$inferInsert>
type PartyPatch = Pick<
  Partial<typeof shipments.$inferInsert>,
  "consignorName" | "consignorPhone" | "consigneeName" | "consigneePhone"
>

export async function updateStoredInvoice(
  id: string,
  fields: InvoicePatch,
  actor: Actor,
  options: {
    paymentOnly?: boolean
    shipmentId?: string
    parties?: PartyPatch
  } = {}
) {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
      .for("update")
    if (!current) throw new Error("Invoice not found.")
    if (current.status === "void")
      throw new Error("A void invoice cannot be edited.")
    if (options.shipmentId && options.shipmentId !== current.shipmentId)
      throw new Error("Shipment ID mismatch.")
    let values: InvoicePatch
    if (options.paymentOnly) {
      if (fields.amount !== current.amount)
        throw new Error(
          "The invoice changed. Reload it before recording payment."
        )
      const advancePaid =
        fields.status === "paid"
          ? current.amount
          : assertPaise(fields.advancePaid ?? current.advancePaid ?? 0)
      if (advancePaid > current.amount)
        throw new Error("Payment cannot exceed the invoice total.")
      values = {
        advancePaid,
        balanceDue: current.amount - advancePaid,
        status: advancePaid === current.amount ? "paid" : "unpaid",
      }
    } else {
      const charges = Object.fromEntries(
        chargeKeys.map((key) => [key, fields[key] ?? current[key] ?? 0])
      ) as Record<(typeof chargeKeys)[number], number>
      const gstRate = fields.gstRate ?? current.gstRate ?? 0
      const totals = calculateInvoice({
        ...charges,
        gstRate,
        interstate: (current.igst ?? 0) > 0,
        advancePaid: fields.advancePaid ?? current.advancePaid ?? 0,
        // Editing charges cannot create a payment merely because the old invoice was paid.
        paid: false,
      })
      values = {
        ...charges,
        ...totals,
        gstRate,
        paymentMode: fields.paymentMode ?? current.paymentMode,
        remarks: fields.remarks ?? current.remarks,
      }
    }
    const [updated] = await tx
      .update(invoices)
      .set({ ...values, pdfUrl: `/invoice/${id}`, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning()
    if (
      current.shipmentId &&
      options.parties &&
      Object.values(options.parties).some((value) => value !== undefined)
    ) {
      const [shipment] = await tx
        .select()
        .from(shipments)
        .where(eq(shipments.id, current.shipmentId))
        .for("update")
      if (!shipment || shipment.deletedAt)
        throw new Error("Shipment unavailable.")
      await tx
        .update(shipments)
        .set({ ...options.parties, updatedAt: new Date() })
        .where(eq(shipments.id, current.shipmentId))
    }
    await logAuditInTransaction(tx, {
      action: options.paymentOnly
        ? "invoice.payment_updated"
        : "invoice.updated",
      entity: "invoice",
      entityId: id,
      userId: actor.id,
      userEmail: actor.email,
      before: {
        amount: current.amount,
        status: current.status,
        advancePaid: current.advancePaid,
      },
      after: {
        amount: updated.amount,
        status: updated.status,
        advancePaid: updated.advancePaid,
      },
    })
    return updated
  })
}

/** Preserve financial history and its links instead of deleting the invoice row. */
export async function voidStoredInvoice(id: string, actor: Actor) {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
      .for("update")
    if (!current) throw new Error("Invoice not found.")
    if (current.status === "void") return
    if (current.status === "paid" || (current.advancePaid ?? 0) > 0)
      throw new Error(
        "Reconcile recorded payments before voiding this invoice."
      )
    await tx
      .update(invoices)
      .set({ status: "void", updatedAt: new Date() })
      .where(eq(invoices.id, id))
    await logAuditInTransaction(tx, {
      action: "invoice.voided",
      entity: "invoice",
      entityId: id,
      userId: actor.id,
      userEmail: actor.email,
      before: { status: current.status },
      after: { status: "void" },
    })
  })
}

export async function createStoredInvoice(
  shipmentId: string,
  amount: number,
  actor: Actor
) {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${shipmentId}, 0))`
    )
    const [shipment] = await tx
      .select()
      .from(shipments)
      .where(eq(shipments.id, shipmentId))
      .for("update")
    if (!shipment || shipment.deletedAt) throw new Error("Shipment not found.")
    const existing = await tx.query.invoices.findFirst({
      where: (table, { and, eq, ne }) =>
        and(eq(table.shipmentId, shipmentId), ne(table.status, "void")),
    })
    if (existing) return existing
    const id = crypto.randomUUID()
    const [invoice] = await tx
      .insert(invoices)
      .values({
        id,
        shipmentId,
        customerId: shipment.customerId,
        amount: assertPaise(amount),
        freightCharge: amount,
        subtotal: amount,
        advancePaid: 0,
        balanceDue: amount,
        status: amount === 0 ? "paid" : "unpaid",
        whatsappStatus: "pending",
        pdfUrl: `/invoice/${id}`,
      })
      .returning()
    await logAuditInTransaction(tx, {
      action: "invoice.created",
      entity: "invoice",
      entityId: id,
      userId: actor.id,
      userEmail: actor.email,
      after: { shipmentId, amount },
    })
    return invoice
  })
}
