import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { vehicles, drivers } from "@/lib/db/schema"
import { and, desc, ilike, isNull, or, sql } from "drizzle-orm"
import { AddVehicleDialog } from "./add-vehicle-dialog"
import { AddDriverDialog } from "./add-driver-dialog"
import { VehiclesDataTable } from "./vehicles-data-table"
import { DriversDataTable } from "./drivers-data-table"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { containsPattern, parseRecordQuery, type RecordSearchParams } from "@/lib/table-query"

export default async function FleetPage({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  await requireStaffPage()
  const params = await searchParams
  const { page, pageSize, q } = parseRecordQuery(params, [])
  const driverPage = Math.max(1, Number(params.driver_page) || 1)
  const driverPageSize = Math.max(1, Math.min(100, Number(params.driver_per_page) || 25))
  const pattern = containsPattern(q)
  
  const vehicleWhere = and(isNull(vehicles.deletedAt), q ? ilike(vehicles.registrationNumber, pattern) : undefined)
  const driverWhere = and(isNull(drivers.deletedAt), q ? or(ilike(drivers.name, pattern), ilike(drivers.phone, pattern), ilike(drivers.licenseNumber, pattern)) : undefined)

  const [vehicleRows, driverRows, driverOptions, vehicleCountRes, driverCountRes] = await Promise.all([
    db.query.vehicles.findMany({ where: vehicleWhere, with: { driver: true }, orderBy: [desc(vehicles.createdAt), desc(vehicles.id)], limit: pageSize, offset: (page - 1) * pageSize }),
    db.query.drivers.findMany({ where: driverWhere, orderBy: [desc(drivers.createdAt), desc(drivers.id)], limit: driverPageSize, offset: (driverPage - 1) * driverPageSize }),
    db.select({ id: drivers.id, name: drivers.name }).from(drivers).where(isNull(drivers.deletedAt)).orderBy(drivers.name).limit(200),
    db.select({ count: sql<number>`count(*)` }).from(vehicles).where(vehicleWhere),
    db.select({ count: sql<number>`count(*)` }).from(drivers).where(driverWhere),
  ])

  const vehiclePageCount = Math.ceil(Number(vehicleCountRes[0].count) / pageSize)
  const driverPageCount = Math.ceil(Number(driverCountRes[0].count) / driverPageSize)

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader title="Fleet & drivers" description="Maintain vehicle records, capacities, driver details and assignments. Vehicle location is not inferred from manifest status.">
        <AddDriverDialog />
        <AddVehicleDialog drivers={driverOptions} />
      </PageHeader>
      <div className="rounded-none border bg-card">
        <TableToolbar pathname="/dashboard/fleet" query={q} placeholder="Vehicle registration, driver name, phone or licence" />
      </div>
      <VehiclesDataTable data={vehicleRows} pageCount={vehiclePageCount} drivers={driverOptions} />
      <DriversDataTable data={driverRows} pageCount={driverPageCount} />
    </div>
  )
}

