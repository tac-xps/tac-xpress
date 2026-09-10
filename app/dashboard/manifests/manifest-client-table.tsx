"use client"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, type TableSort } from "@/components/operations/data-table"
import { ColumnHeader } from "@/components/operations/column-header"
import { Badge } from "@/components/ui/badge"
import { ManifestActions } from "./manifest-actions"
import type { ManifestDetail } from "./manifest-detail-dialog"
type ManifestRow = ManifestDetail & { originHub?: { name: string } | null; destinationHub?: { name: string } | null }
const columns: ColumnDef<ManifestRow>[] = [
  { accessorKey: "referenceId", header: ({ column }) => <ColumnHeader column={column} title="Manifest" />, cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.original.referenceId}</span> },
  { id: "route", header: "Hub route", cell: ({ row }) => <span>{row.original.originHub?.name ?? "Not assigned"} → {row.original.destinationHub?.name ?? "Not assigned"}</span> },
  { id: "assignment", header: "Driver / vehicle", cell: ({ row }) => <div><p>{row.original.driver?.name ?? "Driver not assigned"}</p><p className="mt-1 text-xs text-muted-foreground">{row.original.vehicle?.registrationNumber ?? "Vehicle not assigned"}</p></div> },
  { accessorKey: "createdAt", header: ({ column }) => <ColumnHeader column={column} title="Created" />, cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy") },
  { accessorKey: "status", header: ({ column }) => <ColumnHeader column={column} title="Status" />, cell: ({ row }) => <Badge variant={row.original.status === "finalized" ? "success" : "outline"} className="capitalize">{row.original.status}</Badge> },
  { id: "actions", header: "Actions", cell: ({ row }) => <ManifestActions manifest={row.original} /> },
]
export function ManifestClientTable({ manifests, ...sort }: { manifests: ManifestRow[] } & TableSort) { return <DataTable data={manifests} columns={columns} {...sort} /> }

