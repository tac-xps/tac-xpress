import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import type { DashboardStats, TrendValue } from "@/lib/dashboard-metrics"

type StatisticsBlockProps = {
  stats: DashboardStats
}

function TrendLine({
  trend,
  fallback,
}: {
  trend: TrendValue
  fallback: string
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
      <span className="ml-1 text-foreground/70">vs last month</span>
    </div>
  )
}

export function StatisticsBlock({ stats }: StatisticsBlockProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="group/stat relative flex h-[140px] flex-col justify-center overflow-hidden transition-all delay-0 duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/dashboard/1a.png')] bg-contain bg-right bg-no-repeat opacity-60 mix-blend-luminosity transition-transform duration-700 ease-out group-hover/stat:scale-105 dark:bg-[url('/images/dashboard/1b.png')]" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
        </div>
        <CardContent className="relative z-10 flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/80">
              Total Dispatches
            </p>
            <p className="text-3xl font-bold tracking-tight tabular-nums drop-shadow-sm">
              {stats.totalDispatches.toLocaleString()}
            </p>
            <TrendLine
              trend={stats.trends.dispatches}
              fallback="No prior month baseline"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="group/stat relative flex h-[140px] flex-col justify-center overflow-hidden transition-all delay-75 duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/dashboard/2a.png')] bg-contain bg-right bg-no-repeat opacity-60 mix-blend-luminosity transition-transform duration-700 ease-out group-hover/stat:scale-105 dark:bg-[url('/images/dashboard/2b.png')]" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
        </div>
        <CardContent className="relative z-10 flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/80">Air Cargo</p>
            <p className="text-3xl font-bold tracking-tight tabular-nums drop-shadow-sm">
              {stats.airCargo.toLocaleString()}
            </p>
            <TrendLine
              trend={stats.trends.air}
              fallback="No prior month baseline"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="group/stat relative flex h-[140px] flex-col justify-center overflow-hidden transition-all delay-150 duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/dashboard/3a.png')] bg-contain bg-right bg-no-repeat opacity-60 mix-blend-luminosity transition-transform duration-700 ease-out group-hover/stat:scale-105 dark:bg-[url('/images/dashboard/3b.png')]" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
        </div>
        <CardContent className="relative z-10 flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/80">
              Surface Cargo
            </p>
            <p className="text-3xl font-bold tracking-tight tabular-nums drop-shadow-sm">
              {stats.surfaceCargo.toLocaleString()}
            </p>
            <TrendLine
              trend={stats.trends.surface}
              fallback="No prior month baseline"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="group/stat relative flex h-[140px] flex-col justify-center overflow-hidden transition-all delay-200 duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/dashboard/4a.png')] bg-contain bg-right bg-no-repeat opacity-60 mix-blend-luminosity transition-transform duration-700 ease-out group-hover/stat:scale-105 dark:bg-[url('/images/dashboard/4b.png')]" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
        </div>
        <CardContent className="relative z-10 flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/80">
              Pick &amp; Drop Runs
            </p>
            <p className="text-3xl font-bold tracking-tight tabular-nums drop-shadow-sm">
              {stats.pickDrop.toLocaleString()}
            </p>
            <TrendLine
              trend={stats.trends.pick}
              fallback="No prior month baseline"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
