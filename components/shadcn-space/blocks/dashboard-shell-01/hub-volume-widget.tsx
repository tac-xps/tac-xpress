import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { HubVolumePoint, TrendValue } from "@/lib/dashboard-metrics"
import { Building2, TrendingDown, TrendingUp } from "lucide-react"

type HubVolumeWidgetProps = {
  hubs: HubVolumePoint[]
}

function TrendLabel({ trend }: { trend: TrendValue }) {
  if (trend === null) {
    return (
      <span className="text-[11px] font-medium text-muted-foreground">
        No prior month baseline
      </span>
    )
  }

  const isPositive = trend >= 0

  return (
    <div
      className={`flex items-center gap-1 text-[11px] font-medium ${
        isPositive ? "text-status-delivered" : "text-destructive"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="size-3" />
      ) : (
        <TrendingDown className="size-3" />
      )}
      <span className="tracking-tight tabular-nums">
        {Math.abs(trend).toFixed(1)}%
      </span>
    </div>
  )
}

export function HubVolumeWidget({ hubs }: HubVolumeWidgetProps) {
  return (
    <Card className="h-full delay-1000">
      <CardHeader className="border-b border-border/50 p-6">
        <CardTitle className="text-base font-semibold tracking-tight">
          Volume by Regional Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-6">
        {hubs.length === 0 ? (
          <Empty className="min-h-[240px] border border-dashed border-border/60 bg-muted/10">
            <EmptyContent>
              <EmptyMedia variant="icon">
                <Building2 className="size-4" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No hubs configured yet</EmptyTitle>
                <EmptyDescription>
                  Create hubs and start building manifests to populate regional
                  throughput here.
                </EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        ) : (
          hubs.map((hub, index) => (
            <div
              key={hub.id}
              className="-mx-2 flex items-center justify-between rounded-none p-2 transition-all duration-500 hover:bg-background/40 starting:translate-y-2 starting:opacity-0"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-none bg-primary/10 ring-1 ring-primary/20">
                  <Building2 className="size-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm leading-none font-medium">{hub.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {hub.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-semibold tracking-tight tabular-nums">
                  {hub.totalShipmentsLabel}
                </span>
                <TrendLabel trend={hub.trend} />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
