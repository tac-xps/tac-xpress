"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toCsv } from "@/lib/csv"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"

export function CsvExportButton({
  overview,
  period,
  activeTab = "shipments",
}: {
  overview: AnalyticsOverview
  period: string
  activeTab?: string
}) {
  function handleDownload() {
    let header: string[] = []
    let rows: (string | number)[][] = []
    let filename = `analytics-${activeTab}-${period}.csv`

    if (activeTab === "shipments") {
      header = ["Date", "Air Cargo", "Surface Cargo", "Total"]
      rows = overview.dailyVolume.map((d) => [
        d.date,
        d.air,
        d.surface,
        d.air + d.surface,
      ])
    } else if (activeTab === "fleet") {
      header = ["Category", "Total Units", "Operational Ready", "Depot / Maintenance", "Readiness Rate"]
      const mTotal = overview.fleetAvailability.managedTotal
      const mOp = overview.fleetAvailability.managedOperational
      const rTotal = overview.fleetAvailability.registryTotal
      const rOp = overview.fleetAvailability.registryOperational

      rows = [
        ["Managed Fleet", mTotal, mOp, mTotal - mOp, mTotal > 0 ? `${((mOp / mTotal) * 100).toFixed(1)}%` : "0%"],
        ["Partner Registry", rTotal, rOp, rTotal - rOp, rTotal > 0 ? `${((rOp / rTotal) * 100).toFixed(1)}%` : "0%"],
        ["Combined Fleet", mTotal + rTotal, mOp + rOp, (mTotal + rTotal) - (mOp + rOp), (mTotal + rTotal) > 0 ? `${(((mOp + rOp) / (mTotal + rTotal)) * 100).toFixed(1)}%` : "0%"],
      ]
    } else if (activeTab === "sla") {
      header = ["Metric", "Value", "Benchmark Target", "Status"]
      rows = [
        [
          "On-Time Performance Rate (Overall)",
          overview.onTimePerformance !== null ? `${overview.onTimePerformance.toFixed(1)}%` : "N/A",
          "98.5%",
          overview.onTimePerformance !== null
            ? overview.onTimePerformance >= 98.5
              ? "Compliant"
              : "Breach Alert"
            : "No Data",
        ],
        [
          "Express Air On-Time Rate",
          overview.serviceSla?.air !== null && overview.serviceSla?.air !== undefined
            ? `${overview.serviceSla.air.toFixed(1)}%`
            : "N/A",
          "99.0%",
          overview.serviceSla?.air !== null && overview.serviceSla?.air !== undefined
            ? overview.serviceSla.air >= 99.0
              ? "Compliant"
              : "Breach Alert"
            : "No Data",
        ],
        [
          "Road Freight On-Time Rate",
          overview.serviceSla?.road !== null && overview.serviceSla?.road !== undefined
            ? `${overview.serviceSla.road.toFixed(1)}%`
            : "N/A",
          "98.0%",
          overview.serviceSla?.road !== null && overview.serviceSla?.road !== undefined
            ? overview.serviceSla.road >= 98.0
              ? "Compliant"
              : "Breach Alert"
            : "No Data",
        ],
        ["Delivered Consignments", overview.statusBreakdown.delivered, "N/A", "Complete"],
        ["In-Transit Consignments", overview.statusBreakdown.inTransit, "N/A", "Active"],
        ["Pending Consignments", overview.statusBreakdown.pending, "N/A", "Queued"],
        ["SLA At-Risk Consignments", overview.statusBreakdown.atRisk, "0", overview.statusBreakdown.atRisk === 0 ? "Normal" : "Escalated"],
      ]
    } else if (activeTab === "revenue") {
      header = ["Month", "Billed Revenue (INR)", "New Customer Accounts"]
      const months = [
        ...new Set([
          ...overview.revenueByMonth.map((rev) => rev.month),
          ...overview.customerGrowthByMonth.map((c) => c.month),
        ]),
      ].sort()

      rows = months.map((month) => {
        const rev = overview.revenueByMonth.find((r) => r.month === month)
        const cust =
          overview.customerGrowthByMonth.find((c) => c.month === month)?.customers ?? 0
        return [
          month,
          rev ? (rev.amountPaise / 100).toFixed(2) : "0.00",
          cust,
        ]
      })
    }

    const csvContent = toCsv([header, ...rows])
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      className="h-9 gap-2"
      title={`Export ${activeTab} data as CSV`}
    >
      <Download className="size-4" />
      <span className="hidden sm:inline">Export</span>
    </Button>
  )
}
