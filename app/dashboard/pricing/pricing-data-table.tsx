"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { PricingActions } from "./pricing-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator } from "lucide-react"

function formatServiceType(service: string) {
  return service
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

type PricingRuleType = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  origin: string;
  destination: string;
  serviceType: string;
  basePrice: number;
  pricePerKg: number;
}

export function PricingDataTable({
  data,
  pageCount,
}: {
  data: PricingRuleType[]
  pageCount: number
}) {
  const columns: ColumnDef<PricingRuleType>[] = [
    { accessorKey: "serviceType", header: ({ column }) => <ColumnHeader column={column} title="Service Type" />, cell: ({ row }) => <span className="font-medium">{formatServiceType(row.original.serviceType)}</span> },
    { accessorKey: "origin", header: ({ column }) => <ColumnHeader column={column} title="Origin Hub" />, cell: ({ row }) => <span className="font-mono uppercase">{row.original.origin}</span> },
    { accessorKey: "destination", header: ({ column }) => <ColumnHeader column={column} title="Destination Hub" />, cell: ({ row }) => <span className="font-mono uppercase">{row.original.destination}</span> },
    { accessorKey: "basePrice", header: ({ column }) => <ColumnHeader column={column} title="Base Price" />, cell: ({ row }) => <span className="tabular-nums font-medium text-right block">₹{(row.original.basePrice / 100).toFixed(2)}</span> },
    { accessorKey: "pricePerKg", header: ({ column }) => <ColumnHeader column={column} title="Price per Kg" />, cell: ({ row }) => <span className="tabular-nums font-medium text-right block">₹{(row.original.pricePerKg / 100).toFixed(2)}</span> },
    { id: "actions", header: "", cell: ({ row }) => <div className="text-center"><PricingActions rule={row.original} /></div> },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/10 p-6">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Calculator className="size-5 text-primary" />
          Active Route Rates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable table={table} columnsLength={columns.length} />
      </CardContent>
    </Card>
  )
}
