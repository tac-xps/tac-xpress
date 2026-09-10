"use client"
// Official shadcn data-table recipe, with URL-backed server sorting.
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
export type TableSort = { sort?: string; order?: "asc" | "desc" }
export function DataTable<TData extends { id: string }>({
  data,
  columns,
  sort,
  order = "desc",
}: { data: TData[]; columns: ColumnDef<TData>[] } & TableSort) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const sorting: SortingState = sort
    ? [{ id: sort, desc: order === "desc" }]
    : []
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualSorting: true,
    enableSortingRemoval: false,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      const url = new URL(window.location.href)
      url.searchParams.set("sort", next[0]?.id ?? "createdAt")
      url.searchParams.set("order", next[0]?.desc ? "desc" : "asc")
      url.searchParams.delete("page")
      startTransition(() => router.push(url.pathname + url.search))
    },
  })
  return (
    <div className="min-w-0" aria-busy={pending}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : undefined
                  }
                  className="first:pl-5 last:pr-5"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-4 first:pl-5 last:pr-5"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No matching records</EmptyTitle>
                    <EmptyDescription>
                      Try a different search or clear your filters. New records
                      will appear here when created.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <p
        className="border-t px-5 py-3 text-xs text-muted-foreground"
        role="status"
      >
        {pending
          ? "Updating records…"
          : `${data.length} records on this page · search and sorting apply across matching records`}
      </p>
    </div>
  )
}
