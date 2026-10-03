"use client"

import * as React from "react"
import { AnalyticsTabBar } from "@/components/analytics/analytics-tab-bar"
import { DateRangeSelect } from "@/components/analytics/date-range-select"
import { ShipmentKpiStrip } from "@/components/analytics/shipment-kpi-strip"
import { ShipmentVolumeBarChart } from "@/components/analytics/shipment-volume-bar-chart"
import { ShipmentStatusDonut } from "@/components/analytics/shipment-status-donut"
import { TopRoutesChart } from "@/components/analytics/top-routes-chart"
import { CsvExportButton } from "@/components/analytics/csv-export-button"
import { FleetUtilizationChart } from "@/components/analytics/fleet-utilization-chart"
import { FleetKpiStrip } from "@/components/analytics/fleet-kpi-strip"
import { FleetCompositionDetails } from "@/components/analytics/fleet-composition-details"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { RevenueKpiStrip } from "@/components/analytics/revenue-kpi-strip"
import { RevenueServiceBreakdown } from "@/components/analytics/revenue-service-breakdown"
import { CustomerGrowthChart } from "@/components/analytics/customer-growth-chart"
import { SlaMetricsChart } from "@/components/analytics/sla-metrics-chart"
import { SlaKpiStrip } from "@/components/analytics/sla-kpi-strip"
import { SlaPerformanceDetails } from "@/components/analytics/sla-performance-details"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"

export function AnalyticsTabsContainer({
  overview,
  period,
}: {
  overview: AnalyticsOverview
  period: string
}) {
  const [activeTab, setActiveTab] = React.useState("shipments")

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden relative">
      {/* Sticky Tab Bar & Date Picker */}
      <div className="sticky top-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-y bg-background/95 backdrop-blur px-6 md:px-8 py-3 w-full shrink-0">
        <AnalyticsTabBar value={activeTab} onValueChange={setActiveTab} />
        <div className="flex items-center gap-2">
          <CsvExportButton overview={overview} period={period} activeTab={activeTab} />
          <DateRangeSelect current={period} />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="px-6 md:px-8 py-6 space-y-6">
          {/* Shipments Tab */}
          {activeTab === "shipments" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ShipmentKpiStrip data={overview} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ShipmentVolumeBarChart data={overview.dailyVolume} />
                </div>
                <ShipmentStatusDonut data={overview.statusBreakdown} />
              </div>

              <TopRoutesChart routes={overview.topRoutes} />
            </div>
          )}

          {/* Fleet Tab */}
          {activeTab === "fleet" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <FleetKpiStrip data={overview} />

              <FleetUtilizationChart
                managedTotal={overview.fleetAvailability.managedTotal}
                managedOperational={overview.fleetAvailability.managedOperational}
                registryTotal={overview.fleetAvailability.registryTotal}
                registryOperational={overview.fleetAvailability.registryOperational}
                data={overview.fleetAvailability.data}
              />

              <FleetCompositionDetails data={overview} />
            </div>
          )}

          {/* SLA Tab */}
          {activeTab === "sla" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <SlaKpiStrip data={overview} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SlaMetricsChart 
                  onTimePerformance={overview.onTimePerformance}
                  trend={overview.onTimePerformanceTrend}
                  atRiskCount={overview.statusBreakdown.atRisk}
                />
                <div className="lg:col-span-2">
                  <SlaPerformanceDetails data={overview} />
                </div>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === "revenue" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <RevenueKpiStrip data={overview} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={overview.revenueByMonth} />
                <CustomerGrowthChart data={overview.customerGrowthByMonth} />
              </div>

              <RevenueServiceBreakdown data={overview} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
