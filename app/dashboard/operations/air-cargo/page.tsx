import React from "react"
import { db } from "@/lib/db"
import { shipments } from "@/lib/db/schema"
import { eq, desc, isNull, or } from "drizzle-orm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShipmentsDataTable } from "@/app/dashboard/shipments/shipment-data-table"
import { PlaneIcon } from "lucide-react"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export default async function AirCargoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const rows = await db.query.shipments.findMany({
    where: (shipments, { isNull, and, eq }) => 
      and(
        isNull(shipments.deletedAt),
        eq(shipments.serviceType, "express_air")
      ),
    with: {
      invoice: true,
    },
    orderBy: (shipments, { desc }) => [desc(shipments.createdAt)],
  })
  
  const hasNext = rows.length > page * DEFAULT_PAGE_SIZE
  const paginatedShipments = rows.slice(
    (page - 1) * DEFAULT_PAGE_SIZE,
    page * DEFAULT_PAGE_SIZE
  )

  const totalVolume = rows.length
  const inTransit = rows.filter(s => s.status === "in-transit").length
  const delayedFlights = rows.filter(s => s.slaAtRisk === true).length

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 md:gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-sky-500/10 p-3">
            <PlaneIcon className="size-8 text-sky-500" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Air Cargo Operations
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor high-priority express air shipments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Air Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVolume}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In-Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{inTransit}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delayed / At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{delayedFlights}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden delay-0">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 p-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Active Air Shipments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full">
            <ShipmentsDataTable data={paginatedShipments} />
          </div>
          <PageNavigation
            page={page}
            hasNext={hasNext}
            pathname="/dashboard/operations/air-cargo"
          />
        </CardContent>
      </Card>
    </div>
  )
}
