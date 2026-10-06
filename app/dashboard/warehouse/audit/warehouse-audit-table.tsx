"use client"

import { useState, useEffect, useRef } from "react"
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
import { CheckCircle2, RotateCcw, PackageCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  getWarehouseAuditDiscrepanciesAction,
  verifyAwbForAuditAction,
  reconcileWarehouseDiscrepanciesAction,
  type DiscrepancyRecord,
} from "@/app/dashboard/warehouse/actions"

export type DiscrepancyItem = DiscrepancyRecord

export function WarehouseAuditTable({ newScannedAwb }: { newScannedAwb?: string }) {
  const [items, setItems] = useState<DiscrepancyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isResolving, setIsResolving] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const lastProcessedAwbRef = useRef<string | null>(null)

  useEffect(() => {
    let active = true
    async function loadDiscrepancies() {
      setIsLoading(true)
      const res = await getWarehouseAuditDiscrepanciesAction()
      if (active) {
        if (res.success && res.data) {
          setItems(res.data)
        }
        setIsLoading(false)
      }
    }
    loadDiscrepancies()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!newScannedAwb || newScannedAwb === lastProcessedAwbRef.current) return
    lastProcessedAwbRef.current = newScannedAwb

    async function handleScan(awb: string) {
      const res = await verifyAwbForAuditAction(awb)
      if (!res.success) {
        toast.error(res.error || "Failed to audit scan.")
        return
      }

      if (res.isDiscrepancy && res.discrepancy) {
        setItems((prev) => {
          if (prev.some((item) => item.awb === res.discrepancy!.awb)) return prev
          return [res.discrepancy!, ...prev]
        })
        toast.warning(res.message || `Discrepancy flagged for AWB ${awb}`)
      } else {
        toast.info(res.message || `AWB ${awb} verified against manifest.`)
      }
    }

    void handleScan(newScannedAwb)
  }, [newScannedAwb])

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

  const handleBatchResolve = async () => {
    if (selectedIds.length === 0 || isResolving) return

    const awbsToResolve = items
      .filter((i) => selectedIds.includes(i.id))
      .map((i) => i.awb)

    setIsResolving(true)
    const res = await reconcileWarehouseDiscrepanciesAction(awbsToResolve)
    setIsResolving(false)

    if (!res.success) {
      toast.error(res.error || "Failed to reconcile consignments")
      return
    }

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

  const handleResolveSingle = async (id: string, awb: string) => {
    if (isResolving) return
    setIsResolving(true)
    const res = await reconcileWarehouseDiscrepanciesAction([awb])
    setIsResolving(false)

    if (!res.success) {
      toast.error(res.error || `Failed to reconcile ${awb}`)
      return
    }

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
            disabled={selectedIds.length === 0 || isResolving}
            className="font-medium"
          >
            {isResolving ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-1.5 size-4" />
            )}
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
                    disabled={pendingItems.length === 0 || isLoading}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Loader2 className="size-6 animate-spin text-primary mb-2" />
                      <p className="text-xs">Loading warehouse audit data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <CheckCircle2 className="size-8 text-success/70 mb-2" />
                      <p className="text-sm font-medium text-foreground">No active discrepancies</p>
                      <p className="text-xs">All floor inventory matches recorded manifests. Scan any unit to audit.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
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
                          disabled={!isPending || isResolving}
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
                            disabled={isResolving}
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
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
