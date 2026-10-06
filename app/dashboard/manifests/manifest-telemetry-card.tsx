"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Scale, Truck, AlertTriangle, CheckCircle2, Package, MapPin } from "lucide-react"

export interface ManifestShipmentItem {
  id: string
  awbNumber: string
  origin: string
  destination: string
  weightKg?: number | null
  pieces?: number | null
  serviceType?: string | null
  natureOfGoods?: string | null
}

export interface ManifestVehicleOption {
  id: string
  label: string
  capacityKg?: number | null
  driverId?: string | null
}

export interface ManifestHubOption {
  id: string
  label: string
  location?: string | null
}

interface ManifestTelemetryCardProps {
  selectedShipmentIds: string[]
  shipments: ManifestShipmentItem[]
  selectedVehicle?: ManifestVehicleOption | null
  selectedDestinationHub?: ManifestHubOption | null
}

export function ManifestTelemetryCard({
  selectedShipmentIds,
  shipments,
  selectedVehicle,
  selectedDestinationHub,
}: ManifestTelemetryCardProps) {
  const selectedShipments = shipments.filter((s) =>
    selectedShipmentIds.includes(s.id)
  )

  const totalWeightKg = selectedShipments.reduce(
    (sum, s) => sum + (Number(s.weightKg) || 0),
    0
  )
  const totalPieces = selectedShipments.reduce(
    (sum, s) => sum + (Number(s.pieces) || 1),
    0
  )

  const vehicleCapacityKg = selectedVehicle?.capacityKg || 0
  const isVehicleSelected = !!selectedVehicle && vehicleCapacityKg > 0

  const utilizationPercent = isVehicleSelected
    ? Math.round((totalWeightKg / vehicleCapacityKg) * 100)
    : 0

  const isOverloaded = isVehicleSelected && totalWeightKg > vehicleCapacityKg

  // Corridor checks: Check if selected shipments match the destination hub location
  const destHubLocation = selectedDestinationHub?.location?.toLowerCase() || ""
  const destHubName = selectedDestinationHub?.label?.toLowerCase() || ""

  const mismatchedShipments = selectedDestinationHub
    ? selectedShipments.filter((s) => {
        const shipmentDest = s.destination.toLowerCase()
        const matchesLocation =
          destHubLocation &&
          (shipmentDest.includes(destHubLocation) ||
            destHubLocation.includes(shipmentDest))
        const matchesName =
          destHubName &&
          (shipmentDest.includes(destHubName) ||
            destHubName.includes(shipmentDest))
        return !matchesLocation && !matchesName
      })
    : []

  const hasCorridorMismatch =
    !!selectedDestinationHub &&
    selectedShipments.length > 0 &&
    mismatchedShipments.length > 0

  return (
    <Card className="shrink-0 flex flex-col border-border bg-card shadow-xs rounded-none">
      <CardHeader className="border-b bg-muted/40 py-2.5 px-3.5 sm:px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-foreground uppercase">
            <Scale className="size-4 text-primary shrink-0" />
            Cargo Load &amp; Vehicle Telemetry
          </CardTitle>
          <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
            {selectedShipmentIds.length} Consignment{selectedShipmentIds.length === 1 ? "" : "s"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-3.5 space-y-2.5">
        {/* Load Metrics 3-Stat Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="border border-border/80 bg-muted/20 p-2 space-y-0.5">
            <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Gross Weight
            </span>
            <p className="font-mono text-sm sm:text-base font-bold text-foreground">
              {totalWeightKg.toFixed(1)}{" "}
              <span className="text-[10px] font-normal text-muted-foreground">KG</span>
            </p>
          </div>

          <div className="border border-border/80 bg-muted/20 p-2 space-y-0.5">
            <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Total Packages
            </span>
            <p className="font-mono text-sm sm:text-base font-bold text-foreground">
              {totalPieces}{" "}
              <span className="text-[10px] font-normal text-muted-foreground">Pcs</span>
            </p>
          </div>

          <div className="border border-border/80 bg-muted/20 p-2 space-y-0.5">
            <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Payload Limit
            </span>
            <p className="font-mono text-sm sm:text-base font-bold text-foreground">
              {isVehicleSelected ? vehicleCapacityKg : "—"}{" "}
              <span className="text-[10px] font-normal text-muted-foreground">KG</span>
            </p>
          </div>
        </div>

        {/* Vehicle Payload Utilization Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-muted-foreground">
              <Truck className="size-3 text-primary" /> Vehicle Payload Utilization
            </span>
            <span
              className={`font-mono text-[11px] font-bold ${
                isOverloaded
                  ? "text-destructive"
                  : utilizationPercent > 85
                  ? "text-status-pending"
                  : "text-foreground"
              }`}
            >
              {isVehicleSelected ? `${utilizationPercent}%` : "No vehicle selected"}
            </span>
          </div>

          <Progress
            value={Math.min(utilizationPercent, 100)}
            className={`h-2 rounded-none ${
              isOverloaded
                ? "[&>div]:bg-destructive"
                : utilizationPercent > 85
                ? "[&>div]:bg-status-pending"
                : "[&>div]:bg-primary"
            }`}
          />

          {isOverloaded && (
            <div className="flex items-center gap-1.5 text-xs text-destructive font-semibold bg-destructive/10 border border-destructive/30 p-2">
              <AlertTriangle className="size-3.5 shrink-0" />
              <span>
                OVERLOAD ALERT: Gross weight exceeds vehicle capacity by{" "}
                {(totalWeightKg - vehicleCapacityKg).toFixed(1)} KG!
              </span>
            </div>
          )}
        </div>

        {/* Route Corridor Alignment Status */}
        {selectedDestinationHub && selectedShipments.length > 0 && (
          <div
            className={`border p-2 text-xs space-y-0.5 ${
              hasCorridorMismatch
                ? "border-status-pending/40 bg-status-pending-wash text-status-pending"
                : "border-status-delivered/30 bg-status-delivered-wash text-status-delivered"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold uppercase text-[10px]">
              {hasCorridorMismatch ? (
                <>
                  <AlertTriangle className="size-3.5 text-status-pending shrink-0" />
                  <span>Corridor Route Warning</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 text-status-delivered shrink-0" />
                  <span>All Shipments Aligned to Corridor</span>
                </>
              )}
            </div>
            {hasCorridorMismatch ? (
              <p className="text-[11px] leading-snug">
                {mismatchedShipments.length} selected consignment
                {mismatchedShipments.length === 1 ? "" : "s"} destination (
                {mismatchedShipments.map((s) => s.destination).join(", ")}) deviates from
                the destination hub ({selectedDestinationHub.label}).
              </p>
            ) : (
              <p className="text-[11px] leading-snug">
                Cargo routes match linehaul destination: {selectedDestinationHub.label}.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
