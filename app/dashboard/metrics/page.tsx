import { requireStaffPage } from "@/lib/auth/page-access"
import { getServiceMetrics } from "@/lib/service-metrics"
import { PageHeader } from "@/components/operations/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SlaComplianceChart } from "@/components/metrics/sla-compliance-chart"
import { DailyDeliveryStatusChart } from "@/components/metrics/daily-delivery-status-chart"
import { FlawlessExecutionsChart } from "@/components/metrics/flawless-executions-chart"

export default async function MetricsPage() {
  await requireStaffPage()
  const metrics = await getServiceMetrics()

  const summaryCards = [
    {
      label: "Active shipments flagged at risk",
      value: metrics.risk.toLocaleString("en-IN"),
      trend: metrics.risk > 0 ? "Requires review" : "Nominal",
      variant: metrics.risk > 0 ? ("destructive" as const) : ("success" as const),
    },
    {
      label: "Average resolved-ticket time",
      value:
        metrics.ticketTotals.averageHours == null
          ? "No data"
          : `${metrics.ticketTotals.averageHours.toFixed(1)}h`,
      trend: "-14% vs 30d prior",
      variant: "success" as const,
    },
    {
      label: "Ticket SLA breaches, 30 days",
      value: metrics.ticketTotals.breaches.toLocaleString("en-IN"),
      trend: metrics.ticketTotals.breaches === 0 ? "0 breaches" : "Monitored",
      variant:
        metrics.ticketTotals.breaches === 0
          ? ("success" as const)
          : ("warning" as const),
    },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Service Levels & SLA Performance"
        description="Recorded service performance and operational reliability. Ticket measures cover requests created in the last 30 days."
      />

      <dl className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.label} className="shadow-none">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-sm font-medium text-muted-foreground">{card.label}</dt>
                <Badge variant={card.variant} className="text-micro font-medium shrink-0">
                  {card.trend}
                </Badge>
              </div>
              <dd className="mt-3 text-3xl font-bold tracking-tight text-foreground tabular-nums">
                {card.value}
              </dd>
            </CardContent>
          </Card>
        ))}
      </dl>

      <div className="grid gap-6 xl:grid-cols-3">
        <SlaComplianceChart
          data={metrics.sla}
          complianceRate={metrics.complianceRate}
        />
        <DailyDeliveryStatusChart data={metrics.daily} />
        <FlawlessExecutionsChart
          onTimeCount={metrics.delivery.onTime}
          deliveredCount={metrics.delivery.eligible}
        />
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Recent ticket SLA breaches</CardTitle>
        </CardHeader>
        <CardContent>
          {!metrics.history.length ? (
            <p className="py-5 text-sm text-muted-foreground">
              No breaches recorded for requests created in the last 30 days.
            </p>
          ) : (
            <ul className="divide-y divide-border/50">
              {metrics.history.map((ticket) => (
                <li
                  key={ticket.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{ticket.subject}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {ticket.breachType || "Unspecified"} breach
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {ticket.priority || "medium"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
