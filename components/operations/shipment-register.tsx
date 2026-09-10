import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScannerDialog } from "@/components/warehouse/scanner-dialog"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { shipments } from "@/lib/db/schema"
import { and, desc, eq, ilike, isNull, or, inArray, sql } from "drizzle-orm"
import { CreateShipmentDialog } from "@/app/dashboard/shipments/create-shipment-dialog"
import { ShipmentsDataTable } from "@/app/dashboard/shipments/shipment-data-table"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { ExportPage } from "@/components/operations/export-page"
import {
  containsPattern,
  parseRecordQuery,
  recordOrder,
  type RecordSearchParams,
} from "@/lib/table-query"
const statuses = [
  { value: "pending", label: "Pending" },
  { value: "in-transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
]
export async function ShipmentRegister({
  searchParams,
  mode = "all",
}: {
  searchParams: Promise<RecordSearchParams>
  mode?: "all" | "air" | "surface" | "warehouse"
}) {
  const pathname =
    mode === "all"
      ? "/dashboard/shipments"
      : mode === "warehouse"
        ? "/dashboard/warehouse"
        : `/dashboard/operations/${mode}-cargo`
  const title = {
    all: "Shipments",
    air: "Air cargo",
    surface: "Surface cargo",
    warehouse: "Warehouse & dock",
  }[mode]
  const scope =
    mode === "air"
      ? eq(shipments.serviceType, "express_air")
      : mode === "surface"
        ? inArray(shipments.serviceType, ["road_freight", "standard_ocean"])
        : mode === "warehouse"
          ? inArray(shipments.status, ["pending", "in-transit"])
          : undefined
  await requireStaffPage()
  const params = await searchParams
  const page = parsePage(params.page)
  const query = parseRecordQuery(params, [
    "awbNumber",
    "origin",
    "createdAt",
    "status",
  ])
  if (!statuses.some(({ value }) => value === query.status))
    query.status = "all"
  const pattern = containsPattern(query.q)
  const sortColumns = {
    awbNumber: shipments.awbNumber,
    origin: shipments.origin,
    createdAt: shipments.createdAt,
    status: shipments.status,
  }
  const rows = await db.query.shipments.findMany({
    where: and(
      scope,
      isNull(shipments.deletedAt),
      query.q
        ? or(
            ilike(shipments.awbNumber, pattern),
            ilike(shipments.origin, pattern),
            ilike(shipments.destination, pattern),
            ilike(shipments.consignorName, pattern),
            ilike(shipments.consigneeName, pattern)
          )
        : undefined,
      query.status !== "all"
        ? eq(
            shipments.status,
            query.status as "pending" | "in-transit" | "delivered"
          )
        : undefined
    ),
    with: { invoice: true },
    orderBy: [
      recordOrder(
        sortColumns[query.sort as keyof typeof sortColumns],
        query.order
      ),
      desc(shipments.id),
    ],
    limit: DEFAULT_PAGE_SIZE + 1,
    offset: (page - 1) * DEFAULT_PAGE_SIZE,
  })
  const data = rows.slice(0, DEFAULT_PAGE_SIZE)
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title={title}
        description="Book, follow and update consignments across the network. Search by AWB, route or contact name."
      >
        <ExportPage
          filename={`shipments-page-${page}`}
          rows={[
            ["AWB", "Origin", "Destination", "Service", "Weight kg", "Status"],
            ...data.map((row) => [
              row.awbNumber,
              row.origin,
              row.destination,
              row.serviceType,
              row.weightKg,
              row.status,
            ]),
          ]}
        />
        {mode === "warehouse" ? (
          <>
            <Button asChild variant="outline">
              <Link href="/dashboard/warehouse/audit">Audit log</Link>
            </Button>
            <ScannerDialog>
              <Button>Scan barcode</Button>
            </ScannerDialog>
          </>
        ) : (
          <CreateShipmentDialog />
        )}
      </PageHeader>
      <section
        aria-label="Shipment records"
        className="min-w-0 overflow-hidden rounded-none border bg-card"
      >
        <TableToolbar
          pathname={pathname}
          query={query.q}
          status={query.status}
          statuses={statuses}
          sort={query.sort}
          order={query.order}
          placeholder="AWB, route or contact name"
        />
        <ShipmentsDataTable data={data} sort={query.sort} order={query.order} />
        <PageNavigation
          page={page}
          hasNext={rows.length > DEFAULT_PAGE_SIZE}
          pathname={pathname}
          query={query}
        />
      </section>
    </div>
  )
}
