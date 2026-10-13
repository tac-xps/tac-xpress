import type { Metadata } from "next"
import { requireStaffPage } from "@/lib/auth/page-access"
import { getAnalyticsOverview, parseAnalyticsPeriod } from "@/lib/dashboard-metrics"
import { PageHeader } from "@/components/operations/page-header"
import { AnalyticsTabsContainer } from "./tabs-container"

export const metadata: Metadata = {
  title: "Analytics | TAC-XPRESS",
  description: "Live operational signals, throughput analytics, and performance indicators.",
}

export default async function AnalyticsPage(props: {
  searchParams: Promise<{ period?: string }>
}) {
  await requireStaffPage()
  const searchParams = await props.searchParams
  const period = parseAnalyticsPeriod(searchParams.period)
  const overview = await getAnalyticsOverview(period)

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Live operational signals drawn directly from the current data model."
      />

      <AnalyticsTabsContainer overview={overview} period={period} />
    </div>
  )
}
