import { requireStaffPage } from "@/lib/auth/page-access"
import { AnalyticsIcon } from "@/components/icons/sidebar-icons"
import { getAnalyticsOverview, parseAnalyticsPeriod } from "@/lib/dashboard-metrics"
import { AnalyticsTabsContainer } from "./tabs-container"

export default async function AnalyticsPage(props: {
  searchParams: Promise<{ period?: string }>
}) {
  await requireStaffPage()
  const searchParams = await props.searchParams
  const period = parseAnalyticsPeriod(searchParams.period)
  const overview = await getAnalyticsOverview(period)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 px-6 md:px-8 py-6 md:py-8 shrink-0">
        <div className="shrink-0 rounded-none bg-primary/10 p-3">
          <AnalyticsIcon className="size-8 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Live operational signals drawn directly from the current data model.
          </p>
        </div>
      </div>

      <AnalyticsTabsContainer overview={overview} period={period} />
    </div>
  )
}
