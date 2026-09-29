"use client"
import type { BackgroundJob } from "@/lib/db/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FailedJobsTable({
  data,
  pageCount,
}: {
  data: BackgroundJob[]
  pageCount: number
}) {
  const columns: ColumnDef<BackgroundJob>[] = [
    { accessorKey: "kind", header: ({ column }) => <ColumnHeader column={column} title="Kind" />, cell: ({ row }) => <span className="font-medium">{row.original.kind}</span> },
    { accessorKey: "dedupeKey", header: ({ column }) => <ColumnHeader column={column} title="Dedupe Key" />, cell: ({ row }) => <span className="font-mono text-xs">{row.original.dedupeKey}</span> },
    { accessorKey: "attempts", header: ({ column }) => <ColumnHeader column={column} title="Attempts" />, cell: ({ row }) => row.original.attempts },
    { accessorKey: "lastError", header: ({ column }) => <ColumnHeader column={column} title="Last Error" />, cell: ({ row }) => <span className="max-w-[300px] truncate block" title={row.original.lastError ?? ""}>{row.original.lastError}</span> },
    { accessorKey: "createdAt", header: ({ column }) => <ColumnHeader column={column} title="Created" />, cell: ({ row }) => <span className="whitespace-nowrap">{format(new Date(row.original.createdAt), "PPp")}</span> },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Failed Background Jobs</CardTitle>
        <CardDescription>Jobs that exceeded max retries</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable table={table} columnsLength={columns.length} />
      </CardContent>
    </Card>
  )
}
