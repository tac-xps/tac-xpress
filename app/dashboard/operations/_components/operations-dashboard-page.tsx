import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShipmentsDataTable } from "@/app/dashboard/shipments/shipment-data-table"
import { DEFAULT_PAGE_SIZE } from "@/components/ui/page-navigation"
import { Package, Truck, AlertTriangle, Activity } from "lucide-react"

export interface KpiCard {
  label: string
  /** Rendered value (number or string). */
  value: number | string
  /** Optional Tailwind text-colour class, e.g. `"text-amber-500"`. */
  colourClass?: string
}

export interface OperationsDashboardPageProps {
  /** Current (1-based) page number. */
  page: number
  /** All rows for the service type, ordered by `createdAt desc`. */
  rows: {
    status?: string | null
    slaAtRisk?: boolean | null
    [key: string]: unknown
  }[]
  /** Three KPI summary cards shown above the table. */
  kpiCards: [KpiCard, KpiCard, KpiCard]
  /** Icon rendered in the hero area header. */
  icon: React.ReactNode
  /** Accent class applied to the icon container, e.g. `"bg-sky-500/10"`. */
  iconBg: string
  /** Page heading, e.g. `"Air Cargo Operations"`. */
  heading: string
  /** Subheading description line. */
  description: string
  /** Table section title, e.g. `"Active Air Shipments"`. */
  tableTitle: string
  /** Next.js pathname used for page-navigation links. */
  pathname: string
}

export function OperationsDashboardPage({
  page,
  rows,
  kpiCards,
  icon,
  iconBg,
  heading,
  description,
  tableTitle,
}: OperationsDashboardPageProps) {
  const paginatedShipments = rows.slice(
    (page - 1) * DEFAULT_PAGE_SIZE,
    page * DEFAULT_PAGE_SIZE
  )
  const pageCount = Math.ceil(rows.length / DEFAULT_PAGE_SIZE) || 1

  // Operational telemetry metrics
  const totalCount = rows.length
  const inTransitCount = rows.filter(
    (r) =>
      r.status === "in-transit" ||
      r.status === "in_transit" ||
      r.status === "out_for_delivery"
  ).length
  const deliveredCount = rows.filter((r) => r.status === "delivered").length
  const atRiskCount = rows.filter((r) => Boolean(r.slaAtRisk)).length
  const pendingCount = Math.max(
    0,
    totalCount - (inTransitCount + deliveredCount + atRiskCount)
  )

  const deliveredPct = totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 0
  const inTransitPct = totalCount > 0 ? Math.round((inTransitCount / totalCount) * 100) : 0
  const atRiskPct = totalCount > 0 ? Math.round((atRiskCount / totalCount) * 100) : 0
  const pendingPct = Math.max(0, 100 - (deliveredPct + inTransitPct + atRiskPct))

  const kpiIcons = [
    <Package key="kpi-0" className="size-4 text-primary" />,
    <Truck key="kpi-1" className="size-4 text-sky-500" />,
    <AlertTriangle key="kpi-2" className="size-4 text-destructive" />,
  ]

  const kpiContext = [
    "Total active bookings in network",
    "Dispatched and moving on route",
    "Requires immediate dispatch attention",
  ]

  return (
    <div className="flex w-full flex-col gap-6 md:gap-8">
      {/* ── Hero header ── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className={`shrink-0 rounded-xl p-3.5 shadow-xs border border-border/80 ${iconBg}`}>
            {icon}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {heading}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {kpiCards.map(({ label, value, colourClass }, idx) => (
          <Card key={label} className="border border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {label}
              </CardTitle>
              <div className="rounded-md bg-muted/60 p-1.5">
                {kpiIcons[idx] ?? <Activity className="size-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className={`text-3xl font-bold font-mono tracking-tight ${colourClass ?? ""}`}>
                {value}
              </div>
              <p className="text-xs text-muted-foreground">
                {kpiContext[idx] ?? "Real-time network telemetry"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Real-Time Transit Distribution Bar ── */}
      {totalCount > 0 && (
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight">
                Route Transit Distribution
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live delivery and status distribution across {totalCount} monitored air cargo consignments
              </p>
            </div>
            <span className="font-mono text-xs font-medium text-muted-foreground">
              {totalCount} total
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Segmented Progress Bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/40 p-0.5 ring-1 ring-border/50">
              {deliveredPct > 0 && (
                <div
                  style={{ width: `${deliveredPct}%` }}
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  title={`Delivered: ${deliveredCount} (${deliveredPct}%)`}
                />
              )}
              {inTransitPct > 0 && (
                <div
                  style={{ width: `${inTransitPct}%` }}
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  title={`In-Transit: ${inTransitCount} (${inTransitPct}%)`}
                />
              )}
              {pendingPct > 0 && (
                <div
                  style={{ width: `${pendingPct}%` }}
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  title={`Pending / Hub: ${pendingCount} (${pendingPct}%)`}
                />
              )}
              {atRiskPct > 0 && (
                <div
                  style={{ width: `${atRiskPct}%` }}
                  className="h-full rounded-full bg-destructive transition-all duration-500"
                  title={`SLA At Risk: ${atRiskCount} (${atRiskPct}%)`}
                />
              )}
            </div>

            {/* Distribution Legend */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" />
                <span className="font-medium text-foreground">Delivered:</span>
                <span className="font-mono text-muted-foreground">{deliveredCount} ({deliveredPct}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-sky-500" />
                <span className="font-medium text-foreground">In-Transit:</span>
                <span className="font-mono text-muted-foreground">{inTransitCount} ({inTransitPct}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-500" />
                <span className="font-medium text-foreground">Pending / Hub:</span>
                <span className="font-mono text-muted-foreground">{pendingCount} ({pendingPct}%)</span>
              </span>
              {atRiskCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-destructive" />
                  <span className="font-medium text-destructive">SLA At Risk:</span>
                  <span className="font-mono font-bold text-destructive">{atRiskCount} ({atRiskPct}%)</span>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Shipments table ── */}
      <Card className="overflow-hidden border border-border/80 shadow-xs rounded-xl bg-card">
        <CardHeader className="flex flex-col gap-1 border-b border-border/80 bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight text-foreground">
              {tableTitle}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Page {page} of {pageCount} • {totalCount} active cargo consignments recorded
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ShipmentsDataTable
            data={paginatedShipments as any}
            pageCount={pageCount}
            bordered={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}

