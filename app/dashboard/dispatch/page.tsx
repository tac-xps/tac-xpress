import type { Metadata } from "next"
import { format } from "date-fns"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { DispatchClientLayout } from "./dispatch-client-layout"
import { DEFAULT_PAGE_SIZE, parsePage } from "@/components/ui/page-navigation"

export const metadata: Metadata = {
  title: "Dispatch & Routing | TAC-XPRESS",
}

export default async function DispatchPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; view?: string }>
}) {
  await requireStaffPage()

  const params = await searchParams
  const page = parsePage(params.page)
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
  // Active shipments for Kanban (excluding delivered/cancelled)
  const activeShipments = await db.query.shipments.findMany({
    where: (shipments, { and, ne, isNull }) =>
      and(ne(shipments.status, "delivered"), isNull(shipments.deletedAt)),
    with: {
      manifestItems: { with: { handoffs: true } },
      legs: true,
    },
    orderBy: (table, { desc }) => [desc(table.createdAt), desc(table.id)],
    limit: 100,
  })

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

    const sortedLegs = s.legs
      ? [...s.legs].sort((a, b) => a.legNumber - b.legNumber)
      : []
    const activeLeg =
      sortedLegs.find((l) => l.status === "in_transit") ??
      sortedLegs.find((l) => l.status === "pending")

    const legInfo =
      sortedLegs.length > 0 && activeLeg
        ? {
            legNumber: activeLeg.legNumber,
            totalLegs: sortedLegs.length,
            currentRoute: `${activeLeg.originLocation} → ${activeLeg.destinationLocation}`,
          }
        : undefined

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
      legInfo,
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
        view={params.view === "runs" ? "runs" : "board"}
      />
    </>
  )
}
