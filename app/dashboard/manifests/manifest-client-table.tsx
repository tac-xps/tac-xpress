"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { Badge } from "@/components/ui/badge"
import { ManifestActions } from "./manifest-actions"
import { ManifestDetailDialog, type ManifestDetail } from "./manifest-detail-dialog"

type ManifestRow = ManifestDetail & {
  originHub?: { name: string } | null
  destinationHub?: { name: string } | null
}

function ManifestIdCell({ manifest }: { manifest: ManifestRow }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-xs font-medium text-foreground underline-offset-4 hover:underline hover:text-primary transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={`View manifest ${manifest.referenceId}`}
      >
        {manifest.referenceId}
      </button>
      {open && (
        <ManifestDetailDialog
          manifest={manifest}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  )
}

const columns: ColumnDef<ManifestRow>[] = [
  {
    accessorKey: "referenceId",
    header: ({ column }) => <ColumnHeader column={column} title="Manifest" />,
    cell: ({ row }) => <ManifestIdCell manifest={row.original} />,
  },
  {
    id: "route",
    header: "Hub route",
    cell: ({ row }) => (
      <span>
        {row.original.originHub?.name ?? "Not assigned"} →{" "}
        {row.original.destinationHub?.name ?? "Not assigned"}
      </span>
    ),
  },
  {
    id: "assignment",
    header: "Driver / vehicle",
    cell: ({ row }) => (
      <div>
        <p>{row.original.driver?.name ?? "Driver not assigned"}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {row.original.vehicle?.registrationNumber ?? "Vehicle not assigned"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <ColumnHeader column={column} title="Created" />,
    cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy"),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "finalized" ? "success" : "outline"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ManifestActions manifest={row.original} />,
  },
]

export function ManifestClientTable({
  manifests,
  pageCount,
}: {
  manifests: ManifestRow[]
  pageCount: number
}) {
  const { table } = useDataTable({
    data: manifests,
    columns,
    pageCount,
  })
  return <DataTable table={table} columnsLength={columns.length} />
}
