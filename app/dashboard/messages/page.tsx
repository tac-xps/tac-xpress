import React from "react" // force ts refresh
import { supabaseAdmin } from "@/lib/supabase/clients"
import { TicketsClient } from "@/app/dashboard/messages/tickets-client"
import { SupportIcon } from "@/components/icons/sidebar-icons"
import { db } from "@/lib/db"
import { messageOutbound } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { OutboundMessageLog } from "./outbound-message-log"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export const dynamic = "force-dynamic"

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const offset = (page - 1) * DEFAULT_PAGE_SIZE
  const [{ data: ticketRows, error }, outboundRows] = await Promise.all([
    supabaseAdmin
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + DEFAULT_PAGE_SIZE),
    db
      .select({
        id: messageOutbound.id,
        phone: messageOutbound.phone,
        status: messageOutbound.status,
        templateName: messageOutbound.templateName,
        relatedAwb: messageOutbound.relatedAwb,
        createdAt: messageOutbound.createdAt,
      })
      .from(messageOutbound)
      .orderBy(desc(messageOutbound.createdAt))
      .limit(DEFAULT_PAGE_SIZE + 1)
      .offset(offset),
  ])
  const hasNext =
    (ticketRows?.length ?? 0) > DEFAULT_PAGE_SIZE ||
    outboundRows.length > DEFAULT_PAGE_SIZE
  const tickets = ticketRows?.slice(0, DEFAULT_PAGE_SIZE) ?? []
  const outboundMessages = outboundRows.slice(0, DEFAULT_PAGE_SIZE)

  if (error) {
    console.error("Error fetching tickets:", error)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 md:gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <SupportIcon className="size-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Support Tickets
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage customer inquiries and support requests in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <TicketsClient initialTickets={tickets || []} />
      </div>

      <OutboundMessageLog messages={outboundMessages} />
      <PageNavigation
        page={page}
        hasNext={hasNext}
        pathname="/dashboard/messages"
      />
    </div>
  )
}
