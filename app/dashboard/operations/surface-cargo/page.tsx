import { db } from "@/lib/db"
import { TruckIcon } from "lucide-react"
import { parsePage } from "@/components/ui/page-navigation"
import { OperationsDashboardPage } from "../_components/operations-dashboard-page"

export default async function SurfaceCargoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)

  const rows = await db.query.shipments.findMany({
    where: (s, { isNull, and, inArray }) =>
      and(
        isNull(s.deletedAt),
        inArray(s.serviceType, ["standard_ocean", "road_freight"])
      ),
    with: { invoice: true },
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  })

  const totalDispatches = rows.length
  const fleetEnRoute = rows.filter((s) => s.status === "in-transit").length
  const borderDelays = rows.filter((s) => s.slaAtRisk === true).length

  return (
    <OperationsDashboardPage
      page={page}
      rows={rows}
      icon={<TruckIcon className="size-8 text-emerald-500" />}
      iconBg="bg-emerald-500/10"
      heading="Surface Cargo Operations"
      description="Monitor road and ocean freight movements."
      tableTitle="Active Surface Shipments"
      pathname="/dashboard/operations/surface-cargo"
      kpiCards={[
        { label: "Total Dispatches", value: totalDispatches },
        { label: "Fleet En Route", value: fleetEnRoute, colourClass: "text-amber-500" },
        { label: "Border Delays / At Risk", value: borderDelays, colourClass: "text-destructive" },
      ]}
    />
  )
}
