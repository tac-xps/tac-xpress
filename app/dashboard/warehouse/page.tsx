import { auth } from "@/auth"
import { db } from "@/lib/db"
import { shipments } from "@/lib/db/schema"
import { inArray, isNull, and } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { QrCode, ScanLine, Package } from "lucide-react"
import { ShipmentsDataTable } from "../shipments/shipment-data-table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScannerDialog } from "@/components/warehouse/scanner-dialog"
import { SecureBoundary } from "@/components/security/secure-boundary"

export default async function WarehousePage() {
  const session = await auth()

  // For dock workers, show shipments pending or in-transit
  const activeShipments = await db.query.shipments.findMany({
    where: (shipments, { inArray, isNull, and }) =>
      and(
        inArray(shipments.status, ["pending", "in-transit"]),
        isNull(shipments.deletedAt)
      ),
    with: {
      invoice: true,
    },
    orderBy: (shipments, { desc }) => [desc(shipments.createdAt)],
  })

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 md:gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <Package className="size-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Warehouse & Dock
            </h1>
            <p className="text-sm text-muted-foreground">
              Scan shipments and manage active inventory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SecureBoundary
            table="shipments"
            operation="update"
            fallback="boundary"
            upgradePath="/settings/roles"
          >
            <ScannerDialog>
              <Button
                variant="outline"
                className="border-border/50 bg-background"
              >
                <ScanLine className="mr-2 size-4" />
                Barcode Scan
              </Button>
            </ScannerDialog>
            <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <QrCode className="mr-2 size-4" />
              NFC / QR Sync
            </Button>
          </SecureBoundary>
        </div>
      </div>

      <Card className="overflow-hidden delay-0">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 p-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold tracking-tight">
              Active Floor Inventory
            </CardTitle>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {activeShipments.length} pending
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full">
            <ShipmentsDataTable data={activeShipments} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
