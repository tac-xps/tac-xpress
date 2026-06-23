import { db } from "@/lib/db"
import { shipments, invoices } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
// @ts-ignore - TS language server phantom error for dynamic route brackets
import { DeliveryDetails } from "./delivery-details"

export const dynamic = "force-dynamic"

export default async function DriverShipmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const shipmentData = await db
    .select({
      shipment: shipments,
      invoice: invoices,
    })
    .from(shipments)
    .leftJoin(invoices, eq(invoices.shipmentId, shipments.id))
    .where(eq(shipments.id, id))
    .limit(1)

  if (shipmentData.length === 0) {
    notFound()
  }

  const { shipment, invoice } = shipmentData[0]

  return (
    <div className="flex flex-col gap-4 pb-20">
      <DeliveryDetails shipment={shipment} invoice={invoice} />
    </div>
  )
}
