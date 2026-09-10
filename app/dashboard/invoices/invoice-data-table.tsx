"use client"
import Link from "next/link"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, type TableSort } from "@/components/operations/data-table"
import { ColumnHeader } from "@/components/operations/column-header"
import { Badge } from "@/components/ui/badge"
import { InvoiceTableActions } from "./invoice-table-actions"
import { type InvoiceData, formatInvoiceCurrency } from "./invoice-types"
const columns = (canVoid: boolean): ColumnDef<InvoiceData>[] => [
  { accessorKey: "id", header: ({ column }) => <ColumnHeader column={column} title="Invoice" />, cell: ({ row }) => <Link href={`/invoice/${row.original.id}`} className="font-mono text-xs font-medium underline-offset-4 hover:underline">{row.original.id.slice(0, 8).toUpperCase()}</Link> },
  { id: "customer", header: "Customer / shipment", cell: ({ row }) => <div><p className="font-medium">{row.original.customer?.name || row.original.shipment?.consignorName || "Name not recorded"}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{row.original.shipment?.awbNumber ?? "Shipment not linked"}</p></div> },
  { accessorKey: "createdAt", header: ({ column }) => <ColumnHeader column={column} title="Issued" />, cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy") },
  { accessorKey: "status", header: ({ column }) => <ColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant={row.original.status === "paid" ? "success" : row.original.status === "unpaid" ? "warning" : "outline"} className="capitalize">{row.original.status}</Badge> },
  { accessorKey: "amount", header: ({ column }) => <ColumnHeader column={column} title="Amount" />, cell: ({ row }) => <div className="text-right tabular-nums"><p className="font-medium">{formatInvoiceCurrency(row.original.amount)}</p><p className="mt-1 text-xs text-muted-foreground">{formatInvoiceCurrency(row.original.balanceDue ?? row.original.amount)} due</p></div> },
  { id: "delivery", header: "WhatsApp", cell: ({ row }) => <Badge variant={row.original.whatsappStatus === "failed" ? "destructive" : "outline"}>{row.original.whatsappStatus === "sent" ? "Provider accepted" : row.original.whatsappStatus === "failed" ? "Needs review" : "Not sent"}</Badge> },
  { id: "actions", header: "Actions", cell: ({ row }) => <InvoiceTableActions invoice={row.original} canVoid={canVoid} /> },
]
export function InvoiceDataTable({ data, canVoid = false, ...sort }: { data: InvoiceData[]; canVoid?: boolean } & TableSort) { return <DataTable data={data} columns={columns(canVoid)} {...sort} /> }

