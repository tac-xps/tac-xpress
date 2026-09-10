import "server-only"
import { db } from "@/lib/db"
import {
  invoices,
  shipments,
  tickets,
  trackingEvents,
  messageOutbound,
} from "@/lib/db/schema"
import { and, desc, eq, isNull, sql } from "drizzle-orm"
import { requireDashboardSession } from "@/lib/auth/guards"

export async function getControlCenterSnapshot() {
  await requireDashboardSession()
  const [
    [billing],
    [tracking],
    [delivery],
    recentInvoices,
    recentContacts,
    recentMessages,
  ] = await Promise.all([
    db
      .select({
        outstanding: sql<number>`coalesce(sum(coalesce(${invoices.balanceDue}, ${invoices.amount})) filter (where ${invoices.status} = 'unpaid'), 0)`,
      })
      .from(invoices),
    db
      .select({ count: sql<number>`count(*)` })
      .from(shipments)
      .where(
        and(
          isNull(shipments.deletedAt),
          sql`not exists (select 1 from ${trackingEvents} where ${trackingEvents.shipmentId} = ${shipments.id} and ${trackingEvents.isPublic} = true)`
        )
      ),
    db
      .select({
        failed: sql<number>`count(*) filter (where ${messageOutbound.status} = 'failed')`,
      })
      .from(messageOutbound),
    db.query.invoices.findMany({
      columns: {
        id: true,
        amount: true,
        status: true,
        whatsappStatus: true,
        createdAt: true,
      },
      with: { shipment: { columns: { awbNumber: true, consignorName: true } } },
      orderBy: [desc(invoices.createdAt), desc(invoices.id)],
      limit: 5,
    }),
    db.query.tickets.findMany({
      columns: {
        id: true,
        subject: true,
        customerName: true,
        status: true,
        createdAt: true,
      },
      where: eq(tickets.source, "landing"),
      orderBy: [desc(tickets.createdAt), desc(tickets.id)],
      limit: 5,
    }),
    db
      .select({
        id: messageOutbound.id,
        status: messageOutbound.status,
        relatedInvoiceId: messageOutbound.relatedInvoiceId,
        relatedAwb: messageOutbound.relatedAwb,
        createdAt: messageOutbound.createdAt,
      })
      .from(messageOutbound)
      .orderBy(desc(messageOutbound.createdAt), desc(messageOutbound.id))
      .limit(5),
  ])
  return {
    outstanding: Number(billing.outstanding),
    unpublished: Number(tracking.count),
    failedMessages: Number(delivery.failed),
    recentInvoices,
    recentContacts,
    recentMessages,
  }
}
export type ControlCenterSnapshot = Awaited<
  ReturnType<typeof getControlCenterSnapshot>
>
