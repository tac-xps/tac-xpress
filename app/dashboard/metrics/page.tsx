import { AlertTriangle, Clock3, History } from "lucide-react"
import { SlaComplianceChart } from "@/components/metrics/sla-compliance-chart"
import { DailyDeliveryStatusChart } from "@/components/metrics/daily-delivery-status-chart"
import { FlawlessExecutionsChart } from "@/components/metrics/flawless-executions-chart"
import { MetricsIcon } from "@/components/icons/sidebar-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabaseAdmin } from "@/lib/supabase/clients"

export const dynamic = "force-dynamic"

interface TicketMetricRow {
  id: string
  subject: string
  priority: string | null
  status: string
  created_at: string
  resolved_at: string | null
  sla_breached: boolean | null
  sla_breach_type: string | null
}

interface ShipmentMetricRow {
  status: string
  booking_date: string
  edd: string | null
  updated_at: string
  sla_at_risk: boolean | null
}

function hoursBetween(start: string, end: string) {
  return (new Date(end).getTime() - new Date(start).getTime()) / 3_600_000
}

export default async function MetricsPage() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000).toISOString()
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString()

  const [ticketResult, shipmentResult] = await Promise.all([
    supabaseAdmin
      .from("tickets")
      .select(
        "id, subject, priority, status, created_at, resolved_at, sla_breached, sla_breach_type"
      )
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("shipments")
      .select("status, booking_date, edd, updated_at, sla_at_risk")
      .order("booking_date", { ascending: false }),
  ])

  if (ticketResult.error)
    console.error("Unable to load ticket metrics", ticketResult.error)
  if (shipmentResult.error)
    console.error("Unable to load shipment metrics", shipmentResult.error)

  const tickets = (ticketResult.data || []) as TicketMetricRow[]
  const shipments = (shipmentResult.data || []) as ShipmentMetricRow[]
  const priorities = ["critical", "high", "medium", "low"]
  const slaData = priorities
    .map((priority, index) => {
      const rows = tickets.filter(
        (ticket) => (ticket.priority || "medium") === priority
      )
      return {
        priority,
        compliant: rows.filter((ticket) => !ticket.sla_breached).length,
        total: rows.length,
        fill: `var(--chart-${index + 1})`,
      }
    })
    .filter((row) => row.total > 0)

  const breachedCount = tickets.filter((ticket) => ticket.sla_breached).length
  const complianceRate =
    tickets.length === 0
      ? null
      : ((tickets.length - breachedCount) / tickets.length) * 100

  const todayShipments = shipments.filter(
    (shipment) => shipment.booking_date >= startOfToday
  )
  const dailyData = ["pending", "in-transit", "delivered"].map(
    (status, index) => ({
      status,
      volume: todayShipments.filter((shipment) => shipment.status === status)
        .length,
      fill: `var(--chart-${index + 1})`,
    })
  )

  const recentlyDelivered = shipments.filter(
    (shipment) =>
      shipment.status === "delivered" && shipment.updated_at >= thirtyDaysAgo
  )
  const onTimeCount = recentlyDelivered.filter(
    (shipment) =>
      shipment.edd &&
      new Date(shipment.updated_at).getTime() <=
        new Date(shipment.edd).getTime()
  ).length
  const atRiskCount = shipments.filter(
    (shipment) => shipment.sla_at_risk
  ).length
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.resolved_at && ticket.status === "resolved"
  )
  const averageResolutionHours =
    resolvedTickets.length === 0
      ? null
      : resolvedTickets.reduce(
          (sum, ticket) =>
            sum + hoursBetween(ticket.created_at, ticket.resolved_at as string),
          0
        ) / resolvedTickets.length
  const breachHistory = tickets
    .filter((ticket) => ticket.sla_breached)
    .slice(0, 8)

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 md:gap-8">
      <div className="flex items-center gap-4">
        <div className="shrink-0 rounded-lg bg-primary/10 p-3">
          <MetricsIcon className="size-8 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            SLA Metrics
          </h1>
          <p className="text-sm text-muted-foreground">
            Live service-level performance from operational records.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={AlertTriangle}
          label="At-risk shipments"
          value={atRiskCount.toLocaleString()}
        />
        <MetricCard
          icon={Clock3}
          label="Average ticket resolution"
          value={
            averageResolutionHours === null
              ? "No data"
              : `${averageResolutionHours.toFixed(1)}h`
          }
        />
        <MetricCard
          icon={History}
          label="SLA breaches, 30 days"
          value={breachedCount.toLocaleString()}
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
        <SlaComplianceChart data={slaData} complianceRate={complianceRate} />
        <DailyDeliveryStatusChart data={dailyData} />
        <FlawlessExecutionsChart
          onTimeCount={onTimeCount}
          deliveredCount={recentlyDelivered.length}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent SLA breach history</CardTitle>
        </CardHeader>
        <CardContent>
          {breachHistory.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No SLA breaches recorded in the last 30 days.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {breachHistory.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.sla_breach_type || "unspecified"} breach
                    </p>
                  </div>
                  <Badge variant="destructive">
                    {ticket.priority || "medium"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof AlertTriangle
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="bg-primary/10 p-3 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
