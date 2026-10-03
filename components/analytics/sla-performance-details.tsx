import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { AnalyticsOverview } from "@/lib/dashboard-metrics"
import { Plane, Truck, ShieldAlert, CheckCircle2, BellRing } from "lucide-react"

export function SlaPerformanceDetails({ data }: { data: AnalyticsOverview }) {
  const atRisk = data.statusBreakdown.atRisk
  const delivered = data.statusBreakdown.delivered
  const inTransit = data.statusBreakdown.inTransit
  const onTimeRate = data.onTimePerformance

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Service SLA Matrix */}
      <Card>
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-semibold">Service Tier SLA Compliance</CardTitle>
          <CardDescription>Transit adherence benchmarks across freight categories.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          {/* Air Cargo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Plane className="size-4 text-chart-1" />
                Express Air Cargo (Airport-to-Airport)
              </span>
              <span className="font-mono font-bold text-foreground">
                {onTimeRate !== null ? `${onTimeRate.toFixed(1)}%` : "N/A"}
              </span>
            </div>
            <div className="w-full bg-muted/40 h-2 rounded-none overflow-hidden">
              <div
                className="bg-chart-1 h-full transition-all duration-500"
                style={{ width: onTimeRate !== null ? `${Math.min(onTimeRate, 100)}%` : "0%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Target: 99.0% (24-48 hrs)</span>
              <span>Tolerance: ±2 hrs</span>
            </div>
          </div>

          {/* Road Freight */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Truck className="size-4 text-chart-2" />
                Surface Road Freight (Linehaul Hubs)
              </span>
              <span className="font-mono font-bold text-foreground">
                {onTimeRate !== null ? `${onTimeRate.toFixed(1)}%` : "N/A"}
              </span>
            </div>
            <div className="w-full bg-muted/40 h-2 rounded-none overflow-hidden">
              <div
                className="bg-chart-2 h-full transition-all duration-500"
                style={{ width: onTimeRate !== null ? `${Math.min(onTimeRate, 100)}%` : "0%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Target: 98.0% (3-5 days)</span>
              <span>Tolerance: ±6 hrs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational SLA Health & Early Warning */}
      <Card>
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-semibold">Live Operational SLA Safeguards</CardTitle>
          <CardDescription>Continuous consignment monitoring and automatic escalation.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-none border border-border/40 bg-muted/20">
            <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Automated WhatsApp Milestone Updates</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every scanned consignment sends instant Meta Cloud API delivery timestamps to shippers and consignees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-none border border-border/40 bg-muted/20">
            <BellRing className="size-5 text-chart-1 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Predictive Linehaul Bottleneck Alerting</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Consignments unmanifested past standard cut-off trigger automated dispatch desk notifications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-none border border-border/40 bg-muted/20">
            <ShieldAlert
              className={`size-5 shrink-0 mt-0.5 ${
                atRisk > 0 ? "text-destructive" : "text-status-delivered"
              }`}
            />
            <div>
              <p className="text-sm font-medium">
                {atRisk > 0 ? `${atRisk} Consignments Under Priority Watch` : "No Critical SLA Breaches"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {atRisk > 0
                  ? "At-risk consignments are routed for immediate linehaul transfer."
                  : `${delivered} completed and ${inTransit} in-transit consignments are tracking within acceptable parameters.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
