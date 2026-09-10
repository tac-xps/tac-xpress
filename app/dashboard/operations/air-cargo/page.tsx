import { db } from "@/lib/db"
import { PlaneIcon } from "lucide-react"
import { parsePage } from "@/components/ui/page-navigation"
import { OperationsDashboardPage } from "../_components/operations-dashboard-page"

export default async function AirCargoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)

  const rows = await db.query.shipments.findMany({
    where: (s, { isNull, and, eq }) =>
      and(isNull(s.deletedAt), eq(s.serviceType, "express_air")),
    with: { invoice: true },
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  })

  const totalVolume = rows.length
  const inTransit = rows.filter((s) => s.status === "in-transit").length
  const delayedFlights = rows.filter((s) => s.slaAtRisk === true).length

  return (
    <OperationsDashboardPage
      page={page}
      rows={rows}
      icon={<PlaneIcon className="size-8 text-sky-500" />}
      iconBg="bg-sky-500/10"
      heading="Air Cargo Operations"
      description="Monitor high-priority express air shipments."
      tableTitle="Active Air Shipments"
      pathname="/dashboard/operations/air-cargo"
      kpiCards={[
        { label: "Total Air Volume", value: totalVolume },
        { label: "In-Transit", value: inTransit, colourClass: "text-amber-500" },
        { label: "Delayed / At Risk", value: delayedFlights, colourClass: "text-destructive" },
      ]}
    />
  )
}
