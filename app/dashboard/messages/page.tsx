import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { messageOutbound, tickets as ticketsTable } from "@/lib/db/schema"
import { and, desc, eq, ilike, or } from "drizzle-orm"
import { TicketsClient } from "./tickets-client"
import { OutboundMessageLog } from "./outbound-message-log"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { PageNavigation, parsePage, DEFAULT_PAGE_SIZE } from "@/components/ui/page-navigation"
import { containsPattern, parseRecordQuery, recordOrder, type RecordSearchParams } from "@/lib/table-query"
import { CreateTicketDialog } from "./create-ticket-dialog"
const statuses = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "awaiting_customer", label: "Awaiting customer" },
]
export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<RecordSearchParams>
}) {
  await requireStaffPage()
  const params = await searchParams
  const page = parsePage(params.page)
  const query = parseRecordQuery(
    params,
    ["created_at", "customer_name"],
    "created_at"
  )
  if (!statuses.some(({ value }) => value === query.status))
    query.status = "all"
  const pattern = containsPattern(query.q)
  const [rows, outboundMessages] = await Promise.all([
    db
      .select()
      .from(ticketsTable)
      .where(
        and(
          query.q
            ? or(
                ilike(ticketsTable.subject, pattern),
                ilike(ticketsTable.customerName, pattern),
                ilike(ticketsTable.customerEmail, pattern),
                ilike(ticketsTable.guestEmail, pattern),
                ilike(ticketsTable.relatedAwb, pattern),
                ilike(ticketsTable.awbNumber, pattern)
              )
            : undefined,
          query.status !== "all"
            ? eq(
                ticketsTable.status,
                query.status as
                  | "open"
                  | "in_progress"
                  | "resolved"
                  | "awaiting_customer"
              )
            : undefined
        )
      )
      .orderBy(
        recordOrder(
          query.sort === "customer_name"
            ? ticketsTable.customerName
            : ticketsTable.createdAt,
          query.order
        ),
        desc(ticketsTable.id)
      )
      .limit(DEFAULT_PAGE_SIZE + 1)
      .offset((page - 1) * DEFAULT_PAGE_SIZE),
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
      .orderBy(desc(messageOutbound.createdAt), desc(messageOutbound.id))
      .limit(25),
  ])
  const tickets = rows
    .slice(0, DEFAULT_PAGE_SIZE)
    .map((ticket) => ({
      id: ticket.id,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail || ticket.guestEmail,
      customer_phone: ticket.customerPhone,
      subject: ticket.subject,
      message: ticket.message || ticket.description || "",
      category: ticket.category || "General",
      status: ticket.status,
      priority: ticket.priority || "medium",
      assigned_to: ticket.assignedTo,
      related_awb: ticket.relatedAwb || ticket.awbNumber,
      created_at: ticket.createdAt.toISOString(),
    }))
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Support & communications"
        description="Review customer requests, reply by email and follow recorded delivery attempts."
      >
        <CreateTicketDialog />
      </PageHeader>
      <section
        aria-label="Support requests"
        className="min-w-0 overflow-hidden rounded-none border bg-card"
      >
        <TableToolbar
          pathname="/dashboard/messages"
          query={query.q}
          status={query.status}
          statuses={statuses}
          sort={query.sort}
          order={query.order}
          placeholder="Subject, contact or AWB"
        />
        <TicketsClient
          initialTickets={tickets}
          sort={query.sort}
          order={query.order}
        />
        <PageNavigation
          page={page}
          hasNext={rows.length > DEFAULT_PAGE_SIZE}
          pathname="/dashboard/messages"
          query={query}
        />
      </section>
      <section aria-label="Latest outbound messages" className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Latest 25 outbound delivery attempts. Provider status may arrive after
          sending.
        </p>
        <OutboundMessageLog messages={outboundMessages} />
      </section>
    </div>
  )
}
