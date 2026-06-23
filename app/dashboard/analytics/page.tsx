import { FleetUtilizationChart } from "@/components/analytics/fleet-utilization-chart"
import { AnalyticsIcon } from "@/components/icons/sidebar-icons"
import { Card, CardContent } from "@/components/ui/card"
import { getAnalyticsOverview, type TrendValue } from "@/lib/dashboard-metrics"
import { TrendingDown, TrendingUp } from "lucide-react"
import { OperationsBreakdown } from "@/components/analytics/operations-breakdown"

function TrendNote({
  trend,
  fallback,
  context,
}: {
  trend: TrendValue
  fallback: string
  context: string
}) {
  if (trend === null) {
    return (
      <div className="mt-2 text-xs font-medium text-muted-foreground">
        {fallback}
      </div>
    )
  }

  const isPositive = trend >= 0

  return (
    <div
      className={`mt-2 flex items-center gap-1 text-xs font-medium ${
        isPositive ? "text-status-delivered" : "text-destructive"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="size-3.5" />
      ) : (
        <TrendingDown className="size-3.5" />
      )}
      <span className="tracking-tight tabular-nums">
        {Math.abs(trend).toFixed(1)}%
      </span>
      <span className="ml-1 text-foreground/70">{context}</span>
    </div>
  )
}

function formatPercent(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`
}

export default async function AnalyticsPage() {
  const overview = await getAnalyticsOverview()

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 md:gap-8">
      <div className="flex items-center gap-4">
        <div className="shrink-0 rounded-lg bg-primary/10 p-3">
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="group/stat relative flex h-[140px] flex-col justify-center overflow-hidden transition-all delay-0 duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/dashboard/5a.png')] bg-contain bg-right bg-no-repeat transition-transform duration-700 ease-out group-hover/stat:scale-105 dark:bg-[url('/images/dashboard/5b.png')]" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
          </div>
          <CardContent className="relative z-10 flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/80">
                Network Volume
              </p>
              <p className="text-3xl font-bold tracking-tight tabular-nums drop-shadow-sm">
                {overview.networkVolume.toLocaleString()}
              </p>
              <TrendNote
                trend={overview.networkVolumeTrend}
                fallback="No prior period baseline"
                context="vs prior 30 days"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="group/stat relative flex h-[140px] flex-col justify-center overflow-hidden transition-all delay-75 duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/dashboard/6a.png')] bg-contain bg-right bg-no-repeat transition-transform duration-700 ease-out group-hover/stat:scale-105 dark:bg-[url('/images/dashboard/6b.png')]" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
          </div>
          <CardContent className="relative z-10 flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/80">
                Fleet Efficiency
              </p>
              <p className="text-3xl font-bold tracking-tight tabular-nums drop-shadow-sm">
                {formatPercent(overview.fleetEfficiency)}
              </p>
              <TrendNote
                trend={overview.fleetEfficiencyTrend}
                fallback="Current managed-vehicle snapshot"
                context="vs prior period"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="group/stat relative flex h-[140px] flex-col justify-center overflow-hidden transition-all delay-150 duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/dashboard/7a.png')] bg-contain bg-right bg-no-repeat transition-transform duration-700 ease-out group-hover/stat:scale-105 dark:bg-[url('/images/dashboard/7b.png')]" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
          </div>
          <CardContent className="relative z-10 flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground/80">
                On-Time Performance
              </p>
              <p className="text-3xl font-bold tracking-tight tabular-nums drop-shadow-sm">
                {formatPercent(overview.onTimePerformance)}
              </p>
              <TrendNote
                trend={overview.onTimePerformanceTrend}
                fallback="Not enough delivered shipments yet"
                context="vs prior 30 days"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FleetUtilizationChart
          managedTotal={overview.fleetAvailability.managedTotal}
          managedOperational={overview.fleetAvailability.managedOperational}
          registryTotal={overview.fleetAvailability.registryTotal}
          registryOperational={overview.fleetAvailability.registryOperational}
          data={overview.fleetAvailability.data}
        />
      </div>

      <OperationsBreakdown data={overview} />
    </div>
  )
}
