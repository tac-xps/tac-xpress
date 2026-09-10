"use client"
import Link from "next/link"
import { Search } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { StatusBadge } from "@/components/logistics/status-badge"
import { AddTrackingEventDialog } from "@/app/dashboard/shipments/add-tracking-event-dialog"
export function ScannerStation({ initialAwb }: { initialAwb: string }) {
  const station = useScannerStation(initialAwb)
  const shipment = station.result?.data
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Tracking & scanner station"
        description="Scan a barcode or enter an AWB to retrieve a shipment. Review the record before logging movement."
      />
      <Card className="shadow-none">
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void station.search(station.query)
            }}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end"
          >
            <div className="grid min-w-0 flex-1 gap-2">
              <Label htmlFor="station-awb">AWB or shipment ID</Label>
              <Input
                id="station-awb"
                value={station.query}
                maxLength={64}
                required
                autoComplete="off"
                placeholder="Enter or scan the reference"
                className="font-mono"
                onChange={(event) =>
                  station.setQuery(event.target.value.toUpperCase())
                }
              />
            </div>
            <Button
              type="submit"
              disabled={station.loading || !station.query.trim()}
            >
              <Search />
              {station.loading ? "Searching…" : "Find shipment"}
            </Button>
            <Button type="button" variant="outline" onClick={station.clear}>
              Clear
            </Button>
          </form>
        </CardContent>
      </Card>
      {station.loading && (
        <p role="status" className="text-sm text-muted-foreground">
          Retrieving the latest record…
        </p>
      )}
      {station.result && !station.result.success && (
        <Alert variant="destructive">
          <AlertDescription>
            {station.result.error ||
              "Shipment not found. Check the reference and try again."}
          </AlertDescription>
        </Alert>
      )}
      {shipment && (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-mono">{shipment.awbNumber}</CardTitle>
            <CardDescription>
              {shipment.origin} → {shipment.destination}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StatusBadge status={shipment.status} />
            <dl className="grid grid-cols-2 gap-5 text-sm sm:grid-cols-4">
              {[
                [
                  "Service",
                  shipment.serviceType === "express_air"
                    ? "Air cargo"
                    : "Surface cargo",
                ],
                ["Actual weight", `${shipment.weightKg} kg`],
                ["Packages", String(shipment.pieces)],
                ["Recipient", shipment.consigneeName || "Not recorded"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline">
                <Link href={`/dashboard/shipments/${shipment.id}`}>
                  Open complete record
                </Link>
              </Button>
              <div>
                <AddTrackingEventDialog
                  shipmentId={shipment.id}
                  awbNumber={shipment.awbNumber}
                  onSuccess={() => {
                    void station.search(shipment.awbNumber)
                  }}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              The complete record contains contacts, tracking history and
              private documents. Tracking updates are internal unless staff
              explicitly publish them.
            </p>
          </CardContent>
        </Card>
      )}
      {!station.loading && !station.result && (
        <Empty className="border bg-card">
          <EmptyHeader>
            <EmptyTitle>Ready for a shipment reference</EmptyTitle>
            <EmptyDescription>
              A compatible keyboard scanner can enter the barcode. Scanning only
              retrieves a record; it does not change shipment status.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
