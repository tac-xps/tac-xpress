import "server-only"
import { and, desc, eq, isNull } from "drizzle-orm"
import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"

// Only explicitly published events are returned. The latest private status,
// party details, financial fields and internal notes never enter this projection.
export function publicTrackingQuery(awb: string) {
  return db
    .select({
      awb_number: shipments.awbNumber,
      origin: shipments.origin,
      destination: shipments.destination,
      service: shipments.serviceType,
      created_at: shipments.createdAt,
      estimated_delivery: shipments.edd,
      event: {
        id: trackingEvents.id,
        status: trackingEvents.status,
        location: trackingEvents.location,
        description: trackingEvents.description,
        event_time: trackingEvents.eventTime,
        created_at: trackingEvents.createdAt,
      },
    })
    .from(shipments)
    .leftJoin(
      trackingEvents,
      and(
        eq(trackingEvents.shipmentId, shipments.id),
        eq(trackingEvents.isPublic, true)
      )
    )
    .where(
      and(
        eq(shipments.awbNumber, awb),
        isNull(shipments.deletedAt)
      )
    )
    .orderBy(desc(trackingEvents.eventTime), desc(trackingEvents.createdAt))
    .limit(100)
}
