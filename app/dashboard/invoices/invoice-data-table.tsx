"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { Badge } from "@/components/ui/badge"
import { InvoiceTableActions } from "./invoice-table-actions"
import { InvoicePreviewDialog } from "./invoice-preview-dialog"
import { type InvoiceData, formatInvoiceCurrency } from "./invoice-types"

function InvoiceIdCell({ invoice }: { invoice: InvoiceData }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-xs font-medium text-foreground underline-offset-4 hover:underline hover:text-primary transition-colors cursor-pointer text-left"
        aria-label={`View invoice ${invoice.id.slice(0, 8)}`}
      >
        {invoice.id.slice(0, 8).toUpperCase()}
      </button>
      {open && (
        <InvoicePreviewDialog
          invoiceId={invoice.id}
          shipmentId={invoice.shipmentId}
          initialTab="invoice"
          open={open}
          onOpenChange={setOpen}
          initialData={invoice.shipment ? invoice : undefined}
        />
      )}
    </>
  )
}

const columns = (canVoid: boolean): ColumnDef<InvoiceData>[] => [
  { accessorKey: "id", header: ({ column }) => <ColumnHeader column={column} title="Invoice" />, cell: ({ row }) => <InvoiceIdCell invoice={row.original} /> },
  { id: "customer", header: "Customer / shipment", cell: ({ row }) => <div><p className="font-medium">{row.original.customer?.name || row.original.shipment?.consignorName || "Name not recorded"}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{row.original.shipment?.awbNumber ?? "Shipment not linked"}</p></div> },
  { accessorKey: "createdAt", header: ({ column }) => <ColumnHeader column={column} title="Issued" />, cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy") },
  { accessorKey: "status", header: ({ column }) => <ColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant={row.original.status === "paid" ? "success" : row.original.status === "unpaid" ? "warning" : "outline"} className="capitalize">{row.original.status}</Badge> },
  { accessorKey: "amount", header: ({ column }) => <ColumnHeader column={column} title="Amount" />, cell: ({ row }) => <div className="text-right tabular-nums"><p className="font-medium">{formatInvoiceCurrency(row.original.amount)}</p><p className="mt-1 text-xs text-muted-foreground">{formatInvoiceCurrency(row.original.balanceDue ?? row.original.amount)} due</p></div> },
  { id: "delivery", header: "WhatsApp", cell: ({ row }) => <Badge variant={row.original.whatsappStatus === "failed" ? "destructive" : "outline"}>{row.original.whatsappStatus === "sent" ? "Provider accepted" : row.original.whatsappStatus === "failed" ? "Needs review" : "Not sent"}</Badge> },
  { id: "actions", header: "Actions", cell: ({ row }) => <InvoiceTableActions invoice={row.original} canVoid={canVoid} /> },
]
export function InvoiceDataTable({ data, canVoid = false, pageCount }: { data: InvoiceData[]; canVoid?: boolean, pageCount: number }) {
  const tableColumns = columns(canVoid)
  const { table } = useDataTable({
    data,
    columns: tableColumns,
    pageCount,
  })
  return <DataTable table={table} columnsLength={tableColumns.length} />
}
