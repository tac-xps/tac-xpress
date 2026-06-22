import React from "react"
import { db } from "@/lib/db"
import { drivers, vehicles, shipments, manifests } from "@/lib/db/schema"
import { eq, isNull, sql, and } from "drizzle-orm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Truck,
  MapPin,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { DispatchMap } from "@/components/dispatch/dispatch-map"
import { CreateDispatchDialog } from "./create-dispatch-dialog"
import { DispatchClientLayout } from "./dispatch-client-layout" // I will extract the client part
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export default async function DispatchPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const dispatchRows = await db.query.manifests.findMany({
    where: (manifests, { or, ilike }) =>
      or(
        ilike(manifests.referenceId, "PU-%"),
        ilike(manifests.referenceId, "DL-%")
      ),
    with: {
      driver: true,
      vehicle: true,
    },
    orderBy: (manifests, { desc }) => [desc(manifests.createdAt)],
    limit: DEFAULT_PAGE_SIZE + 1,
    offset: (page - 1) * DEFAULT_PAGE_SIZE,
  })
  const hasNext = dispatchRows.length > DEFAULT_PAGE_SIZE
  const dbDispatchRuns = dispatchRows.slice(0, DEFAULT_PAGE_SIZE)
  // Active shipments for Kanban (excluding delivered/cancelled)
  const activeShipments = await db.query.shipments.findMany({
    where: (shipments, { and, ne, isNull }) =>
      and(ne(shipments.status, "delivered"), isNull(shipments.deletedAt)),
    with: {
      manifestItems: true,
    },
    limit: 100,
  })

  const unassignedPendingShipments = activeShipments.filter(
    (s) => s.status === "pending" && s.manifestItems.length === 0
  )

  const queueItems = activeShipments.map((s) => {
    let columnId: string = s.status
    if (s.status === "in-transit") columnId = "in_transit"

    return {
      id: s.awbNumber,
      route: `${s.origin} → ${s.destination}`,
      type: s.weightKg && s.weightKg > 500 ? "FTL" : "LTL",
      status: s.status,
      time: "Ready",
      column: columnId,
      name: s.awbNumber,
      isAssigned: s.manifestItems.length > 0,
    }
  })

  return (
    <>
      <DispatchClientLayout
        pendingShipments={unassignedPendingShipments}
        queueItems={queueItems}
        dispatchRuns={dbDispatchRuns}
      />
      <PageNavigation
        page={page}
        hasNext={hasNext}
        pathname="/dashboard/dispatch"
      />
    </>
  )
}
