import type { Metadata } from "next"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { TruckIcon } from "lucide-react"
import { parsePage } from "@/components/ui/page-navigation"
import { OperationsDashboardPage } from "../_components/operations-dashboard-page"

export const metadata: Metadata = {
  title: "Surface Cargo Operations | TAC-XPRESS",
  description: "Road freight, surface cargo linehaul, transit vehicles, and logistics status.",
}

export default async function SurfaceCargoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  await requireStaffPage()
  const page = parsePage((await searchParams).page)

  // shortcut: 100 recent shipments queried for live telemetry to prevent memory spikes. Fix condition: active surface shipment volume exceeds 1,000 active records.
  const rows = await db.query.shipments.findMany({
    where: (s, { isNull, and, inArray }) =>
      and(
        isNull(s.deletedAt),
        inArray(s.serviceType, ["standard_ocean", "road_freight"])
      ),
    with: { invoice: true },
    orderBy: (s, { desc }) => [desc(s.createdAt)],
    limit: 100,
  })

  const totalDispatches = rows.length
  const fleetEnRoute = rows.filter((s) => s.status === "in-transit").length
  const borderDelays = rows.filter((s) => s.slaAtRisk === true).length

  return (
    <OperationsDashboardPage
      cargoMode="surface"
      page={page}
      rows={rows}
      icon={<TruckIcon className="size-8 text-status-delivered" />}
      iconBg="bg-status-delivered/10"
      heading="Surface Cargo Operations"
      description="Review surface shipments between New Delhi and Imphal (DEL ⇄ IMF)."
      tableTitle="Recent surface shipments"
      pathname="/dashboard/operations/surface-cargo"
      kpiCards={[
        { label: "Surface shipments in sample", value: totalDispatches },
        { label: "In-transit shipments", value: fleetEnRoute, colourClass: "text-status-transit" },
        { label: "At-risk shipments", value: borderDelays, colourClass: "text-destructive" },
      ]}
    />
  )
}
