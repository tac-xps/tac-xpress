"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, RotateCcw, AlertTriangle, PackageCheck } from "lucide-react"
import { toast } from "sonner"

export interface DiscrepancyItem {
  id: string
  awb: string
  hub: string
  expectedLocation: string
  scannedLocation: string
  discrepancyType: "location_mismatch" | "unmanifested" | "missing_tag"
  status: "pending" | "reconciled"
  timestamp: string
}

const INITIAL_AUDIT_ITEMS: DiscrepancyItem[] = [
  {
    id: "aud-001",
    awb: "AWB-2026-GAU-0192",
    hub: "Guwahati Hub (GAU)",
    expectedLocation: "Bay A-12",
    scannedLocation: "Bay C-04",
    discrepancyType: "location_mismatch",
    status: "pending",
    timestamp: "10 mins ago",
  },
  {
    id: "aud-002",
    awb: "AWB-2026-IMP-0841",
    hub: "Imphal Hub (IMF)",
    expectedLocation: "Inbound Staging",
    scannedLocation: "Sorting Conveyor 2",
    discrepancyType: "unmanifested",
    status: "pending",
    timestamp: "25 mins ago",
  },
  {
    id: "aud-003",
    awb: "AWB-2026-DMR-0419",
    hub: "Dimapur Hub (DMU)",
    expectedLocation: "Outbound Dock 3",
    scannedLocation: "Dock 3",
    discrepancyType: "missing_tag",
    status: "pending",
    timestamp: "40 mins ago",
  },
  {
    id: "aud-004",
    awb: "AWB-2026-IXA-1102",
    hub: "Agartala Hub (IXA)",
    expectedLocation: "Secure Cage",
    scannedLocation: "Secure Cage",
    discrepancyType: "location_mismatch",
    status: "reconciled",
    timestamp: "1 hour ago",
  },
]

export function WarehouseAuditTable({ newScannedAwb }: { newScannedAwb?: string }) {
  const [items, setItems] = useState<DiscrepancyItem[]>(INITIAL_AUDIT_ITEMS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [prevScannedAwb, setPrevScannedAwb] = useState<string | undefined>(undefined)

  if (newScannedAwb && newScannedAwb !== prevScannedAwb) {
    setPrevScannedAwb(newScannedAwb)
    const alreadyListed = items.some((i) => i.awb === newScannedAwb)
    if (!alreadyListed) {
      const newItem: DiscrepancyItem = {
        id: `scan-${newScannedAwb}`,
        awb: newScannedAwb,
        hub: "Unknown Hub",
        expectedLocation: "Manifest",
        scannedLocation: "Floor Scan",
        discrepancyType: "unmanifested",
        status: "pending",
        timestamp: "Just now",
      }
      setItems((prev) => [newItem, ...prev])
    }
  }

  const pendingItems = items.filter((i) => i.status === "pending")
  const allPendingSelected =
    pendingItems.length > 0 &&
    pendingItems.every((item) => selectedIds.includes(item.id))

  const toggleSelectAll = () => {
    if (allPendingSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(pendingItems.map((i) => i.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBatchResolve = () => {
    if (selectedIds.length === 0) return

    setItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? { ...item, status: "reconciled" as const }
          : item
      )
    )

    toast.success(`Successfully reconciled ${selectedIds.length} consignment(s)`)
    setSelectedIds([])
  }

  const handleResolveSingle = (id: string, awb: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "reconciled" as const } : item
      )
    )
    setSelectedIds((prev) => prev.filter((i) => i !== id))
    toast.success(`Consignment ${awb} marked as reconciled`)
  }

  const getDiscrepancyBadge = (type: DiscrepancyItem["discrepancyType"]) => {
    switch (type) {
      case "location_mismatch":
        return <Badge variant="secondary">Location Mismatch</Badge>
      case "unmanifested":
        return <Badge variant="destructive">Unmanifested</Badge>
      case "missing_tag":
        return <Badge variant="outline">Missing Barcode Tag</Badge>
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="size-5 text-primary" />
            <CardTitle>Discrepancy Reconciliation</CardTitle>
          </div>
          <CardDescription className="mt-1">
            Reconcile physical inventory scans against expected manifests and hub bin locations.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleBatchResolve}
            disabled={selectedIds.length === 0}
            className="font-medium"
          >
            <CheckCircle2 className="mr-1.5 size-4" />
            Reconcile Selected ({selectedIds.length})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={allPendingSelected}
                    onCheckedChange={toggleSelectAll}
                    disabled={pendingItems.length === 0}
                    aria-label="Select all pending consignments"
                  />
                </TableHead>
                <TableHead>AWB / Unit</TableHead>
                <TableHead>Hub Branch</TableHead>
                <TableHead>Expected vs Scanned</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const isSelected = selectedIds.includes(item.id)
                const isPending = item.status === "pending"

                return (
                  <TableRow
                    key={item.id}
                    className={isSelected ? "bg-muted/40" : undefined}
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectItem(item.id)}
                        disabled={!isPending}
                        aria-label={`Select ${item.awb}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                      {item.awb}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.hub}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="text-muted-foreground line-through mr-1.5">
                        {item.expectedLocation}
                      </span>
                      <span className="font-medium text-foreground">
                        {item.scannedLocation}
                      </span>
                    </TableCell>
                    <TableCell>{getDiscrepancyBadge(item.discrepancyType)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "reconciled" ? "success" : "warning"}
                        className="text-xs capitalize"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isPending ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResolveSingle(item.id, item.awb)}
                          className="h-7 px-2 text-xs"
                        >
                          <CheckCircle2 className="mr-1 size-3.5 text-success" />
                          Resolve
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">Reconciled</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
