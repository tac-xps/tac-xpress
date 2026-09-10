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
  return <div className="flex min-w-0 flex-col gap-6"><PageHeader title="Service levels" description="Recorded service performance. Ticket measures cover requests created in the last 30 days; missing assessments are excluded." /><dl className="grid gap-4 sm:grid-cols-3">{[["Active shipments flagged at risk", metrics.risk.toLocaleString("en-IN")], ["Average resolved-ticket time", metrics.ticketTotals.averageHours == null ? "No data" : `${metrics.ticketTotals.averageHours.toFixed(1)}h`], ["Ticket SLA breaches, 30 days", metrics.ticketTotals.breaches.toLocaleString("en-IN")]].map(([label, value]) => <Card key={label} className="shadow-none"><CardContent><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-3 text-3xl font-medium tabular-nums">{value}</dd></CardContent></Card>)}</dl><div className="grid gap-6 xl:grid-cols-3"><SlaComplianceChart data={metrics.sla} complianceRate={metrics.complianceRate} /><DailyDeliveryStatusChart data={metrics.daily} /><FlawlessExecutionsChart onTimeCount={metrics.delivery.onTime} deliveredCount={metrics.delivery.eligible} /></div><Card className="shadow-none"><CardHeader><CardTitle>Recent ticket SLA breaches</CardTitle></CardHeader><CardContent>{!metrics.history.length ? <p className="py-5 text-sm text-muted-foreground">No breaches recorded for requests created in the last 30 days.</p> : <ul className="divide-y">{metrics.history.map((ticket) => <li key={ticket.id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate font-medium">{ticket.subject}</p><p className="mt-1 text-xs text-muted-foreground">{ticket.breachType || "Unspecified"} breach</p></div><Badge variant="outline">{ticket.priority || "medium"}</Badge></li>)}</ul>}</CardContent></Card></div>
}
