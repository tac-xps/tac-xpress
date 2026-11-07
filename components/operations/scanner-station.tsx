"use client"

import { useState, useTransition } from "react"
import {
  Search,
  RotateCcw,
  Barcode,
  MapPin,
  Send,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plane,
  Truck,
  Package,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useScannerStation } from "./use-scanner-station"
import { PageHeader } from "./page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { StatusBadge } from "@/components/logistics/status-badge"
import { ShipmentDetailDialog } from "@/app/dashboard/shipments/shipment-detail-dialog"
import { createTrackingEventAction } from "@/app/dashboard/shipments/actions"

const SAMPLE_AWBS = ["AWB-100200300", "AWB-500600700", "AWB-12345"]

const CORRIDOR_LOCATIONS = [
  "New Delhi Hub (DEL)",
  "Indira Gandhi Airport (DEL)",
  "Bir Tikendrajit Airport (IMF)",
  "Imphal Hub (IMF)",
]

const EVENT_TEMPLATES = [
  "Cargo verified and sorted at origin hub.",
  "Loaded on scheduled flight for Imphal transit.",
  "Inbound flight arrived, cargo transferred to hub.",
  "Shipment handed over to consignee with signature.",
]

function formatEventDate(dateValue: string | Date | null | undefined): string {
  if (!dateValue) return "Date not recorded"
  try {
    return format(new Date(dateValue), "dd MMM yyyy, HH:mm")
  } catch {
    return String(dateValue)
  }
}

