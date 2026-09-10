"use server"
import { db } from "@/lib/db"
import { shipments, invoices, tickets } from "@/lib/db/schema"
import { requireDashboardSession } from "@/lib/auth/guards"
import { and, desc, gte, isNull } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"
export async function getWorkspaceActivity() {
  const session = await requireDashboardSession()
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  try {
    const [shipmentRows, invoiceRows, ticketRows] = await Promise.all([
      db.select({ id: shipments.id, reference: shipments.awbNumber, createdAt: shipments.createdAt }).from(shipments).where(and(isNull(shipments.deletedAt), gte(shipments.createdAt, since))).orderBy(desc(shipments.createdAt)).limit(15),
      db.select({ id: invoices.id, createdAt: invoices.createdAt }).from(invoices).where(gte(invoices.createdAt, since)).orderBy(desc(invoices.createdAt)).limit(15),
      db.select({ id: tickets.id, subject: tickets.subject, createdAt: tickets.createdAt }).from(tickets).where(gte(tickets.createdAt, since)).orderBy(desc(tickets.createdAt)).limit(15),
    ])
    return { userId: session.user.id, items: [
      ...shipmentRows.map((row) => ({ id: `shipment-${row.id}`, type: "shipment" as const, title: "Shipment created", description: row.reference, created_at: row.createdAt.toISOString(), link: `/dashboard/shipments/${row.id}` })),
      ...invoiceRows.map((row) => ({ id: `invoice-${row.id}`, type: "invoice" as const, title: "Invoice created", description: `Invoice ${row.id.slice(0, 8).toUpperCase()}`, created_at: row.createdAt.toISOString(), link: `/invoice/${row.id}` })),
      ...ticketRows.map((row) => ({ id: `ticket-${row.id}`, type: "ticket" as const, title: "Support request received", description: row.subject, created_at: row.createdAt.toISOString(), link: "/dashboard/messages" })),
    ].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 30) }
  } catch (error) { Sentry.captureException(error, { tags: { area: "workspace_activity" } }); throw new Error("Unable to load recent activity.") }
}

