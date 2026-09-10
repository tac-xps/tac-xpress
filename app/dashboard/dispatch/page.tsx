import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { DispatchClientLayout } from "./dispatch-client-layout"
import { DEFAULT_PAGE_SIZE, parsePage } from "@/components/ui/page-navigation"

export default async function DispatchPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; view?: string }>
}) {
  await requireStaffPage()

  const params = await searchParams
  const page = parsePage(params.page)
  const dispatchRows = await db.query.manifests.findMany({
    where: (manifests, { or, ilike }) =>
      or(
        ilike(manifests.referenceId, "PU-%"),
        ilike(manifests.referenceId, "DL-%")
      ),
    with: {
      driver: true,
      vehicle: true,
      items: { with: { shipment: { columns: { status: true } } } },
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
    orderBy: (table, { desc }) => [desc(table.createdAt), desc(table.id)],
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
      shipmentId: s.id,
      route: `${s.origin} → ${s.destination}`,
      type: s.serviceType === "express_air" ? "Air cargo" : "Surface cargo",
      status: s.status,
      time: `Booked ${s.bookingDate.toLocaleDateString("en-IN")}`,
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
        page={page}
        hasNext={hasNext}
        view={params.view === "runs" ? "runs" : "board"}
      />
    </>
  )
}
