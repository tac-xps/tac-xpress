import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { vehicles, drivers } from "@/lib/db/schema"
import { and, desc, ilike, isNull, or } from "drizzle-orm"
import { AddVehicleDialog } from "./add-vehicle-dialog"
import { AddDriverDialog } from "./add-driver-dialog"
import { VehiclesClientTable } from "./vehicles-client-table"
import { DriversClientTable } from "./drivers-client-table"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { DEFAULT_PAGE_SIZE, PageNavigation, parsePage } from "@/components/ui/page-navigation"
import { containsPattern, firstParam, type RecordSearchParams } from "@/lib/table-query"
export default async function FleetPage({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  await requireStaffPage()
  const params = await searchParams
  const page = parsePage(params.page)
  const q = firstParam(params.q).trim().slice(0, 100)
  const pattern = containsPattern(q)
  const [vehicleRows, driverRows, driverOptions] = await Promise.all([
    db.query.vehicles.findMany({ where: and(isNull(vehicles.deletedAt), q ? ilike(vehicles.registrationNumber, pattern) : undefined), with: { driver: true }, orderBy: [desc(vehicles.createdAt), desc(vehicles.id)], limit: DEFAULT_PAGE_SIZE + 1, offset: (page - 1) * DEFAULT_PAGE_SIZE }),
    db.query.drivers.findMany({ where: and(isNull(drivers.deletedAt), q ? or(ilike(drivers.name, pattern), ilike(drivers.phone, pattern), ilike(drivers.licenseNumber, pattern)) : undefined), orderBy: [desc(drivers.createdAt), desc(drivers.id)], limit: DEFAULT_PAGE_SIZE + 1, offset: (page - 1) * DEFAULT_PAGE_SIZE }),
    db.select({ id: drivers.id, name: drivers.name }).from(drivers).where(isNull(drivers.deletedAt)).orderBy(drivers.name).limit(200),
  ])
  return <div className="flex min-w-0 flex-col gap-6"><PageHeader title="Fleet & drivers" description="Maintain vehicle records, capacities, driver details and assignments. Vehicle location is not inferred from manifest status."><AddDriverDialog /><AddVehicleDialog drivers={driverOptions} /></PageHeader><div className="rounded-none border bg-card"><TableToolbar pathname="/dashboard/fleet" query={q} placeholder="Vehicle registration, driver name, phone or licence" /></div><VehiclesClientTable vehicles={vehicleRows.slice(0, DEFAULT_PAGE_SIZE)} drivers={driverOptions} /><DriversClientTable drivers={driverRows.slice(0, DEFAULT_PAGE_SIZE)} /><PageNavigation page={page} hasNext={vehicleRows.length > DEFAULT_PAGE_SIZE || driverRows.length > DEFAULT_PAGE_SIZE} pathname="/dashboard/fleet" query={{ q }} /></div>
}

