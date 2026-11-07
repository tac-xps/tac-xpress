"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { FeedbackActions, type FeedbackData } from "./feedback-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"

const NEGATIVE_REGEX = /\b(delay\w*|damage\w*|broken|lost|late|poor|terrible|worst)\b/i
const POSITIVE_REGEX = /\b(great|fast|excellent|good|smooth|thank\w*|awesome)\b/i

function detectSentiment(message: string): "positive" | "negative" | "general" {
  if (NEGATIVE_REGEX.test(message)) {
    return "negative"
  }
  if (POSITIVE_REGEX.test(message)) {
    return "positive"
  }
  return "general"
}

export function FeedbackClientTable({
  data,
  pageCount,
}: {
  data: FeedbackData[]
  pageCount: number
}) {
  const enrichedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      sentiment: detectSentiment(item.message),
    }))
  }, [data])

  const columns = useMemo<ColumnDef<FeedbackData & { sentiment: "positive" | "negative" | "general" }>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <ColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <ColumnHeader column={column} title="Email" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => (
          <p
            className="max-w-md line-clamp-2 text-muted-foreground"
            title={row.original.message}
          >
            {row.original.message}
          </p>
        ),
      },
      {
        accessorKey: "sentiment",
        header: "Sentiment",
        cell: ({ row }) => {
          const sentiment = row.original.sentiment
          if (sentiment === "positive") {
            return (
              <Badge variant="success" className="text-micro font-medium">
                Positive
              </Badge>
            )
          }
          if (sentiment === "negative") {
            return (
              <Badge variant="destructive" className="text-micro font-medium">
                Attention
              </Badge>
            )
          }
          return (
            <Badge variant="secondary" className="text-micro font-medium">
              General
            </Badge>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <ColumnHeader column={column} title="Date" />,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
            {format(new Date(row.original.createdAt), "dd MMM yyyy")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <FeedbackActions feedback={row.original} />,
      },
    ],
    []
  )

  const { table } = useDataTable({
    data: enrichedData,
    columns,
    pageCount,
  })

  const exportToCsv = () => {
    if (enrichedData.length === 0) {
      toast.info("No feedback records to export")
      return
    }
    const headers = ["ID", "Name", "Email", "Sentiment", "Message", "Created At"]
    const rows = enrichedData.map((d) => [
      d.id,
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.email.replace(/"/g, '""')}"`,
      d.sentiment,
      `"${d.message.replace(/"/g, '""')}"`,
      d.createdAt,
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `tac-xpress-feedback-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Feedback records exported to CSV")
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end px-4 pt-3">
        <Button type="button" size="sm" variant="outline" onClick={exportToCsv}>
          <Download className="size-3.5 text-muted-foreground" />
          Export CSV
        </Button>
      </div>

      <DataTable table={table} columnsLength={columns.length} />
    </div>
  )
}
