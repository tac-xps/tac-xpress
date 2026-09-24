"use client"
import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { useDataTable } from "@/hooks/use-data-table"
import { TicketDetailsDialog } from "./ticket-details-dialog"
import { getColumns, type TicketData } from "./columns"
export function TicketsClient({
  initialTickets,
  pageCount,
}: {
  initialTickets: TicketData[]
  pageCount: number
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const columns = useMemo(
    () => getColumns((ticket) => setSelected(ticket.id)),
    []
  )
  const { table } = useDataTable({
    data: initialTickets,
    columns,
    pageCount,
  })
  const ticket = initialTickets.find((item) => item.id === selected) ?? null
  useEffect(() => {
    const refresh = () => {
      if (!document.hidden) router.refresh()
    }
    window.addEventListener("focus", refresh)
    return () => window.removeEventListener("focus", refresh)
  }, [router])
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <p className="text-sm text-muted-foreground">
          Refreshes when you return to this window.
        </p>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => startTransition(() => router.refresh())}
        >
          <RefreshCw className={pending ? "animate-spin" : ""} />
          {pending ? "Refreshing…" : "Refresh"}
        </Button>
      </div>
      <DataTable
        table={table}
        columnsLength={columns.length}
      />
      {ticket && (
        <TicketDetailsDialog
          key={ticket.id}
          ticket={ticket}
          open
          onOpenChange={(open) => {
            if (!open) {
              setSelected(null)
              router.refresh()
            }
          }}
        />
      )}
    </>
  )
}
