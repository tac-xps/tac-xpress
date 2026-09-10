import type { DashboardStats } from "@/lib/dashboard-metrics"
interface StatisticsBlockProps { stats: DashboardStats }
export function StatisticsBlock({ stats }: StatisticsBlockProps) {
  const metrics = [{ label: "Total dispatches", value: stats.totalDispatches, trend: stats.trends.dispatches }, { label: "Air cargo", value: stats.airCargo, trend: stats.trends.air }, { label: "Surface cargo", value: stats.surfaceCargo, trend: stats.trends.surface }, { label: "Pick & drop runs", value: stats.pickDrop, trend: stats.trends.pick }]
  return <dl className="grid grid-cols-2 overflow-hidden rounded-none border bg-card lg:grid-cols-4">{metrics.map(metric => <div key={metric.label} className="flex flex-col gap-3 border-b p-5 odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 sm:p-6"><dt className="text-sm text-muted-foreground">{metric.label}</dt><dd className="text-3xl font-semibold tracking-tight tabular-nums">{metric.value.toLocaleString("en-IN")}</dd><dd className="text-xs text-muted-foreground">{metric.trend === null ? "No prior month comparison" : (metric.trend >= 0 ? "+" : "") + metric.trend + "% from prior month"}</dd></div>)}</dl>
}
