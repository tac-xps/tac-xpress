import type { Metadata } from "next"
import { format } from "date-fns"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { shipments, manifestItems, manifestItemHandoffs } from "@/lib/db/schema"
import {
  and,
  asc,
  eq,
  exists,
  not,
  notExists,
  isNull,
  or,
  ilike,
} from "drizzle-orm"
import { firstParam, containsPattern } from "@/lib/table-query"
import { DispatchClientLayout } from "./dispatch-client-layout"
import { DEFAULT_PAGE_SIZE, parsePage } from "@/components/ui/page-navigation"

export const metadata: Metadata = {
  title: "Dispatch & Routing | TAC-XPRESS",
}

export default async function DispatchPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string | string[]
    view?: string
    q?: string | string[]
  }>
}) {
  await requireStaffPage()

  const params = await searchParams
  const page = parsePage(params.page)
  const q = firstParam(params.q).trim().slice(0, 100)
  const pattern = containsPattern(q)
  const dispatchRows = await db.query.manifests.findMany({
    where: (manifests, { inArray }) =>
      inArray(manifests.legType, ["pickup", "delivery"]),
    with: {
      driver: true,
      vehicle: true,
      items: {
        with: {
          shipment: { columns: { status: true, awbNumber: true } },
          handoffs: true,
        },
      },
    },
    orderBy: (manifests, { desc }) => [desc(manifests.createdAt)],
    limit: DEFAULT_PAGE_SIZE + 1,
    offset: (page - 1) * DEFAULT_PAGE_SIZE,
  })
  const hasNext = dispatchRows.length > DEFAULT_PAGE_SIZE
  const dbDispatchRuns = dispatchRows.slice(0, DEFAULT_PAGE_SIZE)
  const hasReceipt = exists(
    db
      .select({ id: manifestItemHandoffs.id })
      .from(manifestItemHandoffs)
      .innerJoin(
        manifestItems,
        eq(manifestItems.id, manifestItemHandoffs.manifestItemId)
      )
      .where(
        and(
          eq(manifestItems.shipmentId, shipments.id),
          eq(manifestItemHandoffs.outcome, "received")
        )
      )
  )
  const candidateRows = await db.query.shipments.findMany({
    where: and(
      isNull(shipments.deletedAt),
      notExists(
        db
          .select({ id: manifestItems.id })
          .from(manifestItems)
          .where(
            and(
              eq(manifestItems.shipmentId, shipments.id),
              eq(manifestItems.isActive, true)
            )
          )
      ),
      or(
        and(eq(shipments.status, "pending"), not(hasReceipt)),
        and(eq(shipments.status, "in-transit"), hasReceipt)
      ),
      q
        ? or(
            ilike(shipments.awbNumber, pattern),
            ilike(shipments.origin, pattern),
            ilike(shipments.destination, pattern)
          )
        : undefined
    ),
    with: { manifestItems: { with: { handoffs: true } } },
    orderBy: [asc(shipments.createdAt), asc(shipments.id)],
    limit: DEFAULT_PAGE_SIZE + 1,
    offset: (page - 1) * DEFAULT_PAGE_SIZE,
  })
  const queueHasNext = candidateRows.length > DEFAULT_PAGE_SIZE
  const activeShipments = candidateRows.slice(0, DEFAULT_PAGE_SIZE)

  const unassignedPendingShipments = activeShipments.filter(
    (s) =>
      s.status === "pending" &&
      !s.manifestItems.some((item) => item.isActive) &&
      !s.manifestItems.some((item) =>
        item.handoffs.some((handoff) => handoff.outcome === "received")
      )
  )
  const readyForDeliveryShipments = activeShipments.filter(
    (s) =>
      s.status === "in-transit" &&
      !s.manifestItems.some((item) => item.isActive) &&
      s.manifestItems.some((item) =>
        item.handoffs.some((handoff) => handoff.outcome === "received")
      )
  )

  const queueItems = activeShipments.map((s) => {
    let columnId: string = s.status
    if (s.status === "in-transit") columnId = "in_transit"

    return {
      id: s.awbNumber,
      shipmentId: s.id,
      route: `${s.origin} → ${s.destination}`,
      type: s.serviceType === "express_air" ? "Air cargo" : "Surface cargo",
      status: s.status,
      time: `Booked ${format(new Date(s.bookingDate), "dd MMM yyyy")}`,
      column: columnId,
      name: s.awbNumber,
      isAssigned: s.manifestItems.some((item) => item.isActive),
    }
  })

  return (
    <>
      <DispatchClientLayout
        pendingShipments={unassignedPendingShipments}
        deliveryShipments={readyForDeliveryShipments}
        queueItems={queueItems}
        dispatchRuns={dbDispatchRuns}
        page={page}
        hasNext={hasNext}
        queueHasNext={queueHasNext}
        searchQuery={q}
        view={params.view === "runs" ? "runs" : "board"}
      />
    </>
  )
}
