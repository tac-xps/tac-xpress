import "server-only"
import { and, desc, eq, or } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { invoices, messageOutbound } from "@/lib/db/schema"

const receiptSchema = z.object({
  id: z.string().min(1).max(512),
  status: z.enum(["sent", "delivered", "read", "failed"]),
  timestamp: z.coerce.number().finite().positive().max(8_640_000_000_000),
})
export async function recordDeliveryReceipt(value: unknown) {
  const parsed = receiptSchema.safeParse(value)
  if (!parsed.success) throw new Error("Invalid WhatsApp delivery receipt.")
  const receipt = parsed.data
  const receivedAt = new Date(receipt.timestamp * 1000)
  await db.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(messageOutbound)
      .where(
        or(
          eq(messageOutbound.metaMessageId, receipt.id),
          eq(messageOutbound.whatsappMessageId, receipt.id),
          eq(messageOutbound.providerMessageId, receipt.id)
        )
      )
      .for("update")
    if (!rows.length)
      throw new Error(
        "Delivery receipt arrived before its message was recorded."
      )
    for (const row of rows) {
      if (
        row.lastStatusAt &&
        Math.floor(receivedAt.getTime() / 1000) <
          Math.floor(row.lastStatusAt.getTime() / 1000)
      )
        continue
      if (row.status === "read" || row.status === receipt.status) continue
      if (row.status === "delivered" && receipt.status !== "read") continue
      if (row.status === "failed" && receipt.status === "sent") continue
      await tx
        .update(messageOutbound)
        .set({
          status: receipt.status,
          metaMessageId: receipt.id,
          lastStatusAt: receivedAt,
          failureReason:
            receipt.status === "failed"
              ? "Provider reported a delivery failure. Review the recipient and template before retrying."
              : null,
        })
        .where(eq(messageOutbound.id, row.id))
      if (!row.relatedInvoiceId) continue
      const latest = await tx.query.messageOutbound.findFirst({
        where: eq(messageOutbound.relatedInvoiceId, row.relatedInvoiceId),
        orderBy: [desc(messageOutbound.createdAt), desc(messageOutbound.id)],
      })
      if (latest?.id !== row.id) continue
      await tx
        .update(invoices)
        .set({
          whatsappStatus: receipt.status === "failed" ? "failed" : "sent",
        })
        .where(and(eq(invoices.id, row.relatedInvoiceId)))
    }
  })
}
