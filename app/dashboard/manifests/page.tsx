import React from "react"
import { db } from "@/lib/db"
import {
  drivers,
  hubs,
  manifestItems,
  shipments,
  vehicles,
} from "@/lib/db/schema"
import { and, eq, isNull, notExists } from "drizzle-orm"
import { format } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileText, Search, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ManifestActions } from "./manifest-actions"
import { CreateManifestDialog } from "./create-manifest-dialog"
import { ManifestsIcon } from "@/components/icons/sidebar-icons"
import { ExportManifestButton } from "./export-button"
import { ManifestClientTable } from "./manifest-client-table"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export default async function ManifestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const [
    manifestRows,
    pendingShipments,
    hubOptions,
    vehicleOptions,
    driverOptions,
  ] = await Promise.all([
    db.query.manifests.findMany({
      orderBy: (manifests, { desc }) => [desc(manifests.createdAt)],
      with: {
        driver: true,
        vehicle: true,
        items: {
          with: {
            shipment: true,
          },
        },
      },
      limit: DEFAULT_PAGE_SIZE + 1,
      offset: (page - 1) * DEFAULT_PAGE_SIZE,
    }),
    db
      .select({
        id: shipments.id,
        awbNumber: shipments.awbNumber,
        destination: shipments.destination,
      })
      .from(shipments)
      .where(
        and(
          eq(shipments.status, "pending"),
          isNull(shipments.deletedAt),
          notExists(
            db
              .select({ id: manifestItems.id })
              .from(manifestItems)
              .where(eq(manifestItems.shipmentId, shipments.id))
          )
        )
      )
      .limit(100),
    db
      .select({ id: hubs.id, label: hubs.name })
      .from(hubs)
      .where(isNull(hubs.deletedAt)),
    db
      .select({ id: vehicles.id, label: vehicles.registrationNumber })
      .from(vehicles)
      .where(and(eq(vehicles.status, "active"), isNull(vehicles.deletedAt))),
    db
      .select({ id: drivers.id, label: drivers.name })
      .from(drivers)
      .where(and(eq(drivers.status, "active"), isNull(drivers.deletedAt))),
  ])
  const hasNext = manifestRows.length > DEFAULT_PAGE_SIZE
  const allManifests = manifestRows.slice(0, DEFAULT_PAGE_SIZE)

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 md:gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <ManifestsIcon className="size-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Digital Manifests
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage assigned AWBs and line-haul ledgers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-border/50 bg-background">
            <Filter className="mr-2 size-4" />
            Filter
          </Button>
          <ExportManifestButton />
          <CreateManifestDialog
            shipments={pendingShipments}
            hubs={hubOptions}
            vehicles={vehicleOptions}
            drivers={driverOptions}
          />
        </div>
      </div>

      <Card className="relative overflow-hidden delay-0">
        <CardHeader className="flex min-h-[69px] flex-row items-center justify-between border-b border-border/50 bg-muted/20 p-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Manifest Ledgers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ManifestClientTable manifests={allManifests} />
          <PageNavigation
            page={page}
            hasNext={hasNext}
            pathname="/dashboard/manifests"
          />
        </CardContent>
      </Card>
    </div>
  )
}
