"use client"

import { useState, useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { FeedbackActions, type FeedbackData } from "./feedback-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MessageCircle, AlertCircle, ThumbsUp } from "lucide-react"

type SentimentType = "all" | "positive" | "negative" | "general"

function detectSentiment(message: string): "positive" | "negative" | "general" {
  const lower = message.toLowerCase()
  if (
    lower.includes("delay") ||
    lower.includes("damage") ||
    lower.includes("broken") ||
    lower.includes("lost") ||
    lower.includes("late") ||
    lower.includes("poor") ||
    lower.includes("terrible") ||
    lower.includes("worst")
  ) {
    return "negative"
  }
  if (
    lower.includes("great") ||
    lower.includes("fast") ||
    lower.includes("excellent") ||
    lower.includes("good") ||
    lower.includes("smooth") ||
    lower.includes("thank") ||
    lower.includes("awesome")
  ) {
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
  const [filterSentiment, setFilterSentiment] = useState<SentimentType>("all")

  const enrichedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      sentiment: detectSentiment(item.message),
    }))
  }, [data])

  const filteredData = useMemo(() => {
    if (filterSentiment === "all") return enrichedData
    return enrichedData.filter((item) => item.sentiment === filterSentiment)
  }, [enrichedData, filterSentiment])

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
            {new Date(row.original.createdAt).toLocaleDateString()}
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
    data: filteredData,
    columns,
    pageCount,
  })

  return (
    <div className="space-y-3">
      {/* Sentiment Filter Toolbar with keyboard accessible buttons and aria-pressed */}
      <div
        role="toolbar"
        aria-label="Filter feedback by customer sentiment"
        className="flex flex-wrap items-center gap-2 border-b border-border/50 bg-muted/10 px-4 py-2.5"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
          Filter:
        </span>
        <Button
          type="button"
          size="sm"
          variant={filterSentiment === "all" ? "default" : "outline"}
          aria-pressed={filterSentiment === "all"}
          onClick={() => setFilterSentiment("all")}
          className="h-7 px-3 text-xs"
        >
          <MessageCircle className="mr-1.5 size-3" /> All
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filterSentiment === "positive" ? "default" : "outline"}
          aria-pressed={filterSentiment === "positive"}
          onClick={() => setFilterSentiment("positive")}
          className="h-7 px-3 text-xs"
        >
          <ThumbsUp className="mr-1.5 size-3" /> Positive
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filterSentiment === "negative" ? "default" : "outline"}
          aria-pressed={filterSentiment === "negative"}
          onClick={() => setFilterSentiment("negative")}
          className="h-7 px-3 text-xs"
        >
          <AlertCircle className="mr-1.5 size-3" /> Needs Attention
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filterSentiment === "general" ? "default" : "outline"}
          aria-pressed={filterSentiment === "general"}
          onClick={() => setFilterSentiment("general")}
          className="h-7 px-3 text-xs"
        >
          <Star className="mr-1.5 size-3" /> General
        </Button>
      </div>

      <DataTable table={table} columnsLength={columns.length} />
    </div>
  )
}
