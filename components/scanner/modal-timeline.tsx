"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/logistics/status-badge"
import { Activity, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"

interface TrackingEvent {
  id: string
  status: string
  location?: string | null
  description?: string | null
  createdAt: Date | string
}

interface ModalTimelineProps {
  events?: TrackingEvent[] | null
}

export function ModalTimeline({ events }: ModalTimelineProps) {
  const safeEvents = events && events.length > 0 ? events.slice(0, 5) : []

  return (
    <Card className="rounded-none border-border shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b bg-muted/40 py-3.5 px-4 sm:px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase">
              <Activity className="size-4 text-primary shrink-0" />
              Scan History & Audit Trail
            </CardTitle>
            <span className="font-mono text-[10px] text-muted-foreground uppercase font-bold">
              {safeEvents.length} Event{safeEvents.length === 1 ? "" : "s"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {safeEvents.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground space-y-1">
              <Clock className="size-5 mx-auto opacity-40 mb-2" />
              <p className="font-medium text-foreground">No Milestone Events Logged</p>
              <p>Initial manifest generation event recorded.</p>
            </div>
          ) : (
            <div className="relative pl-4 space-y-4 border-l-2 border-border/80 text-xs">
              {safeEvents.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group">
                  <div className="absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-background bg-primary" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={evt.status} className="scale-90 origin-left" />
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {format(new Date(evt.createdAt), "dd MMM HH:mm")}
                      </span>
                    </div>
                    {evt.location && (
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                        <MapPin className="size-3 text-primary/70 shrink-0" />
                        {evt.location}
                      </p>
                    )}
                    {evt.description && (
                      <p className="text-foreground text-[11px] leading-relaxed">
                        {evt.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}
