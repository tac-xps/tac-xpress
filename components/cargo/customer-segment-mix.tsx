"use client"

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

const segments = [
  { label: "B2B Accounts", share: 62 },
  { label: "E-Commerce", share: 28 },
  { label: "Individual", share: 10 },
] as const

export function CustomerSegmentMix() {
  return (
    <DashboardCard className="">
      <CardHeader className="border-b">
        <CardTitle className="text-balance">Customer Segment Mix</CardTitle>
        <CardDescription className="text-pretty">
          Volume split by customer segment in the last 12 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 py-1">
        <ShareBarList aria-label="Customer segments by shipment volume">
          {segments.map((row) => (
            <ShareBarListItem key={row.label} value={row.share}>
              <ShareBarListContent>
                <ShareBarListLabel>{row.label}</ShareBarListLabel>
                <ShareBarListValue>
                  <span className="tracking-tight tabular-nums">
                    {row.share}%
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
