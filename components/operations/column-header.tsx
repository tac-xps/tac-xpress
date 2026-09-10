"use client"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
export function ColumnHeader<TData>({
  column,
  title,
}: {
  column: Column<TData, unknown>
  title: string
}) {
  const direction = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 gap-2 font-medium"
      onClick={() => column.toggleSorting(direction === "asc")}
      aria-label={`Sort by ${title}, ${direction === "asc" ? "descending" : "ascending"}`}
    >
      {title}
      {direction === "asc" ? (
        <ArrowUp />
      ) : direction === "desc" ? (
        <ArrowDown />
      ) : (
        <ChevronsUpDown className="text-muted-foreground" />
      )}
    </Button>
  )
}
