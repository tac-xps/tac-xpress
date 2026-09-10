"use server"
import * as Sentry from "@sentry/nextjs"
import { count, desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { shipments } from "@/lib/db/schema"
import { shipmentOwnerFilter } from "@/lib/auth/portal-ownership"
import { verifyPortalSession } from "@/app/actions/portal-auth"
const PAGE_SIZE = 25
export async function getPortalShipments(page = 0) {
  try {
    const session = await verifyPortalSession()
    if (!session) return { success: false, error: "Unauthorized" }
    if (!Number.isSafeInteger(page) || page < 0 || page > 10000) return { success: false, error: "Invalid page" }
    const where = shipmentOwnerFilter(session.email)
    const [rows, [summary]] = await Promise.all([
      db.select({ id: shipments.id, awb_number: shipments.awbNumber, status: shipments.status, origin: shipments.origin, destination: shipments.destination, service_type: shipments.serviceType, weight_kg: shipments.weightKg, created_at: shipments.createdAt, edd: shipments.edd }).from(shipments).where(where).orderBy(desc(shipments.createdAt), desc(shipments.id)).limit(PAGE_SIZE).offset(page * PAGE_SIZE),
      db.select({ total: count() }).from(shipments).where(where),
    ])
    return { success: true, data: { shipments: rows.map(row => ({ ...row, created_at: row.created_at.toISOString(), edd: row.edd?.toISOString() ?? null })), total: summary.total, page, pageSize: PAGE_SIZE, hasMore: summary.total > (page + 1) * PAGE_SIZE } }
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "portal_shipments" } })
    return { success: false, error: "We couldn’t load your shipments. Please try again." }
  }
}
