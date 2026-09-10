import "server-only"
import { publicTrackingQuery } from "@/lib/tracking/public-query"

// An AWB supplied to public support does not prove ownership. AI receives only
// the same published projection available through public shipment tracking.
export async function getPublicShipmentContext(awb?: string) {
  if (!awb) return null
  const [shipment] = await publicTrackingQuery(awb.trim().toUpperCase())
  if (!shipment) return null
  return {
    awb_number: shipment.awb_number,
    status: shipment.event?.status || "pending",
    origin: shipment.origin,
    destination: shipment.destination,
    estimated_delivery: shipment.estimated_delivery?.toISOString() ?? null,
    service: shipment.service,
  }
}
