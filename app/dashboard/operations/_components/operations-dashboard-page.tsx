import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShipmentsDataTable } from "@/app/dashboard/shipments/shipment-data-table"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
} from "@/components/ui/page-navigation"

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

/**
 * Shared server component for the air-cargo and surface-cargo operations
 * dashboard pages. Accepts pre-fetched rows and page-specific labels/icons as
 * props so each page only needs to supply its service-type query and the copy
 * that differentiates it.
 */
export function OperationsDashboardPage({
  page,
  rows,
  kpiCards,
  icon,
  iconBg,
  heading,
  description,
  tableTitle,
  pathname,
}: OperationsDashboardPageProps) {
  const paginatedShipments = rows.slice(
    (page - 1) * DEFAULT_PAGE_SIZE,
    page * DEFAULT_PAGE_SIZE
  )
  const hasNext = rows.length > page * DEFAULT_PAGE_SIZE

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 md:gap-8">
      {/* ── Hero header ── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className={`shrink-0 rounded-lg p-3 ${iconBg}`}>{icon}</div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {heading}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid gap-4 md:grid-cols-3">
        {kpiCards.map(({ label, value, colourClass }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${colourClass ?? ""}`}>
                {value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Shipments table ── */}
      <Card className="overflow-hidden delay-0">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 p-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            {tableTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ShipmentsDataTable data={paginatedShipments as any} />
          </div>
          <PageNavigation page={page} hasNext={hasNext} pathname={pathname} />
        </CardContent>
      </Card>
    </div>
  )
}
