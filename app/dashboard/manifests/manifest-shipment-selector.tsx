"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ScanBarcode,
  Search,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  Scale,
  Layers,
  Package,
  Filter,
} from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { CreateManifestValues } from "./validations"
import type {
  ManifestShipmentItem,
  ManifestHubOption,
} from "./manifest-telemetry-card"

interface ManifestShipmentSelectorProps {
  form: UseFormReturn<CreateManifestValues>
  shipments: ManifestShipmentItem[]
  selectedDestinationHub?: ManifestHubOption | null
  scanInput: string
  setScanInput: (val: string) => void
  searchQuery: string
  setSearchQuery: (val: string) => void
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  handleScanKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  selectedShipmentIds: string[]
  selectedCount: number
}

export function ManifestShipmentSelector({
  form,
  shipments,
  selectedDestinationHub,
  scanInput,
  setScanInput,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  handleScanKeyDown,
  selectedShipmentIds,
  selectedCount,
}: ManifestShipmentSelectorProps) {
  const [corridorOnly, setCorridorOnly] = useState(false)
  const itemsPerPage = 6

  const destHubLocation = selectedDestinationHub?.location?.toLowerCase() || ""
  const destHubName = selectedDestinationHub?.label?.toLowerCase() || ""

  // Filter shipments based on search query AND optional corridor filter
  const filteredShipments = useMemo(() => {
    let result = shipments

    if (corridorOnly && selectedDestinationHub) {
      result = result.filter((s) => {
        const shipmentDest = s.destination.toLowerCase()
        const matchesLocation =
          destHubLocation &&
          (shipmentDest.includes(destHubLocation) ||
            destHubLocation.includes(shipmentDest))
        const matchesName =
          destHubName &&
          (shipmentDest.includes(destHubName) ||
            destHubName.includes(shipmentDest))
        return matchesLocation || matchesName
      })
    }

    const q = searchQuery.toLowerCase().trim()
    if (q) {
      result = result.filter(
        (s) =>
          s.awbNumber.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q)
      )
    }

    return result
  }, [
    shipments,
    searchQuery,
    corridorOnly,
    selectedDestinationHub,
    destHubLocation,
    destHubName,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredShipments.length / itemsPerPage)
  )

  // Auto-reset page when destination hub or corridor filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [corridorOnly, selectedDestinationHub, searchQuery, setCurrentPage])

  // Clamp current page if filtered set shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages, setCurrentPage])

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedShipments = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage
    return filteredShipments.slice(start, start + itemsPerPage)
  }, [filteredShipments, safeCurrentPage, itemsPerPage])

  const areAllFilteredSelected =
    filteredShipments.length > 0 &&
    filteredShipments.every((s) => selectedShipmentIds.includes(s.id))

  const toggleSelectAllFiltered = () => {
    const currentIds = form.getValues("shipmentIds") || []
    if (areAllFilteredSelected) {
      const filteredIdSet = new Set(filteredShipments.map((s) => s.id))
      form.setValue(
        "shipmentIds",
        currentIds.filter((id) => !filteredIdSet.has(id)),
        { shouldDirty: true }
      )
    } else {
      const newIds = Array.from(
        new Set([...currentIds, ...filteredShipments.map((s) => s.id)])
      )
      form.setValue("shipmentIds", newIds, { shouldDirty: true })
    }
  }

  const toggleShipment = (shipmentId: string) => {
    const currentIds = form.getValues("shipmentIds") || []
    if (currentIds.includes(shipmentId)) {
      form.setValue(
        "shipmentIds",
        currentIds.filter((id) => id !== shipmentId),
        { shouldDirty: true }
      )
    } else {
      form.setValue("shipmentIds", [...currentIds, shipmentId], {
        shouldDirty: true,
      })
    }
  }

  return (
    <Card className="flex h-full min-h-0 flex-col rounded-none border-border bg-card shadow-xs">
      <CardContent className="flex h-full min-h-0 flex-col space-y-3.5 p-4 sm:p-5">
        {/* Header & Bulk Actions Toolbar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
              Shipment Selection
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Scan barcodes or check cargo to bundle into this load.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleSelectAllFiltered}
              className="h-7 rounded-none px-2.5 text-xs font-medium"
            >
              {areAllFilteredSelected ? (
                <>
                  <CheckSquare className="mr-1 size-3.5 text-primary" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="mr-1 size-3.5 text-muted-foreground" />
                  Select All ({filteredShipments.length})
                </>
              )}
            </Button>
            <Badge
              variant={selectedCount > 0 ? "default" : "secondary"}
              className="rounded-none font-mono text-xs tabular-nums"
            >
              {selectedCount} / {shipments.length}
            </Badge>
          </div>
        </div>

        {/* Search, Scan, and Corridor Filter Controls */}
        <div className="shrink-0 space-y-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="relative">
              <ScanBarcode className="absolute top-2.5 left-2.5 size-4 text-primary" />
              <Input
                placeholder="Scan or enter AWB..."
                className="h-9 rounded-none border-border bg-background pl-8 font-mono text-xs focus-visible:border-primary"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={handleScanKeyDown}
              />
            </div>
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Filter by AWB, city..."
                className="h-9 rounded-none border-border bg-background pl-8 text-xs focus-visible:border-primary"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>

          {/* Corridor Quick Filter Button */}
          {selectedDestinationHub && (
            <div className="flex items-center justify-between border border-border/60 bg-muted/30 p-2 text-xs">
              <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase">
                <Filter className="size-3 text-primary" /> Corridor Filter:
              </span>
              <Button
                type="button"
                variant={corridorOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCorridorOnly(!corridorOnly)
                  setCurrentPage(1)
                }}
                className="h-6 rounded-none px-2.5 text-[11px] font-medium"
              >
                {corridorOnly
                  ? `Showing Corridor Only (${filteredShipments.length})`
                  : `Show Only ${selectedDestinationHub.label} Cargo`}
              </Button>
            </div>
          )}
        </div>

        {/* Scrollable Shipment List View */}
        <div className="flex min-h-0 flex-1 flex-col justify-between">
          <div className="max-h-[460px] min-h-[320px] space-y-2 overflow-y-auto pr-1 pb-2 lg:max-h-[500px]">
            {paginatedShipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-1 border border-dashed border-border p-8 text-center">
                <Package className="size-8 text-muted-foreground opacity-40" />
                <p className="text-xs font-semibold text-foreground">
                  No matching eligible shipments
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {searchQuery || corridorOnly
                    ? "Try adjusting your search or corridor filters."
                    : "All available shipments are already manifested."}
                </p>
              </div>
            ) : (
              paginatedShipments.map((shipment) => {
                const isChecked = selectedShipmentIds.includes(shipment.id)
                const shipmentDest = shipment.destination.toLowerCase()
                const matchesCorridor =
                  !selectedDestinationHub ||
                  (destHubLocation &&
                    (shipmentDest.includes(destHubLocation) ||
                      destHubLocation.includes(shipmentDest))) ||
                  (destHubName &&
                    (shipmentDest.includes(destHubName) ||
                      destHubName.includes(shipmentDest)))

                return (
                  <div
                    key={shipment.id}
                    role="checkbox"
                    aria-checked={isChecked}
                    tabIndex={0}
                    onClick={() => toggleShipment(shipment.id)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault()
                        toggleShipment(shipment.id)
                      }
                    }}
                    className={`group flex cursor-pointer items-center justify-between rounded-none border p-2.5 transition-colors outline-none select-none focus-visible:ring-1 focus-visible:ring-primary ${
                      isChecked
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`pointer-events-none flex size-4 shrink-0 items-center justify-center border transition-colors ${
                          isChecked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background group-hover:border-primary/50"
                        }`}
                        aria-hidden="true"
                      >
                        {isChecked && <Check className="size-3 stroke-[3]" />}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {shipment.awbNumber}
                          </span>
                          {shipment.serviceType && (
                            <span className="py-0.2 border border-border bg-muted px-1 font-mono text-[9px] text-muted-foreground uppercase">
                              {shipment.serviceType.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Scale className="size-2.5 text-primary" />
                            {shipment.weightKg || 0} kg
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Layers className="size-2.5" />
                            {shipment.pieces || 1} pcs
                          </span>
                          <span>•</span>
                          <span className="truncate">
                            ID: {shipment.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-right">
                      {!matchesCorridor && (
                        <span
                          className="inline-flex items-center gap-1 rounded-none border border-status-pending/40 bg-status-pending-wash px-1.5 py-0.5 font-mono text-[9px] font-medium text-status-pending uppercase"
                          title="Cargo destination differs from selected destination hub"
                        >
                          <AlertTriangle className="size-2.5 shrink-0 text-status-pending" />
                          Deviation
                        </span>
                      )}
                      <Badge
                        variant={isChecked ? "default" : "outline"}
                        className="rounded-none font-mono text-[10px] font-semibold tracking-wider uppercase"
                      >
                        {shipment.destination}
                      </Badge>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 rounded-none px-2.5 text-xs font-medium"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="font-mono text-[11px] text-muted-foreground">
                Page {currentPage} of {totalPages} ({filteredShipments.length}{" "}
                total)
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 rounded-none px-2.5 text-xs font-medium"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
