import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"
import { ShieldCheck, Truck } from "lucide-react"

export function FleetCompositionDetails({ data }: { data: AnalyticsOverview }) {
  const { fleetAvailability } = data
  const managedActive = fleetAvailability.managedOperational
  const managedTotal = fleetAvailability.managedTotal
  const managedDown = managedTotal - managedActive

  const registryActive = fleetAvailability.registryOperational
  const registryTotal = fleetAvailability.registryTotal

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Managed Fleet Breakdown */}
      <Card>
        <CardHeader className="p-5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Managed Fleet Readiness</CardTitle>
              <CardDescription>Primary company-owned cargo vehicles and vans.</CardDescription>
            </div>
            <div className="flex size-8 items-center justify-center rounded-none bg-chart-1/10 text-chart-1">
              <Truck className="size-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="size-2 rounded-none bg-status-delivered" />
              Active in Linehaul / Delivery
            </span>
            <span className="font-mono text-sm font-semibold">{managedActive} vehicles</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="size-2 rounded-none bg-status-pending" />
              Depot Reserve / Scheduled Maintenance
            </span>
            <span className="font-mono text-sm font-semibold">{managedDown} vehicles</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium">Total Managed Fleet</span>
            <span className="font-mono text-sm font-bold">{managedTotal} vehicles</span>
          </div>

          <div className="w-full bg-muted/40 h-2 rounded-none overflow-hidden mt-3">
            <div
              className="bg-chart-1 h-full transition-all duration-500"
              style={{
                width: managedTotal > 0 ? `${(managedActive / managedTotal) * 100}%` : "0%",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Partner Registry Fleet Breakdown */}
      <Card>
        <CardHeader className="p-5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Fleet Registry & Regional Carriers</CardTitle>
              <CardDescription>Associated freight operators and chartered feeder trucks.</CardDescription>
            </div>
            <div className="flex size-8 items-center justify-center rounded-none bg-chart-3/10 text-chart-3">
              <ShieldCheck className="size-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="size-2 rounded-none bg-status-delivered" />
              Verified & Available on Call
            </span>
            <span className="font-mono text-sm font-semibold">{registryActive} vehicles</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="size-2 rounded-none bg-muted-foreground/40" />
              Inactive / Unallocated
            </span>
            <span className="font-mono text-sm font-semibold">
              {registryTotal - registryActive} vehicles
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium">Total Carrier Registry</span>
            <span className="font-mono text-sm font-bold">{registryTotal} vehicles</span>
          </div>

          <div className="w-full bg-muted/40 h-2 rounded-none overflow-hidden mt-3">
            <div
              className="bg-chart-2 h-full transition-all duration-500"
              style={{
                width: registryTotal > 0 ? `${(registryActive / registryTotal) * 100}%` : "0%",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
