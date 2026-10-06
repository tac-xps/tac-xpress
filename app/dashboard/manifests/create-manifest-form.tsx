"use client"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Loader2, PackagePlus } from "lucide-react"
import { useWatch } from "react-hook-form"
import { useCreateManifestForm } from "./use-create-manifest-form"
import { ManifestCorridorCard } from "./manifest-corridor-card"
import { ManifestFleetCard } from "./manifest-fleet-card"
import {
  ManifestTelemetryCard,
  type ManifestShipmentItem,
  type ManifestVehicleOption,
  type ManifestHubOption,
} from "./manifest-telemetry-card"
import { ManifestShipmentSelector } from "./manifest-shipment-selector"
import type { ManifestDriverOption } from "./manifest-fleet-card"

interface CreateManifestFormProps {
  shipments: ManifestShipmentItem[]
  hubs: ManifestHubOption[]
  vehicles: ManifestVehicleOption[]
  drivers: ManifestDriverOption[]
  onSuccess: () => void
}

export function CreateManifestForm({
  shipments,
  hubs,
  vehicles,
  drivers,
  onSuccess,
}: CreateManifestFormProps) {
  const {
    form,
    status,
    onSubmit,
    scanInput,
    setScanInput,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    handleScanKeyDown,
    selectedShipmentIds,
    selectedCount,
  } = useCreateManifestForm(shipments, onSuccess)

  const selectedVehicleId = useWatch({ control: form.control, name: "vehicleId" })
  const selectedDestinationHubId = useWatch({ control: form.control, name: "destinationHubId" })

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)
  const selectedDestinationHub = hubs.find(
    (h) => h.id === selectedDestinationHubId
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 min-h-0 flex-col overflow-hidden"
      >
        <div className="grid min-h-0 flex-1 gap-5 p-4 sm:p-6 lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] overflow-hidden">
          {/* Left Column: Transit Corridor, Fleet & Crew, Real-Time STEM Telemetry (Scrollable) */}
          <div className="flex flex-col min-h-0 h-full overflow-y-auto pr-1.5 sm:pr-2.5 pb-6 space-y-3.5 manifest-scrollbar">
            <ManifestCorridorCard form={form} hubs={hubs} />
            <ManifestFleetCard
              form={form}
              vehicles={vehicles}
              drivers={drivers}
            />
            <ManifestTelemetryCard
              shipments={shipments}
              selectedShipmentIds={selectedShipmentIds}
              selectedVehicle={selectedVehicle}
              selectedDestinationHub={selectedDestinationHub}
            />
          </div>

          {/* Right Column: High-Density Search, Barcode Scan & Shipment Selector */}
          <div className="flex flex-col min-h-0 h-full max-h-full">
            <ManifestShipmentSelector
              form={form}
              shipments={shipments}
              selectedDestinationHub={selectedDestinationHub}
              scanInput={scanInput}
              setScanInput={setScanInput}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              handleScanKeyDown={handleScanKeyDown}
              selectedShipmentIds={selectedShipmentIds}
              selectedCount={selectedCount}
            />
          </div>
        </div>

        {/* Fixed Pinned Footer Actions */}
        <DialogFooter className="m-0 rounded-none shrink-0 border-t border-border bg-background px-4 py-3.5 sm:px-6 sm:py-4 flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{selectedCount}</span>{" "}
            cargo consignments staged for dispatch
          </div>
          <Button
            type="submit"
            disabled={status === "executing" || selectedCount === 0}
            className="rounded-none h-9 px-6 font-semibold text-xs"
          >
            {status === "executing" ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <PackagePlus className="mr-2 size-3.5" />
            )}
            {status === "executing"
              ? "Creating Manifest..."
              : `Create Digital Manifest (${selectedCount})`}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
