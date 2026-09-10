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
export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage()
  const { id } = await params
  if (!z.string().uuid().safeParse(id).success) notFound()
  const [shipment] = await db.select().from(shipments).where(and(eq(shipments.id, id), isNull(shipments.deletedAt))).limit(1)
  if (!shipment) notFound()
  const events = await db.select().from(trackingEvents).where(eq(trackingEvents.shipmentId, id)).orderBy(desc(trackingEvents.createdAt)).limit(200)
  const facts = [["Route", `${shipment.origin} → ${shipment.destination}`], ["Service", shipment.serviceType === "express_air" ? "Air cargo" : "Surface cargo"], ["Actual weight", `${shipment.weightKg} kg`], ["Packages", String(shipment.pieces ?? 1)]]
  return <div className="flex min-w-0 flex-col gap-6"><PageHeader title={shipment.awbNumber} description="Shipment details, recorded events and private supporting documents."><StatusBadge status={shipment.status} /><AddTrackingEventDialog shipmentId={shipment.id} awbNumber={shipment.awbNumber} /></PageHeader>
    <dl className="grid gap-6 rounded-none border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">{facts.map(([label, value]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-3 font-medium">{value}</dd></div>)}</dl>
    <div className="grid gap-5 sm:grid-cols-2">{[{ label: "Sender", name: shipment.consignorName, phone: shipment.consignorPhone, address: shipment.consignorAddress }, { label: "Recipient", name: shipment.consigneeName, phone: shipment.consigneePhone, address: shipment.consigneeAddress }].map((party) => <Card key={party.label}><CardHeader><CardTitle>{party.label}</CardTitle></CardHeader><CardContent className="flex flex-col gap-2"><p className="font-medium">{party.name || "Name not recorded"}</p><p className="text-sm text-muted-foreground">{party.phone || "Phone not recorded"}</p><p className="text-sm leading-relaxed text-muted-foreground">{party.address || "Address not recorded"}</p></CardContent></Card>)}</div>
    <ShipmentTimeline events={events.map((event) => ({ id: event.id, type: event.status, occurredAt: event.createdAt.toISOString(), payload: { location: event.location, description: event.description }, eventHash: event.id, isPublic: event.isPublic }))} /><CargoDocuments entity="shipments" id={shipment.id} />
  </div>
}


