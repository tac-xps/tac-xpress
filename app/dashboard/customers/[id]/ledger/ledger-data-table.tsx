"use client"

import React, { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { Badge } from "@/components/ui/badge"
import { ShipmentDetailDialog } from "@/app/dashboard/shipments/shipment-detail-dialog"
import { InvoicePreviewDialog } from "@/app/dashboard/invoices/invoice-preview-dialog"

export type CustomerInvoiceRow = {
  id: string
  amount: number | null
  advancePaid: number | null
  balanceDue: number | null
  status: string
  createdAt: Date
  awbNumber: string | null
}

function LedgerAwbCell({ awbNumber }: { awbNumber: string | null }) {
  const [open, setOpen] = useState(false)
  if (!awbNumber) return <span className="text-muted-foreground text-xs">N/A</span>
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-xs font-semibold text-primary underline-offset-4 hover:underline cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={`View shipment ${awbNumber}`}
      >
        {awbNumber}
      </button>
      {open && (
        <ShipmentDetailDialog
          awbNumber={awbNumber}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  )
}

function LedgerInvoiceCell({ invoice }: { invoice: CustomerInvoiceRow }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-medium underline-offset-4 hover:underline hover:text-primary cursor-pointer text-right tabular-nums focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={`View invoice details for ${invoice.id.slice(0, 8)}`}
      >
        ₹{((invoice.amount || 0) / 100).toLocaleString()}
      </button>
      {open && (
        <InvoicePreviewDialog
          invoiceId={invoice.id}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  )
}

export function LedgerDataTable({
  data,
  pageCount,
}: {
  data: CustomerInvoiceRow[]
  pageCount: number
}) {
  const columns: ColumnDef<CustomerInvoiceRow>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => <ColumnHeader column={column} title="Date" />,
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: "awbNumber",
      header: ({ column }) => <ColumnHeader column={column} title="AWB Number" />,
      cell: ({ row }) => <LedgerAwbCell awbNumber={row.original.awbNumber} />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.status === "paid" ? "default" : "destructive"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <div className="text-right">
          <ColumnHeader column={column} title="Billed" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <LedgerInvoiceCell invoice={row.original} />
        </div>
      ),
    },
    {
      accessorKey: "advancePaid",
      header: ({ column }) => (
        <div className="text-right">
          <ColumnHeader column={column} title="Paid" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right text-trend-positive">
          ₹{((row.original.advancePaid || 0) / 100).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "balanceDue",
      header: ({ column }) => (
        <div className="text-right">
          <ColumnHeader column={column} title="Due" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-bold text-destructive">
          ₹{((row.original.balanceDue || 0) / 100).toLocaleString()}
        </div>
      ),
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })

  return (
    <div className="mt-4 border bg-card">
      <DataTable table={table} columnsLength={columns.length} />
    </div>
  )
}
