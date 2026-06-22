import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`))
}

function formatCurrency(amountPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100)
}

export function OperationsBreakdown({ data }: { data: AnalyticsOverview }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <AnalyticsCard title="Shipment volume by service">
        {data.shipmentVolumeByMonth.map((row) => (
          <MetricRow
            key={row.month}
            label={formatMonth(row.month)}
            value={`Air ${row.air} · Road ${row.road}`}
          />
        ))}
      </AnalyticsCard>
      <AnalyticsCard title="Revenue trend">
        {data.revenueByMonth.map((row) => (
          <MetricRow
            key={row.month}
            label={formatMonth(row.month)}
            value={formatCurrency(row.amountPaise)}
          />
        ))}
      </AnalyticsCard>
      <AnalyticsCard title="Top routes by volume">
        {data.topRoutes.map((row) => (
          <MetricRow
            key={row.route}
            label={row.route}
            value={`${row.volume.toLocaleString("en-IN")} shipments`}
            mono
          />
        ))}
      </AnalyticsCard>
      <AnalyticsCard title="Customer growth">
        {data.customerGrowthByMonth.map((row) => (
          <MetricRow
            key={row.month}
            label={formatMonth(row.month)}
            value={`${row.customers.toLocaleString("en-IN")} new customers`}
          />
        ))}
      </AnalyticsCard>
    </div>
  )
}

function AnalyticsCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const hasRows = Array.isArray(children)
    ? children.length > 0
    : Boolean(children)
  return (
    <Card>
      <CardHeader className="border-b border-border/60">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {hasRows ? (
          <div className="divide-y divide-border/60">{children}</div>
        ) : (
          <Empty className="min-h-40">
            <EmptyHeader>
              <EmptyTitle>No data yet</EmptyTitle>
              <EmptyDescription>
                This panel will populate as operational records are created.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

function MetricRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
      <span className={mono ? "font-mono" : undefined}>{label}</span>
      <span className="text-right font-medium text-muted-foreground tabular-nums">
        {value}
      </span>
    </div>
  )
}
