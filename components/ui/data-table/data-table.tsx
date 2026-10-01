import * as React from "react"
import { type Table as TableType, flexRender } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData> {
  table: TableType<TData>
  columnsLength: number
  searchKey?: string
  searchPlaceholder?: string
  isLoading?: boolean
  bordered?: boolean
}

export function DataTable<TData>({
  table,
  columnsLength,
  searchKey,
  searchPlaceholder,
  isLoading,
  bordered = true,
}: DataTableProps<TData>) {
  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
      />
      <div
        className={cn(
          "overflow-hidden bg-card",
          bordered && "rounded-xl border border-border/80 shadow-xs"
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columnsLength}
                  className="h-28 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsLength}
                  className="h-28 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="border-t border-border/80 bg-muted/20 px-4 py-3 sm:px-6">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}
