import { useQueryState, parseAsInteger, parseAsString } from "nuqs"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import React from "react"

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  pageCount: number
  defaultPerPage?: number
  defaultSort?: string
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  defaultPerPage = 10,
  defaultSort = "createdAt.desc",
}: UseDataTableProps<TData, TValue>) {
  // Query States
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger
      .withDefault(1)
      .withOptions({ shallow: false, history: "push" })
  )
  const [perPage, setPerPage] = useQueryState(
    "per_page",
    parseAsInteger
      .withDefault(defaultPerPage)
      .withOptions({ shallow: false, history: "push" })
  )
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString
      .withDefault(defaultSort)
      .withOptions({ shallow: false, history: "push" })
  )

  // Parse sorting state
  const [column, order] = sort?.split(".") ?? []
  const [sorting, setSorting] = React.useState<SortingState>(
    column && order ? [{ id: column, desc: order === "desc" }] : []
  )

  // Local state for visibility and filters (can also sync to Nuqs if needed later)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  // Create pagination state
  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: perPage,
  }

  // Effect to sync Table sorting to URL
  React.useEffect(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0]
      setSort(`${id}.${desc ? "desc" : "asc"}`)
    } else {
      setSort(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const nextState =
        typeof updater === "function" ? updater(pagination) : updater
      setPage(nextState.pageIndex + 1)
      setPerPage(nextState.pageSize)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  })

  return { table }
}
