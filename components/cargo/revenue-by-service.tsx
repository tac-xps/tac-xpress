"use client"

import { formatCompactCurrency } from "@/components/formater"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard-card"
import {
  ShareBarList,
  ShareBarListContent,
  ShareBarListFill,
  ShareBarListItem,
  ShareBarListLabel,
  ShareBarListValue,
} from "@/components/share-bar-list"

const chartData = [
  { service: "Express Air", revenue: 412000 },
  { service: "Standard Surface", revenue: 289000 },
  { service: "Road Freight", revenue: 164000 },
  { service: "Handling & Brokerage", revenue: 98000 },
  { service: "Storage & Warehousing", revenue: 62000 },
] as const

const maxRevenue = Math.max(...chartData.map((d) => d.revenue))

function barWidthPercent(revenue: number) {
  if (maxRevenue <= 0) {
    return 0
  }
  return (revenue / maxRevenue) * 75
}

export function RevenueByService() {
  return (
    <DashboardCard className="">
      <CardHeader className="border-b">
        <CardTitle className="text-balance">Revenue by Service</CardTitle>
        <CardDescription className="text-pretty">
          Revenue breakdown in the last 12 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 py-1">
        <ShareBarList aria-label="Revenue by service type">
          {chartData.map((row) => (
            <ShareBarListItem
              key={row.service}
              value={barWidthPercent(row.revenue)}
            >
              <ShareBarListContent>
                <ShareBarListLabel>{row.service}</ShareBarListLabel>
                <ShareBarListValue>
                  <span className="tracking-tight tabular-nums">
                    {formatCompactCurrency(row.revenue)}
                  </span>
                </ShareBarListValue>
              </ShareBarListContent>
              <ShareBarListFill />
            </ShareBarListItem>
          ))}
        </ShareBarList>
      </CardContent>
    </DashboardCard>
  )
}
