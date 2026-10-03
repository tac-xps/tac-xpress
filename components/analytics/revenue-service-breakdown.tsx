import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"
import { Plane, Truck, Route } from "lucide-react"

function formatCurrency(amountPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100)
}

export function RevenueServiceBreakdown({ data }: { data: AnalyticsOverview }) {
  const totalAir = data.dailyVolume.reduce((acc, curr) => acc + curr.air, 0)
  const totalSurface = data.dailyVolume.reduce((acc, curr) => acc + curr.surface, 0)
  const totalShipments = totalAir + totalSurface

  const airShare = totalShipments > 0 ? (totalAir / totalShipments) * 100 : 50
  const surfaceShare = totalShipments > 0 ? (totalSurface / totalShipments) * 100 : 50

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Service Mix */}
      <Card>
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-semibold">Freight Mode Contribution</CardTitle>
          <CardDescription>Volume and capacity distribution between service tiers.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Plane className="size-4 text-chart-1" />
                Express Air Cargo
              </span>
              <span className="font-mono font-bold">{totalAir} consignments ({airShare.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-muted/40 h-2.5 rounded-none overflow-hidden">
              <div
                className="bg-chart-1 h-full transition-all duration-500"
                style={{ width: `${airShare}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Truck className="size-4 text-chart-2" />
                Surface Road Cargo
              </span>
              <span className="font-mono font-bold">{totalSurface} consignments ({surfaceShare.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-muted/40 h-2.5 rounded-none overflow-hidden">
              <div
                className="bg-chart-2 h-full transition-all duration-500"
                style={{ width: `${surfaceShare}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Revenue Corridors */}
      <Card>
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-semibold">Active Freight Corridors</CardTitle>
          <CardDescription>High-density origin-to-destination freight lanes.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          {data.topRoutes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No lane activity recorded for this period.</p>
          ) : (
            data.topRoutes.slice(0, 4).map((route, idx) => (
              <div
                key={route.route}
                className="flex items-center justify-between py-2 border-b border-border/40 last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-muted-foreground w-4">#{idx + 1}</span>
                  <Route className="size-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{route.route}</span>
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted/50">
                  {route.volume} shipments
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
