import { auth } from "@/auth"
import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { SecureBoundary } from "@/components/security/secure-boundary"
import { ShipmentTimeline } from "@/components/shipments/realtime-tracker"
import { DataLabel } from "@/components/typography/data-label"
import { UpdateStatusButton } from "@/components/shipments/UpdateStatusButton"

export default async function ShipmentDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const session = await auth()
  if (!session?.user?.id) return <div>Unauthorized</div>

  const [shipment] = await db
    .select()
    .from(shipments)
    .where(and(eq(shipments.id, params.id)))
    .limit(1)

  if (!shipment) return notFound()

  // Fetch immutable event log
  const events = await db
    .select()
    .from(trackingEvents)
    .where(eq(trackingEvents.shipmentId, params.id))
    .orderBy(desc(trackingEvents.createdAt))

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">
            Shipment Details
          </h1>
          <p className="text-muted-foreground tabular-nums">
            {shipment.awbNumber}
          </p>
        </div>
        <SecureBoundary
          table="shipments"
          operation="update"
          resourceId={shipment.id}
          fallback="boundary"
          upgradePath="/settings/roles"
        >
          <UpdateStatusButton
            shipmentId={shipment.id}
            currentStatus={shipment.status}
          />
        </SecureBoundary>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 border bg-card p-6 shadow-sm">
          <DataLabel className="block">Route</DataLabel>
          <p className="font-semibold">
            {shipment.origin} &rarr; {shipment.destination}
          </p>
          <DataLabel className="block pt-4">Service Type</DataLabel>
          <p className="font-semibold">
            {shipment.serviceType.replace("_", " ")}
          </p>
        </div>
        <div className="space-y-2 border bg-card p-6 shadow-sm">
          <DataLabel className="block">Cargo Details</DataLabel>
          <p className="font-semibold tabular-nums">{shipment.weightKg} kg</p>
          <DataLabel className="block pt-4">Status</DataLabel>
          <p className="font-semibold capitalize tabular-nums">
            {shipment.status}
          </p>
        </div>
      </div>

      <ShipmentTimeline
        events={events.map((e) => ({
          id: e.id,
          type: e.status,
          occurredAt: e.createdAt.toISOString(),
          payload: { location: e.location, description: e.description },
          eventHash: e.id,
        }))}
      />
    </div>
  )
}
