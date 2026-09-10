import "server-only"
import { and, desc, eq, inArray, isNull, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  tickets,
  ticketReplies,
  users,
  whatsappSubscribers,
} from "@/lib/db/schema"
import { logAuditInTransaction } from "@/lib/audit"
import { queryRows } from "@/lib/jobs/store"

interface InboundInput {
  messageId: string
  phone: string
  name: string
  text: string
  timestamp: Date
  awb: string | null
  consent?: boolean
}

/** Provider replay and concurrent messages commit exactly one inbox record. */
export async function saveInboundMessage(input: InboundInput) {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`wa-message:${input.messageId}`}, 0))`
    )
    const previous = queryRows(
      await tx.execute(
        sql`select id from audit_log where action = 'whatsapp_inbound' and metadata->>'message_id' = ${input.messageId} limit 1`
      )
    )
    if (previous.length) return { duplicate: true, ticketId: null }
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`wa-phone:${input.phone}`}, 0))`
    )
    const current = await tx.query.whatsappSubscribers.findFirst({
      where: eq(whatsappSubscribers.phone, input.phone),
    })
    const isLatest =
      !current?.lastInboundAt || input.timestamp >= current.lastInboundAt
    await tx
      .insert(whatsappSubscribers)
      .values({
        phone: input.phone,
        name: input.name,
        optedIn: input.consent ?? true,
        lastInboundAt: input.timestamp,
      })
      .onConflictDoUpdate({
        target: whatsappSubscribers.phone,
        set: {
          ...(isLatest
            ? {
                name: input.name,
                lastInboundAt: input.timestamp,
                ...(input.consent === undefined
                  ? {}
                  : { optedIn: input.consent }),
              }
            : {}),
          updatedAt: new Date(),
        },
      })
    let ticketId: string | null = null
    if (input.consent === undefined) {
      const customer = await tx.query.users.findFirst({
        where: and(
          eq(users.role, "customer"),
          isNull(users.deletedAt),
          or(eq(users.phone, input.phone), eq(users.phone, `+${input.phone}`))
        ),
      })
      const existing = await tx.query.tickets.findFirst({
        where: and(
          eq(tickets.source, "whatsapp"),
          eq(tickets.customerPhone, input.phone),
          inArray(tickets.status, ["open", "in_progress", "awaiting_customer"])
        ),
        orderBy: desc(tickets.updatedAt),
      })
      if (existing) {
        ticketId = existing.id
        await tx
          .update(tickets)
          .set({
            status:
              existing.status === "awaiting_customer"
                ? "open"
                : existing.status,
            relatedAwb: existing.relatedAwb || input.awb,
            updatedAt: new Date(),
          })
          .where(eq(tickets.id, ticketId))
      } else {
        const [created] = await tx
          .insert(tickets)
          .values({
            subject: `WhatsApp: ${input.text.slice(0, 80)}`,
            message: input.text,
            description: input.text,
            customerId: customer?.id,
            customerEmail: customer?.email,
            customerPhone: input.phone,
            customerName: input.name,
            source: "whatsapp",
            intakeCategory: input.awb ? "shipment" : "general",
            category: "general",
            relatedAwb: input.awb,
            status: "open",
            priority: "medium",
          })
          .returning({ id: tickets.id })
        ticketId = created.id
        await tx.execute(
          sql`insert into background_jobs(kind, dedupe_key, payload) values ('support_triage', ${ticketId}, ${JSON.stringify({ ticketId })}::jsonb) on conflict(kind, dedupe_key) do nothing`
        )
      }
      await tx
        .insert(ticketReplies)
        .values({
          ticketId,
          message: input.text,
          senderType: "customer",
          senderName: input.name,
          whatsappMessageId: input.messageId,
          createdAt: input.timestamp,
        })
    }
    await logAuditInTransaction(tx, {
      action: "whatsapp_inbound",
      entity: ticketId ? "tickets" : "whatsapp_subscribers",
      entityId: ticketId,
      metadata: {
        message_id: input.messageId,
        consent: input.consent,
        stale: !isLatest,
      },
    })
    return { duplicate: false, ticketId }
  })
}
