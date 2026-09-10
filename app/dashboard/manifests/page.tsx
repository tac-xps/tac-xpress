import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { containsPattern, parseRecordQuery, recordOrder, type RecordSearchParams } from "@/lib/table-query"
import { requireStaffPage } from "@/lib/auth/page-access"
import React from "react"
import { db } from "@/lib/db"
import {
  drivers,
  hubs,
  manifestItems,
  manifests,
  shipments,
  vehicles,
} from "@/lib/db/schema"
import { and, eq, isNull, notExists, ilike, or, inArray, desc } from "drizzle-orm"
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
  searchParams: Promise<RecordSearchParams>
}) {
  await requireStaffPage()

  const params = await searchParams
  const page = parsePage(params.page)
  const query = parseRecordQuery(params, ["referenceId", "createdAt", "status"])
  if (!["draft", "finalized"].includes(query.status)) query.status = "all"
  const pattern = containsPattern(query.q)
  const sortColumns = { referenceId: manifests.referenceId, createdAt: manifests.createdAt, status: manifests.status }
  const [
    manifestRows,
    pendingShipments,
    hubOptions,
    vehicleOptions,
    driverOptions,
  ] = await Promise.all([
    db.query.manifests.findMany({
      where: and(query.status !== "all" ? eq(manifests.status, query.status as "draft" | "finalized") : undefined, query.q ? or(ilike(manifests.referenceId, pattern), inArray(manifests.originHubId, db.select({ id: hubs.id }).from(hubs).where(ilike(hubs.name, pattern))), inArray(manifests.destinationHubId, db.select({ id: hubs.id }).from(hubs).where(ilike(hubs.name, pattern)))) : undefined),
      orderBy: [recordOrder(sortColumns[query.sort as keyof typeof sortColumns], query.order), desc(manifests.id)],
      with: {
        originHub: true,
        destinationHub: true,
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-8">
      <PageHeader title="Manifests" description="Plan hub-to-hub loads, confirm assignments and finalize departure records."><ExportManifestButton /><CreateManifestDialog shipments={pendingShipments} hubs={hubOptions} vehicles={vehicleOptions} drivers={driverOptions} /></PageHeader>
      <Card className="relative overflow-hidden delay-0">
<TableToolbar pathname="/dashboard/manifests" query={query.q} status={query.status} sort={query.sort} order={query.order} statuses={[{ value: "draft", label: "Draft" }, { value: "finalized", label: "Finalized" }]} placeholder="Manifest reference or hub name" />
        <CardContent className="p-0">
          <ManifestClientTable manifests={allManifests} sort={query.sort} order={query.order} />
          <PageNavigation
            page={page}
            hasNext={hasNext}
            pathname="/dashboard/manifests"
            query={query}
          />
        </CardContent>
      </Card>
    </div>
  )
}

