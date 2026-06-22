import { db } from "@/lib/db"
import { manifests, manifestItems, shipments } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Box, CheckCircle } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DriverDeliveryPage() {
  // Demo: Fetching all active manifests (status: 'finalized' or 'draft' for now)
  const activeManifests = await db
    .select()
    .from(manifests)
    .orderBy(desc(manifests.createdAt))
    .limit(1)

  const activeManifest = activeManifests[0]

  let assignedShipments: any[] = []
  if (activeManifest) {
    const items = await db
      .select({
        shipment: shipments,
      })
      .from(manifestItems)
      .innerJoin(shipments, eq(manifestItems.shipmentId, shipments.id))
      .where(eq(manifestItems.manifestId, activeManifest.id))

    assignedShipments = items.map((i) => i.shipment)
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-2xl font-bold tracking-tight">Today's Route</h1>

      {assignedShipments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No shipments assigned to your route today.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {assignedShipments.map((shipment) => (
            <Link key={shipment.id} href={`/driver/delivery/${shipment.id}`}>
              <Card className="cursor-pointer transition-colors hover:border-primary active:scale-[0.98]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold">
                    {shipment.awbNumber}
                  </CardTitle>
                  <Badge
                    variant={
                      shipment.status === "delivered" ? "default" : "secondary"
                    }
                  >
                    {shipment.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="line-clamp-2">
                      {shipment.consigneeAddress || shipment.destination}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Box className="h-4 w-4 shrink-0" />
                    <span>
                      {shipment.pieces} piece(s) • {shipment.weightKg} kg
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
