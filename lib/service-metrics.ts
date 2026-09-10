import "server-only"
import { and, desc, eq, gte, isNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { shipments, tickets, trackingEvents } from "@/lib/db/schema"
export async function getServiceMetrics() {
  const since = new Date(Date.now() - 30 * 86400000)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const delivered = db
    .select({
      shipmentId: trackingEvents.shipmentId,
      deliveredAt: sql<Date>`min(${trackingEvents.createdAt})`.as(
        "delivered_at"
      ),
    })
    .from(trackingEvents)
    .where(eq(trackingEvents.status, "delivered"))
    .groupBy(trackingEvents.shipmentId)
    .as("delivery_events")
  const [sla, [ticketTotals], daily, [delivery], [risk], history] =
    await Promise.all([
      db
        .select({
          priority: sql<string>`coalesce(${tickets.priority}, 'medium')`,
          compliant: sql<number>`count(*) filter (where ${tickets.slaBreached} = false)::integer`,
          total: sql<number>`count(*) filter (where ${tickets.slaBreached} is not null)::integer`,
        })
        .from(tickets)
        .where(gte(tickets.createdAt, since))
        .groupBy(tickets.priority),
      db
        .select({
          breaches: sql<number>`count(*) filter (where ${tickets.slaBreached} = true)::integer`,
          averageHours: sql<
            number | null
          >`avg(extract(epoch from (${tickets.resolvedAt} - ${tickets.createdAt})) / 3600) filter (where ${tickets.status} = 'resolved' and ${tickets.resolvedAt} >= ${tickets.createdAt})::double precision`,
        })
        .from(tickets)
        .where(gte(tickets.createdAt, since)),
      db
        .select({
          status: shipments.status,
          volume: sql<number>`count(*)::integer`,
        })
        .from(shipments)
        .where(
          and(isNull(shipments.deletedAt), gte(shipments.bookingDate, today))
        )
        .groupBy(shipments.status),
      db
        .select({
          eligible: sql<number>`count(*) filter (where ${shipments.edd} is not null)::integer`,
          onTime: sql<number>`count(*) filter (where ${shipments.edd} is not null and ${delivered.deliveredAt} <= ${shipments.edd})::integer`,
        })
        .from(shipments)
        .innerJoin(delivered, eq(shipments.id, delivered.shipmentId))
        .where(
          and(
            isNull(shipments.deletedAt),
            eq(shipments.status, "delivered"),
            gte(delivered.deliveredAt, since)
          )
        ),
      db
        .select({ count: sql<number>`count(*)::integer` })
        .from(shipments)
        .where(
          and(
            isNull(shipments.deletedAt),
            eq(shipments.slaAtRisk, true),
            sql`${shipments.status} <> 'delivered'`
          )
        ),
      db
        .select({
          id: tickets.id,
          subject: tickets.subject,
          priority: tickets.priority,
          breachType: tickets.slaBreachType,
        })
        .from(tickets)
        .where(
          and(gte(tickets.createdAt, since), eq(tickets.slaBreached, true))
        )
        .orderBy(desc(tickets.createdAt))
        .limit(8),
    ])
  const assessed = sla.reduce((sum, item) => sum + item.total, 0)
  return {
    sla: sla
      .filter((item) => item.total > 0)
      .map((item, index) => ({
        ...item,
        fill: `var(--chart-${(index % 5) + 1})`,
      })),
    complianceRate: assessed
      ? (sla.reduce((sum, item) => sum + item.compliant, 0) / assessed) * 100
      : null,
    daily: daily.map((item, index) => ({
      ...item,
      fill: `var(--chart-${index + 1})`,
    })),
    ticketTotals,
    delivery,
    risk: risk.count,
    history,
  }
}
