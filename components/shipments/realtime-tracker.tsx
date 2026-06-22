import { format } from "date-fns"
import { Activity } from "lucide-react"

export interface TrackingEvent {
  id: string
  type: string
  occurredAt: string
  payload: any
  eventHash: string
}

interface ShipmentTimelineProps {
  events: TrackingEvent[]
}

export function ShipmentTimeline({ events }: ShipmentTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl text-foreground">Shipment Log</h2>
        <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium">
          <Activity className="h-3 w-3 text-muted-foreground" />{" "}
          <span className="text-muted-foreground">Manually Updated</span>
        </div>
      </div>

      <div className="relative rounded-lg border bg-card p-6 shadow-sm">
        <div className="absolute top-10 bottom-10 left-10 w-0.5 bg-border" />
        <div className="relative space-y-8">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tracking events available.
            </p>
          ) : (
            events.map((e) => (
              <div key={e.id} className="flex gap-6">
                <div className="z-10 h-8 w-8 flex-shrink-0 rounded-full border-2 border-border bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-semibold capitalize">
                      {e.type.replace("_", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(e.occurredAt), "PPp")}
                    </p>
                  </div>
                  <pre className="overflow-x-auto rounded bg-muted p-2 text-xs text-muted-foreground">
                    {JSON.stringify(e.payload, null, 2)}
                  </pre>
                  <p className="pt-1 font-mono text-[10px] text-muted-foreground/60">
                    Hash: {e.eventHash}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
