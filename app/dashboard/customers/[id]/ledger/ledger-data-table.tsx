"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { Badge } from "@/components/ui/badge"

export type CustomerInvoiceRow = {
  id: string
  amount: number | null
  advancePaid: number | null
  balanceDue: number | null
  status: string
  createdAt: Date
  awbNumber: string | null
}

export function LedgerDataTable({
  data,
  pageCount,
}: {
  data: CustomerInvoiceRow[]
  pageCount: number
}) {
  const columns: ColumnDef<CustomerInvoiceRow>[] = [
    { accessorKey: "createdAt", header: ({ column }) => <ColumnHeader column={column} title="Date" />, cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString() },
    { accessorKey: "awbNumber", header: ({ column }) => <ColumnHeader column={column} title="AWB Number" />, cell: ({ row }) => <span className="font-medium">{row.original.awbNumber || "N/A"}</span> },
    { accessorKey: "status", header: ({ column }) => <ColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant={row.original.status === "paid" ? "default" : "destructive"}>{row.original.status}</Badge> },
    { accessorKey: "amount", header: ({ column }) => <div className="text-right"><ColumnHeader column={column} title="Billed" /></div>, cell: ({ row }) => <div className="text-right">₹{((row.original.amount || 0) / 100).toLocaleString()}</div> },
    { accessorKey: "advancePaid", header: ({ column }) => <div className="text-right"><ColumnHeader column={column} title="Paid" /></div>, cell: ({ row }) => <div className="text-right text-trend-positive">₹{((row.original.advancePaid || 0) / 100).toLocaleString()}</div> },
    { accessorKey: "balanceDue", header: ({ column }) => <div className="text-right"><ColumnHeader column={column} title="Due" /></div>, cell: ({ row }) => <div className="text-right font-bold text-destructive">₹{((row.original.balanceDue || 0) / 100).toLocaleString()}</div> },
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
