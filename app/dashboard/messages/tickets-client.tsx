"use client" // force ts refresh

import { useState, useEffect, useMemo } from "react"
import { supabaseBrowser } from "@/lib/supabase/clients"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TicketDetailsDialog } from "@/app/dashboard/messages/ticket-details-dialog"
import { DataTable } from "./data-table"
import { getColumns, type TicketData } from "./columns"

export function TicketsClient({
  initialTickets,
}: {
  initialTickets: TicketData[]
}) {
  const [tickets, setTickets] = useState<TicketData[]>(initialTickets)
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null)

  useEffect(() => {
    setTickets(initialTickets)
  }, [initialTickets])

  useEffect(() => {
    const supabase = supabaseBrowser()

    // Subscribe to new tickets being inserted
    const channel = supabase
      .channel("realtime_tickets")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tickets" },
        (payload: any) => {
          console.log("New ticket received in real-time!", payload.new)
          setTickets((current) => [payload.new as TicketData, ...current])
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tickets" },
        (payload: any) => {
          console.log("Ticket updated in real-time!", payload.new)
          setTickets((current) =>
            current.map((t) =>
              t.id === payload.new.id ? (payload.new as TicketData) : t
            )
          )
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "tickets" },
        (payload: any) => {
          console.log("Ticket deleted in real-time!", payload.old)
          setTickets((current) =>
            current.filter((t) => t.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const columns = useMemo(() => getColumns(setSelectedTicket), [])

  return (
    <>
      <Card className="overflow-hidden delay-0">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 p-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Recent Inquiries
          </CardTitle>
          <Badge variant="outline">
            {tickets.filter((t) => t.status === "open").length} Open
          </Badge>
        </CardHeader>
        <CardContent className="p-4">
          <DataTable columns={columns} data={tickets} />
        </CardContent>
      </Card>

      <TicketDetailsDialog
        ticket={selectedTicket}
        open={!!selectedTicket}
        onOpenChange={(isOpen: boolean) => !isOpen && setSelectedTicket(null)}
      />
    </>
  )
}
