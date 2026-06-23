import React from "react"
import { db } from "@/lib/db"
import { shipments, users } from "@/lib/db/schema"
import { eq, desc, isNull, and } from "drizzle-orm"
import { CreateShipmentDialog } from "./create-shipment-dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ShipmentsDataTable } from "./shipment-data-table"
import { ShipmentsIcon } from "@/components/icons/sidebar-icons"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const rows = await db.query.shipments.findMany({
    where: (shipments, { isNull }) => isNull(shipments.deletedAt),
    with: {
      invoice: true,
    },
    orderBy: (shipments, { desc }) => [desc(shipments.createdAt)],
    limit: DEFAULT_PAGE_SIZE + 1,
    offset: (page - 1) * DEFAULT_PAGE_SIZE,
  })
  const hasNext = rows.length > DEFAULT_PAGE_SIZE
  const allShipments = rows.slice(0, DEFAULT_PAGE_SIZE)

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 md:gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <ShipmentsIcon className="size-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              All Shipments
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your entire freight network.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-border/50 bg-background">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <CreateShipmentDialog />
        </div>
      </div>

      <Card className="overflow-hidden delay-0">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 p-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full">
            <ShipmentsDataTable data={allShipments} />
          </div>
          <PageNavigation
            page={page}
            hasNext={hasNext}
            pathname="/dashboard/shipments"
          />
        </CardContent>
      </Card>
    </div>
  )
}
