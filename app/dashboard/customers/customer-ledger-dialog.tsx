"use client"

import React, { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { useAction } from "next-safe-action/hooks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCustomerLedgerAction } from "./actions"
import { ShipmentDetailDialog } from "@/app/dashboard/shipments/shipment-detail-dialog"
import { InvoicePreviewDialog } from "@/app/dashboard/invoices/invoice-preview-dialog"
import { toast } from "sonner"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Loader2,
  FileSpreadsheet,
} from "lucide-react"

export interface CustomerLedgerDialogProps {
  customerId: string
  customerName?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
}

export function CustomerLedgerDialog({
  customerId,
  customerName,
  open,
  onOpenChange,
  initialData,
}: CustomerLedgerDialogProps) {
  const [data, setData] = useState<any>(initialData ?? null)
  const [selectedShipmentAwb, setSelectedShipmentAwb] = useState<string | null>(null)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const { execute, isExecuting } = useAction(getCustomerLedgerAction, {
    onSuccess: ({ data: result }) => {
      if (result) {
        setData(result)
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to load customer ledger")
    },
  })

  const fetchLedger = useCallback(() => {
    if (customerId) {
      execute({ id: customerId })
    }
  }, [customerId, execute])

  useEffect(() => {
    if (open) {
      fetchLedger()
    }
  }, [open, customerId, fetchLedger])

  const customer = data?.customer
  const invoices = data?.invoices ?? []
  const totals = data?.totals ?? { totalBilled: 0, totalAdvance: 0, totalDue: 0, totalCount: 0 }
  const displayName = customer?.name || customerName || "Customer Ledger"

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          data-slot="customer-ledger-dialog"
          className="sm:max-w-3xl md:max-w-4xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden"
        >
          {/* Header */}
          <DialogHeader className="px-6 py-3.5 border-b border-border/80 bg-muted/20 flex flex-row items-center justify-between gap-4 space-y-0 shrink-0 pr-14">
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <Building2 className="size-4 text-primary shrink-0" />
                <span className="truncate">{displayName}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Statement of account, invoice ledger, and financial balance.
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                asChild
                variant="outline"
                size="icon-sm"
                className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                title="Open full ledger in new tab"
              >
                <a
                  href={`/dashboard/customers/${customerId}/ledger`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open full customer ledger in new tab"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 pb-8 min-h-0 space-y-6">
            {isExecuting && !data ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="text-sm">Retrieving customer account statement…</p>
              </div>
            ) : (
              <>
                {/* Contact information strip */}
                {customer && (
                  <div className="rounded-none border border-border/80 bg-card p-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {customer.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-3.5 text-primary" />
                        {customer.email}
                      </span>
                    )}
                    {customer.phone && (
                      <span className="flex items-center gap-1.5 font-mono">
                        <Phone className="size-3.5 text-primary" />
                        {customer.phone}
                      </span>
                    )}
                    {(customer.city || customer.state) && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary" />
                        {[customer.city, customer.state].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                )}

                {/* 3 Metric Summary Cards */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Card className="rounded-none border-border/80 bg-card shadow-none">
                    <CardHeader className="pb-1 pt-3 px-4">
                      <CardTitle className="text-xs font-semibold text-muted-foreground">
                        Total Billed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <div className="text-xl font-bold font-mono text-foreground">
                        ₹{(totals.totalBilled / 100).toLocaleString("en-IN")}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-none border-border/80 bg-card shadow-none">
                    <CardHeader className="pb-1 pt-3 px-4">
                      <CardTitle className="text-xs font-semibold text-muted-foreground">
                        Total Paid (Advances)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <div className="text-xl font-bold font-mono text-trend-positive">
                        ₹{(totals.totalAdvance / 100).toLocaleString("en-IN")}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-none border-border/80 bg-card shadow-none">
                    <CardHeader className="pb-1 pt-3 px-4">
                      <CardTitle className="text-xs font-semibold text-muted-foreground">
                        Balance Due
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <div className="text-xl font-bold font-mono text-destructive">
                        ₹{(totals.totalDue / 100).toLocaleString("en-IN")}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Ledger Invoices Table */}
                <div className="rounded-none border border-border/80 overflow-hidden bg-card">
                  <div className="border-b border-border/80 bg-muted/20 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <FileSpreadsheet className="size-3.5 text-primary" />
                      Invoice Statement Ledger
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {totals.totalCount && totals.totalCount > invoices.length
                        ? `Showing ${invoices.length} most recent of ${totals.totalCount} invoices`
                        : `${invoices.length} ${invoices.length === 1 ? "invoice" : "invoices"}`}
                    </span>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border/80 bg-muted/10">
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">AWB / Shipment</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs text-right">Billed</TableHead>
                        <TableHead className="text-xs text-right">Paid</TableHead>
                        <TableHead className="text-xs text-right">Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv: any) => (
                        <TableRow key={inv.id}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {inv.createdAt
                              ? format(new Date(inv.createdAt), "dd MMM yyyy")
                              : "—"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {inv.awbNumber ? (
                              <button
                                type="button"
                                onClick={() => setSelectedShipmentAwb(inv.awbNumber)}
                                className="font-mono text-primary underline-offset-4 hover:underline cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                aria-label={`View shipment ${inv.awbNumber}`}
                              >
                                {inv.awbNumber}
                              </button>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge
                              variant={inv.status === "paid" ? "success" : "outline"}
                              className="capitalize text-[10px]"
                            >
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-right font-mono">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceId(inv.id)}
                              className="font-medium underline-offset-4 hover:underline hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              aria-label={`View invoice ${inv.id.slice(0, 8)}`}
                            >
                              ₹{((inv.amount || 0) / 100).toLocaleString("en-IN")}
                            </button>
                          </TableCell>
                          <TableCell className="text-xs text-right font-mono text-trend-positive">
                            ₹{((inv.advancePaid || 0) / 100).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell className="text-xs text-right font-mono font-semibold text-destructive">
                            ₹{((inv.balanceDue || 0) / 100).toLocaleString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}

                      {invoices.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-24 text-center text-xs text-muted-foreground"
                          >
                            No invoice records found for this customer.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {totals.totalCount && totals.totalCount > invoices.length && (
                    <div className="border-t border-border/70 bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
                      Displaying the 50 most recent invoices. Total financial metrics reflect the complete customer ledger.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Shipment Details Dialog */}
      {selectedShipmentAwb && (
        <ShipmentDetailDialog
          awbNumber={selectedShipmentAwb}
          open={Boolean(selectedShipmentAwb)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedShipmentAwb(null)
          }}
        />
      )}

      {/* Nested Invoice Preview Dialog */}
      {selectedInvoiceId && (
        <InvoicePreviewDialog
          invoiceId={selectedInvoiceId}
          open={Boolean(selectedInvoiceId)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedInvoiceId(null)
          }}
        />
      )}
    </>
  )
}
