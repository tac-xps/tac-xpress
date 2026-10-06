import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { eq, desc, and, isNull } from "drizzle-orm"
import { notFound } from "next/navigation"
import { z } from "zod"
import { ShipmentTimeline } from "@/components/shipments/realtime-tracker"
import { CargoDocuments } from "@/components/documents/cargo-documents"
import { PageHeader } from "@/components/operations/page-header"
import { StatusBadge } from "@/components/logistics/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddTrackingEventDialog } from "../add-tracking-event-dialog"
import {
  MapPin,
  Plane,
  Truck,
  Ship,
  Scale,
  Package,
  Phone,
  User,
  Building2,
  Calendar,
} from "lucide-react"

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireStaffPage()
  const { id } = await params
  if (!z.string().uuid().safeParse(id).success) notFound()

  const [shipment] = await db
    .select()
    .from(shipments)
    .where(and(eq(shipments.id, id), isNull(shipments.deletedAt)))
    .limit(1)

  if (!shipment) notFound()

  const events = await db
    .select()
    .from(trackingEvents)
    .where(eq(trackingEvents.shipmentId, id))
    .orderBy(desc(trackingEvents.createdAt))
    .limit(200)

  const getServiceMeta = (type: string) => {
    switch (type) {
      case "express_air":
        return { label: "Air Cargo Express", icon: Plane }
      case "standard_ocean":
        return { label: "Ocean Freight", icon: Ship }
      case "road_freight":
      default:
        return { label: "Surface Cargo Freight", icon: Truck }
    }
  }

  const serviceMeta = getServiceMeta(shipment.serviceType)

  const facts = [
    {
      label: "Corridor Route",
      value: `${shipment.origin} → ${shipment.destination}`,
      icon: MapPin,
    },
    {
      label: "Service Type",
      value: serviceMeta.label,
      icon: serviceMeta.icon,
    },
    {
      label: "Actual Weight",
      value: `${shipment.weightKg} kg`,
      icon: Scale,
    },
    {
      label: "Pieces / Packages",
      value: `${shipment.pieces ?? 1} colli`,
      icon: Package,
    },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title={shipment.awbNumber}
        description="Consignment record, route tracking events, and supporting operational files."
      >
        <div className="flex items-center gap-2">
          <StatusBadge status={shipment.status} />
          <AddTrackingEventDialog
            shipmentId={shipment.id}
            awbNumber={shipment.awbNumber}
          />
        </div>
      </PageHeader>

      {/* Operational Facts Strip */}
      <section
        aria-label="Shipment Specifications"
        className="overflow-hidden rounded-none border border-border/80 bg-card shadow-none"
      >
        <div className="border-b border-border/80 bg-muted/20 px-5 py-2.5 text-xs text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Calendar className="size-3 text-muted-foreground" />
            Booked: {new Date(shipment.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            AWB: {shipment.awbNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-y-4 p-5 lg:grid-cols-4">
          {facts.map((fact) => {
            const Icon = fact.icon
            return (
              <div
                key={fact.label}
                className="px-2 lg:border-l lg:px-6 lg:first:border-0 lg:first:pl-0 space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="size-3.5 text-muted-foreground/80 shrink-0" />
                  <span>{fact.label}</span>
                </div>
                <div className="font-mono text-base font-semibold text-foreground tracking-tight">
                  {fact.value}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Sender and Recipient Parties */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Consignor / Sender */}
        <Card className="rounded-none border-border/80 bg-card shadow-none">
          <CardHeader className="border-b border-border/70 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" />
                Sender (Consignor)
              </CardTitle>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                Origin: {shipment.origin}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 pt-4">
            <div className="flex items-start gap-2">
              <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground">
                  {shipment.consignorName || "Name not recorded"}
                </p>
                {shipment.consignorPhone && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                    <Phone className="size-3" />
                    {shipment.consignorPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 border-t border-border/50 text-xs text-muted-foreground">
              <MapPin className="size-4 shrink-0 mt-0.5 text-muted-foreground/70" />
              <p className="leading-relaxed">
                {shipment.consignorAddress || "Address details not recorded"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Consignee / Recipient */}
        <Card className="rounded-none border-border/80 bg-card shadow-none">
          <CardHeader className="border-b border-border/70 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-primary" />
                Recipient (Consignee)
              </CardTitle>
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                Destination: {shipment.destination}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 pt-4">
            <div className="flex items-start gap-2">
              <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground">
                  {shipment.consigneeName || "Name not recorded"}
                </p>
                {shipment.consigneePhone && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                    <Phone className="size-3" />
                    {shipment.consigneePhone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 border-t border-border/50 text-xs text-muted-foreground">
              <MapPin className="size-4 shrink-0 mt-0.5 text-muted-foreground/70" />
              <p className="leading-relaxed">
                {shipment.consigneeAddress || "Delivery destination address not recorded"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Event Timeline */}
      <ShipmentTimeline
        events={events.map((event) => ({
          id: event.id,
          type: event.status,
          occurredAt: event.createdAt.toISOString(),
          payload: {
            location: event.location,
            description: event.description,
          },
          eventHash: event.id,
          isPublic: event.isPublic,
        }))}
      />

      {/* Cargo Document Vault */}
      <CargoDocuments entity="shipments" id={shipment.id} />
    </div>
  )
}
