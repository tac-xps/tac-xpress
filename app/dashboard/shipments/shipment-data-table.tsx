"use client"
import Link from "next/link"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, type TableSort } from "@/components/operations/data-table"
import { ColumnHeader } from "@/components/operations/column-header"
import { ShipmentActions, type ShipmentWithRelations } from "./shipment-actions"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/logistics/status-badge"
const columns: ColumnDef<ShipmentWithRelations>[] = [
  { accessorKey: "awbNumber", header: ({ column }) => <ColumnHeader column={column} title="AWB / reference" />, cell: ({ row }) => <Link href={`/dashboard/shipments/${row.original.id}`} className="font-mono text-xs font-medium underline-offset-4 hover:underline">{row.original.awbNumber}</Link> },
  { accessorKey: "origin", header: ({ column }) => <ColumnHeader column={column} title="Route" />, cell: ({ row }) => <div><p>{row.original.origin} → {row.original.destination}</p><p className="mt-1 text-xs text-muted-foreground">{row.original.serviceType === "express_air" ? "Air cargo" : "Surface cargo"} · {row.original.weightKg} kg</p></div> },
  { id: "handling", header: "Handling", enableSorting: false, cell: ({ row }) => <div className="flex gap-2">{row.original.isFragile && <Badge variant="outline">Fragile</Badge>}{row.original.insuranceOptIn && <Badge variant="outline">Insurance requested</Badge>}{!row.original.isFragile && !row.original.insuranceOptIn && <span className="text-muted-foreground">Standard</span>}</div> },
  { accessorKey: "createdAt", header: ({ column }) => <ColumnHeader column={column} title="Created" />, cell: ({ row }) => <time dateTime={new Date(row.original.createdAt).toISOString()} className="text-muted-foreground">{format(new Date(row.original.createdAt), "dd MMM yyyy")}</time> },
  { accessorKey: "status", header: ({ column }) => <ColumnHeader column={column} title="Status" />, cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { id: "actions", header: "Actions", cell: ({ row }) => <ShipmentActions shipment={row.original} /> },
]
export function ShipmentsDataTable({ data, ...sort }: { data: ShipmentWithRelations[] } & TableSort) { return <DataTable data={data} columns={columns} {...sort} /> }

