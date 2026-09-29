"use client"
import type { DLQItem } from "@/lib/db/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DlqTable({
  data,
  pageCount,
}: {
  data: DLQItem[]
  pageCount: number
}) {
  const columns: ColumnDef<DLQItem>[] = [
    { accessorKey: "action", header: ({ column }) => <ColumnHeader column={column} title="Action" />, cell: ({ row }) => <span className="font-medium">{row.original.action}</span> },
    { accessorKey: "payload", header: ({ column }) => <ColumnHeader column={column} title="Payload snippet" />, cell: ({ row }) => <span className="font-mono text-xs max-w-[200px] truncate block">{JSON.stringify(row.original.payload)}</span> },
    { accessorKey: "error", header: ({ column }) => <ColumnHeader column={column} title="Error" />, cell: ({ row }) => <span className="max-w-[300px] truncate text-destructive block" title={row.original.error ?? ""}>{row.original.error}</span> },
    { accessorKey: "createdAt", header: ({ column }) => <ColumnHeader column={column} title="Created" />, cell: ({ row }) => <span className="whitespace-nowrap">{format(new Date(row.original.createdAt), "PPp")}</span> },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    pageKey: "dlq_page",
    perPageKey: "dlq_per_page",
    sortKey: "dlq_sort",
  })

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Dead Letter Queue</CardTitle>
        <CardDescription>Unprocessable webhook events and actions</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable table={table} columnsLength={columns.length} />
      </CardContent>
    </Card>
  )
}
