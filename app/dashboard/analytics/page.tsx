import { requireStaffPage } from "@/lib/auth/page-access"
import { getAnalyticsOverview, parseAnalyticsPeriod } from "@/lib/dashboard-metrics"
import { PageHeader } from "@/components/operations/page-header"
import { AnalyticsTabsContainer } from "./tabs-container"

export default async function AnalyticsPage(props: {
  searchParams: Promise<{ period?: string }>
}) {
  await requireStaffPage()
  const searchParams = await props.searchParams
  const period = parseAnalyticsPeriod(searchParams.period)
  const overview = await getAnalyticsOverview(period)

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="px-6 md:px-8 pt-6 md:pt-8 shrink-0">
        <PageHeader
          title="Analytics"
          description="Live operational signals drawn directly from the current data model."
        />
      </div>

      <AnalyticsTabsContainer overview={overview} period={period} />
    </div>
  )
}
