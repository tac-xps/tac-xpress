import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
export interface TrackingEvent { id: string; type: string; occurredAt: string; payload: { location?: string; description?: string }; eventHash: string; isPublic?: boolean }
export function ShipmentTimeline({ events }: { events: TrackingEvent[] }) {
  return <Card className="shadow-none"><CardHeader><CardTitle>Shipment event log</CardTitle><CardDescription>Latest recorded events first. Public updates are visible to customers using an AWB.</CardDescription></CardHeader><CardContent><ol className="flex flex-col">{events.map((event) => <li key={event.id} className="grid gap-3 border-t py-5 first:border-0 first:pt-0 sm:grid-cols-[10rem_1fr]"><time dateTime={event.occurredAt} className="text-sm text-muted-foreground">{format(new Date(event.occurredAt), "dd MMM yyyy, HH:mm")}</time><div><div className="flex flex-wrap items-center gap-3"><h3 className="font-medium capitalize">{event.type.replaceAll("_", " ").replaceAll("-", " ")}</h3><Badge variant="outline">{event.isPublic ? "Public update" : "Internal event"}</Badge></div><p className="mt-2 text-sm font-medium">{event.payload.location}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{event.payload.description}</p></div></li>)}</ol>{!events.length && <p className="py-5 text-sm text-muted-foreground">No events recorded for this shipment.</p>}</CardContent></Card>
}

