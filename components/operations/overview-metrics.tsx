import Link from "next/link"
import type { DashboardStats } from "@/lib/dashboard-metrics"
export function OverviewMetrics({ stats }: { stats: DashboardStats }) {
  const metrics = [
    {
      label: "Shipments",
      value: stats.totalDispatches,
      href: "/dashboard/shipments",
    },
    {
      label: "Air cargo",
      value: stats.airCargo,
      href: "/dashboard/operations/air-cargo",
    },
    {
      label: "Surface cargo",
      value: stats.surfaceCargo,
      href: "/dashboard/operations/surface-cargo",
    },
    {
      label: "Pickup & delivery runs",
      value: stats.pickDrop,
      href: "/dashboard/dispatch",
    },
  ]
  return (
    <section
      aria-label="All-time operational totals"
      className="rounded-none border bg-card"
    >
      <div className="border-b border-l-2 border-l-primary px-5 py-3 text-xs text-muted-foreground">
        All-time totals · excludes deleted shipments
      </div>
      <dl className="grid grid-cols-2 gap-y-6 p-5 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="px-1 lg:border-l lg:px-6 lg:first:border-0 lg:first:pl-0"
          >
            <dt className="text-sm text-muted-foreground">
              <Link
                href={metric.href}
                className="hover:text-foreground hover:underline"
              >
                {metric.label}
              </Link>
            </dt>
            <dd className="mt-3 text-3xl font-medium tracking-tight tabular-nums">
              {metric.value.toLocaleString("en-IN")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