export function ScannerStation({ initialAwb }: { initialAwb: string }) {
  const station = useScannerStation(initialAwb)
  const shipment = station.result?.data
  const [detailOpen, setDetailOpen] = useState(false)

  // Update tracking form state
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, startTransition] = useTransition()

  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!shipment) return

    if (!location.trim()) {
      toast.error("Please enter a recorded location.")
      return
    }

    if (!description.trim()) {
      toast.error("Please enter an event description.")
      return
    }

    startTransition(async () => {
      try {
        const res = await createTrackingEventAction({
          shipmentId: shipment.id,
          status: shipment.status,
          location: location.trim(),
          description: description.trim(),
          isPublic,
        })

        if (res?.data?.success) {
          toast.success("Tracking milestone recorded successfully")
          setDescription("")
          await station.search(shipment.awbNumber)
        } else {
          toast.error(
            res?.serverError || "Could not log tracking event. Check inputs."
          )
        }
      } catch {
        toast.error("Network or database error while updating tracking.")
      }
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Tracking & scanner station"
        description="Scan barcodes or enter references to verify parcels and record tracking checkpoints along the DEL <-> IMF corridor."
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Search & Shipment Inspection Terminal */}
        <div className="col-span-12 space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Compact Search & Scanner Input Card */}
          <Card className="rounded-none border border-border bg-card shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Barcode className="size-4 text-muted-foreground" />
                Shipment search & barcode terminal
              </CardTitle>
              <CardDescription>
                Scan shipping label barcode or input reference manually.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void station.search(station.query)
                }}
                className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end"
              >
                <div className="grid min-w-0 flex-1 gap-2">
                  <Label htmlFor="station-awb">AWB or shipment ID</Label>
                  <div className="relative">
                    <Input
                      id="station-awb"
                      value={station.query}
                      maxLength={64}
                      required
                      autoFocus
                      autoComplete="off"
                      placeholder="e.g. AWB-100200300"
                      className="rounded-none font-mono text-sm"
                      onChange={(event) =>
                        station.setQuery(event.target.value.toUpperCase())
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={station.loading || !station.query.trim()}
                    className="rounded-none"
                  >
                    <Search className="size-4" />
                    {station.loading ? "Searching…" : "Find shipment"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={station.clear}
                    className="rounded-none"
                  >
                    <RotateCcw className="size-4" />
                    Clear
                  </Button>
                </div>
              </form>

              {/* Quick corridor sample chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                <span className="font-medium">Quick references:</span>
                {SAMPLE_AWBS.map((awb) => (
                  <button
                    key={awb}
                    type="button"
                    onClick={() => {
                      station.setQuery(awb)
                      void station.search(awb)
                    }}
                    className="rounded-none border border-border/80 bg-muted/40 px-2 py-0.5 font-mono text-xs text-foreground transition-colors hover:bg-muted"
                  >
                    {awb}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loading Indicator */}
          {station.loading && (
            <div className="flex items-center gap-2 border border-border bg-card p-4 text-sm text-muted-foreground">
              <Radio className="size-4 animate-pulse text-primary" />
              Retrieving live ledger records from corridor database…
            </div>
          )}

          {/* Lookup Error Alert */}
          {station.result && !station.result.success && (
            <Alert variant="destructive" className="rounded-none">
              <AlertDescription>
                {station.result.error ||
                  "Shipment not found. Check the reference code and retry."}
              </AlertDescription>
            </Alert>
          )}

          {/* Active Shipment Inspection Result Card */}
          {shipment && (
            <Card className="rounded-none border border-border bg-card shadow-none">
              <CardHeader className="border-b border-border/70 pb-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="font-mono text-lg font-bold tracking-tight">
                        {shipment.awbNumber}
                      </CardTitle>
                      <StatusBadge status={shipment.status} />
                    </div>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {shipment.origin}
                      </span>
                      <span>→</span>
                      <span className="font-semibold text-foreground">
                        {shipment.destination}
                      </span>
                      <Badge variant="outline" className="rounded-none text-xs">
                        DEL ↔ IMF Corridor
                      </Badge>
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDetailOpen(true)}
                    className="rounded-none"
                  >
                    <ExternalLink className="mr-1.5 size-3.5" />
                    Open complete record
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* Freight Specifications */}
                <dl className="grid grid-cols-2 gap-4 border-b border-border/70 pb-5 text-sm sm:grid-cols-4">
                  {[
                    [
                      "Service Type",
                      shipment.serviceType === "express_air"
                        ? "Air Cargo (Express)"
                        : "Surface Cargo",
                    ],
                    ["Actual Weight", `${shipment.weightKg} kg`],
                    ["Packages", `${shipment.pieces} pcs`],
                    ["Recipient", shipment.consigneeName || "Not recorded"],
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-1">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Tracking Milestones Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Clock className="size-4 text-muted-foreground" />
                      Recorded milestones ({shipment.trackingEvents?.length || 0})
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Latest events first
                    </span>
                  </div>

                  {shipment.trackingEvents &&
                  shipment.trackingEvents.length > 0 ? (
                    <ol className="divide-y divide-border/60 border border-border/80">
                      {shipment.trackingEvents.map((event) => (
                        <li
                          key={event.id}
                          className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge status={event.status as any} />
                              <span className="flex items-center gap-1 font-medium text-sm text-foreground">
                                <MapPin className="size-3.5 text-muted-foreground" />
                                {event.location}
                              </span>
                              <Badge
                                variant={event.isPublic ? "default" : "outline"}
                                className="rounded-none text-[10px]"
                              >
                                {event.isPublic
                                  ? "Public tracking"
                                  : "Internal only"}
                              </Badge>
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {event.description}
                            </p>
                          </div>
                          <time className="shrink-0 font-mono text-xs text-muted-foreground">
                            {formatEventDate(event.createdAt)}
                          </time>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="border border-border/80 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                      No tracking milestones recorded yet. Use the update panel
                      on the right to log the first checkpoint.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Idle Ready State when no search executed */}
          {!station.loading && !station.result && (
            <Card className="rounded-none border border-border bg-card p-6 shadow-none">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-muted/40">
                  <Barcode className="size-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground">
                    Scanner station ready
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Scan a parcel barcode with any standard USB or Bluetooth
                    scanner, or enter the AWB reference above. The station will
                    fetch shipment details, manifest records, and historical
                    milestones.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="size-3.5 text-primary" />
                      Auto-submits on barcode scan
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-primary" />
                      Corridor route verified (DEL ↔ IMF)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Detail Dialog */}
          {detailOpen && shipment && (
            <ShipmentDetailDialog
              shipmentId={shipment.id}
              awbNumber={shipment.awbNumber}
              open={detailOpen}
              onOpenChange={setDetailOpen}
              initialData={shipment}
            />
          )}
        </div>

        {/* RIGHT COLUMN: Dedicated Tracking Result Update Station */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4">
          <Card className="sticky top-20 rounded-none border border-border bg-card shadow-none">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Send className="size-4 text-primary" />
                Update tracking result
              </CardTitle>
              <CardDescription>
                {shipment
                  ? `Log checkpoint movement for ${shipment.awbNumber}.`
                  : "Scan a shipment to enable live checkpoint logging."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              {shipment ? (
                <form onSubmit={handleUpdateSubmit} className="space-y-5">
                  {/* Current Status Info */}
                  <div className="flex items-center justify-between border border-border/80 bg-muted/30 p-2.5">
                    <span className="text-xs text-muted-foreground">
                      Current ledger status:
                    </span>
                    <StatusBadge status={shipment.status} />
                  </div>

                  {/* Checkpoint status notice */}
                  <div className="border border-border/80 bg-muted/30 p-2.5 text-xs text-muted-foreground">
                    Recording checkpoint observation for active cargo status. Custody status transitions occur through dispatch manifests and delivery handovers.
                  </div>

                  {/* Location Field with Quick Corridor Chips */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="update-location" className="text-xs">
                        Checkpoint location
                      </Label>
                      <span className="text-[11px] text-muted-foreground">
                        Hub or facility
                      </span>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                      <Input
                        id="update-location"
                        value={location}
                        maxLength={160}
                        required
                        placeholder="e.g. New Delhi Hub (DEL)"
                        className="rounded-none pl-8 text-xs"
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    {/* Quick corridor location chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {CORRIDOR_LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setLocation(loc)}
                          className="rounded-none border border-border/70 bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description / Event Notes Field */}
                  <div className="space-y-2">
                    <Label htmlFor="update-description" className="text-xs">
                      Checkpoint description
                    </Label>
                    <Textarea
                      id="update-description"
                      value={description}
                      maxLength={1000}
                      required
                      rows={3}
                      placeholder="Describe the operational milestone..."
                      className="rounded-none resize-none text-xs leading-relaxed"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {/* Event templates */}
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground">
                        Suggested milestone notes:
                      </span>
                      <div className="flex flex-col gap-1">
                        {EVENT_TEMPLATES.map((tmpl) => (
                          <button
                            key={tmpl}
                            type="button"
                            onClick={() => setDescription(tmpl)}
                            className="rounded-none border border-border/60 bg-muted/20 px-2 py-1 text-left text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {tmpl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Public Visibility Toggle */}
                  <div className="flex items-start gap-2.5 border border-border/80 bg-muted/20 p-3">
                    <Checkbox
                      id="public-toggle"
                      checked={isPublic}
                      onCheckedChange={(checked) => setIsPublic(checked === true)}
                      className="rounded-none mt-0.5"
                    />
                    <div className="space-y-0.5 text-xs">
                      <Label
                        htmlFor="public-toggle"
                        className="font-medium text-foreground cursor-pointer"
                      >
                        Publish to customer tracking
                      </Label>
                      <p className="text-[11px] leading-normal text-muted-foreground">
                        Makes this checkpoint visible to customers checking
                        their AWB on the public website.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting || !location.trim() || !description.trim()
                    }
                    className="w-full rounded-none"
                  >
                    <Send className="mr-2 size-4" />
                    {isSubmitting
                      ? "Recording checkpoint…"
                      : "Record tracking event"}
                  </Button>
                </form>
              ) : (
                /* Empty state guide when no shipment active */
                <div className="space-y-4 py-4 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center border border-border bg-muted/30">
                    <Radio className="size-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-medium text-sm text-foreground">
                      Awaiting shipment scan
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Scan or search for a parcel on the left to record its
                      status transition, log location checkpoints, and publish
                      customer notifications.
                    </p>
                  </div>
                  <div className="border-t border-border/60 pt-4 text-left">
                    <span className="font-semibold text-xs text-foreground">
                      Standard workflow:
                    </span>
                    <ol className="mt-2 list-inside list-decimal space-y-1.5 text-xs text-muted-foreground">
                      <li>Scan parcel shipping label with scanner.</li>
                      <li>Review weight and corridor routing.</li>
                      <li>Select checkpoint status and hub location.</li>
                      <li>Save to broadcast milestone to live ledger.</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
