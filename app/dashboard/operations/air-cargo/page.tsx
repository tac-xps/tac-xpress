import type { Metadata } from "next"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { PlaneIcon } from "lucide-react"
import { parsePage } from "@/components/ui/page-navigation"
import { OperationsDashboardPage } from "../_components/operations-dashboard-page"

export const metadata: Metadata = {
  title: "Air Cargo Operations | TAC-XPRESS",
  description: "Express air cargo linehaul telemetry, flight transit status, and air manifests.",
}

export default async function AirCargoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  await requireStaffPage()
  const page = parsePage((await searchParams).page)

  // shortcut: 100 recent shipments for live telemetry to prevent OOM, upgrade to dedicated aggregate pipeline under higher volume
  const rows = await db.query.shipments.findMany({
    where: (s, { isNull, and, eq }) =>
      and(isNull(s.deletedAt), eq(s.serviceType, "express_air")),
    with: { invoice: true },
    orderBy: (s, { desc }) => [desc(s.createdAt)],
    limit: 100,
  })

  const totalVolume = rows.length
  const inTransit = rows.filter((s) => s.status === "in-transit").length
  const delayedFlights = rows.filter((s) => s.slaAtRisk === true).length

  return (
    <OperationsDashboardPage
      page={page}
      rows={rows}
      icon={<PlaneIcon className="size-8 text-primary" />}
      iconBg="bg-primary/10"
      heading="Air Cargo Operations"
      description="Monitor high-priority express air shipments across IATA corridors (DEL-GAU, CCU-IMF, GAU-IXA) with standard 1:5000 volumetric divisor."
      tableTitle="Active Air Shipments"
      pathname="/dashboard/operations/air-cargo"
      kpiCards={[
        { label: "Total Air Volume", value: totalVolume },
        { label: "In-Transit", value: inTransit, colourClass: "text-status-pending" },
        { label: "Delayed / At Risk", value: delayedFlights, colourClass: "text-destructive" },
      ]}
    />
  )
}
