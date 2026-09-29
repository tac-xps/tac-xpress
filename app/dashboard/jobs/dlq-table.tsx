"use client"

import { useState, useTransition } from "react"
import type { DLQItem } from "@/lib/db/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader as ColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { useDataTable } from "@/hooks/use-data-table"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { retryDlqItem, dismissDlqItem } from "@/app/actions/dlq-actions"
import { RefreshCw, Trash2, Code2, AlertCircle } from "lucide-react"

export function DlqTable({
  data,
  pageCount,
}: {
  data: DLQItem[]
  pageCount: number
}) {
  const [selectedPayload, setSelectedPayload] = useState<unknown | null>(null)
  const [activeDlqId, setActiveDlqId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleRetry = (id: string, actionName: string) => {
    setActiveDlqId(id)
    startTransition(async () => {
      try {
        const result = await retryDlqItem(id)
        if (result.success) {
          toast.success(result.message || `Successfully retried ${actionName}`)
        } else {
          toast.error(result.error || `Failed to retry ${actionName}`)
        }
      } catch (err: any) {
        toast.error(err?.message || "An unexpected error occurred during retry")
      } finally {
        setActiveDlqId(null)
      }
    })
  }

  const handleDismiss = (id: string) => {
    if (!confirm("Are you sure you want to dismiss this DLQ item without retrying?")) {
      return
    }
    setActiveDlqId(id)
    startTransition(async () => {
      try {
        const result = await dismissDlqItem(id)
        if (result.success) {
          toast.success("DLQ item dismissed.")
        } else {
          toast.error(result.error || "Failed to dismiss DLQ item.")
        }
      } catch (err: any) {
        toast.error(err?.message || "An unexpected error occurred.")
      } finally {
        setActiveDlqId(null)
      }
    })
  }

  const columns: ColumnDef<DLQItem>[] = [
    {
      accessorKey: "action",
      header: ({ column }) => <ColumnHeader column={column} title="Action" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {row.original.action}
          </Badge>
          {row.original.retryCount > 0 && (
            <Badge
              variant={row.original.retryCount >= 3 ? "destructive" : "secondary"}
              className="text-[10px] tabular-nums"
            >
              {row.original.retryCount} {row.original.retryCount === 1 ? "retry" : "retries"}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "payload",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Payload" />
      ),
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setSelectedPayload(row.original.payload)}
          className="group flex max-w-[220px] items-center gap-1.5 truncate rounded px-1.5 py-1 text-left font-mono text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Click to view full payload"
        >
          <Code2 className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
          <span className="truncate">
            {JSON.stringify(row.original.payload)}
          </span>
        </button>
      ),
    },
    {
      accessorKey: "error",
      header: ({ column }) => <ColumnHeader column={column} title="Error" />,
      cell: ({ row }) => (
        <div className="flex max-w-[320px] items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          <span className="truncate" title={row.original.error ?? ""}>
            {row.original.error || "Unknown error"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <ColumnHeader column={column} title="Created" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {format(new Date(row.original.createdAt), "PPp")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="text-xs font-medium">Actions</span>,
      cell: ({ row }) => {
        const isCurrentPending = isPending && activeDlqId === row.original.id
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 text-xs"
              disabled={isPending}
              onClick={() => handleRetry(row.original.id, row.original.action)}
            >
              <RefreshCw
                className={`size-3.5 ${isCurrentPending ? "animate-spin" : ""}`}
              />
              <span>{isCurrentPending ? "Retrying..." : "Retry"}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
              disabled={isPending}
              onClick={() => handleDismiss(row.original.id)}
              title="Dismiss DLQ entry"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )
      },
    },
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
    <>
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dead Letter Queue</CardTitle>
              <CardDescription>
                Exhausted retries and unprocessable asynchronous actions awaiting operator review.
              </CardDescription>
            </div>
            {data.length > 0 && (
              <Badge variant="destructive" className="tabular-nums">
                {data.length} pending intervention
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <DataTable table={table} columnsLength={columns.length} />
        </CardContent>
      </Card>

      <Dialog
        open={selectedPayload !== null}
        onOpenChange={(open) => !open && setSelectedPayload(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Dead Letter Payload</DialogTitle>
            <DialogDescription>
              Inspection of the serialized event data that encountered unrecoverable errors.
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-[350px] overflow-auto rounded-md bg-muted p-4 font-mono text-xs text-foreground">
            {JSON.stringify(selectedPayload, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  )
}
