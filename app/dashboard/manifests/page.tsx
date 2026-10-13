import type { Metadata } from "next"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { containsPattern, parseRecordQuery, recordOrder, type RecordSearchParams } from "@/lib/table-query"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Manifests | TAC-XPRESS",
}
import {
  drivers,
  hubs,
  manifestItems,
  manifests,
  shipments,
  vehicles,
} from "@/lib/db/schema"
import { and, eq, isNull, notExists, ilike, or, inArray, desc, sql } from "drizzle-orm"
import { Card, CardContent } from "@/components/ui/card"
import { CreateManifestDialog } from "./create-manifest-dialog"
import { ExportManifestButton } from "./export-button"
import { ManifestClientTable } from "./manifest-client-table"

export default async function ManifestsPage({
  searchParams,
}: {
  searchParams: Promise<RecordSearchParams>
}) {
  await requireStaffPage()

  const params = await searchParams
  const query = parseRecordQuery(params, ["referenceId", "createdAt", "status"])
  if (!["draft", "finalized"].includes(query.status)) query.status = "all"
  const pattern = containsPattern(query.q)
  const sortColumns = { referenceId: manifests.referenceId, createdAt: manifests.createdAt, status: manifests.status }
  const manifestWhere = and(
    query.status !== "all"
      ? eq(manifests.status, query.status as "draft" | "finalized")
      : undefined,
    query.q
      ? or(
          ilike(manifests.referenceId, pattern),
          inArray(
            manifests.originHubId,
            db.select({ id: hubs.id }).from(hubs).where(ilike(hubs.name, pattern))
          ),
          inArray(
            manifests.destinationHubId,
            db.select({ id: hubs.id }).from(hubs).where(ilike(hubs.name, pattern))
          )
        )
      : undefined
  )

  const [
    manifestRows,
    countResult,
    pendingShipments,
    hubOptions,
    vehicleOptions,
    driverOptions,
  ] = await Promise.all([
    db.query.manifests.findMany({
      where: manifestWhere,
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
      limit: query.pageSize,
      offset: (query.page - 1) * query.pageSize,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(manifests)
      .where(manifestWhere),
    db
      .select({
        id: shipments.id,
        awbNumber: shipments.awbNumber,
        origin: shipments.origin,
        destination: shipments.destination,
        weightKg: shipments.weightKg,
        pieces: shipments.pieces,
        serviceType: shipments.serviceType,
        natureOfGoods: shipments.natureOfGoods,
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
      .select({ id: hubs.id, label: hubs.name, location: hubs.location })
      .from(hubs)
      .where(isNull(hubs.deletedAt)),
    db
      .select({
        id: vehicles.id,
        label: vehicles.registrationNumber,
        capacityKg: vehicles.capacityKg,
        driverId: vehicles.driverId,
      })
      .from(vehicles)
      .where(and(eq(vehicles.status, "active"), isNull(vehicles.deletedAt))),
    db
      .select({
        id: drivers.id,
        label: drivers.name,
        phone: drivers.phone,
        licenseNumber: drivers.licenseNumber,
      })
      .from(drivers)
      .where(and(eq(drivers.status, "active"), isNull(drivers.deletedAt))),
    ])
  const totalCount = Number(countResult[0].count)
  const pageCount = Math.ceil(totalCount / query.pageSize)
  const allManifests = manifestRows

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-8">
      <PageHeader title="Manifests" description="Plan hub-to-hub loads, confirm assignments and finalize departure records."><ExportManifestButton /><CreateManifestDialog shipments={pendingShipments} hubs={hubOptions} vehicles={vehicleOptions} drivers={driverOptions} /></PageHeader>
      <Card className="relative overflow-hidden delay-0">
<TableToolbar pathname="/dashboard/manifests" query={query.q} status={query.status} sort={query.sort} order={query.order} statuses={[{ value: "draft", label: "Draft" }, { value: "finalized", label: "Finalized" }]} placeholder="Manifest reference or hub name" />
        <CardContent className="p-0">
          <ManifestClientTable manifests={allManifests} pageCount={pageCount} />
        </CardContent>
      </Card>
    </div>
  )
}

