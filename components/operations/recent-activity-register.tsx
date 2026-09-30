import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import type { ControlCenterSnapshot } from "@/lib/control-center"
import { formatInvoiceCurrency } from "@/app/dashboard/invoices/invoice-types"

interface ActivityRow {
  id: string
  title: string
  detail?: string
  value?: string
  status: string
  href?: string
}

function ActivityList({
  rows,
  viewAllHref,
  viewAllLabel,
}: {
  rows: ActivityRow[]
  viewAllHref: string
  viewAllLabel: string
}) {
  if (!rows.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No records yet</EmptyTitle>
          <EmptyDescription>
            New records will appear here as work is recorded.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div>
      <ul className="divide-y divide-border">
        {rows.map((row) => {
          const content = (
            <>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {row.title}
                </span>
                {row.detail && (
                  <span className="mt-0.5 block truncate font-mono text-xs text-muted-foreground">
                    {row.detail}
                  </span>
                )}
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1 text-sm tabular-nums">
                {row.value && (
                  <span className="font-mono text-sm font-medium">{row.value}</span>
                )}
                <Badge
                  variant={
                    row.status === "failed"
                      ? "destructive"
                      : ["paid", "delivered", "read"].includes(row.status)
                        ? "success"
                        : "outline"
                  }
                >
                  {row.status === "sent"
                    ? "Accepted"
                    : row.status.replaceAll("_", " ")}
                </Badge>
              </span>
            </>
          )

          return (
            <li key={row.id} className="px-5 py-3 hover:bg-muted/40 transition-colors">
              {row.href ? (
                <Link
                  href={row.href}
                  className="flex items-start justify-between gap-3 focus:outline-none focus-visible:underline"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <div className="border-t border-border px-5 py-2.5 bg-muted/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Showing latest {rows.length} records
        </span>
        <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          <Link href={viewAllHref}>
            <span>{viewAllLabel}</span>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function RecentActivityRegister({
  snapshot,
}: {
  snapshot: ControlCenterSnapshot
}) {
  const invoiceRows: ActivityRow[] = snapshot.recentInvoices.map((invoice) => ({
    id: invoice.id,
    title: invoice.shipment?.consignorName || "Billing record",
    detail: invoice.shipment?.awbNumber || invoice.id.slice(0, 8),
    value: formatInvoiceCurrency(invoice.amount),
    status: invoice.status,
    href:
      invoice.status === "void"
        ? "/dashboard/invoices?q=" + invoice.id
        : "/invoice/" + invoice.id,
  }))

  const contactRows: ActivityRow[] = snapshot.recentContacts.map((ticket) => ({
    id: ticket.id,
    title: ticket.subject,
    detail: ticket.customerName || "Website enquiry",
    status: ticket.status,
    href: "/dashboard/messages?q=" + encodeURIComponent(ticket.subject),
  }))

  const messageRows: ActivityRow[] = snapshot.recentMessages.map((message) => ({
    id: message.id,
    title:
      message.relatedAwb ||
      (message.relatedInvoiceId
        ? "INV-" + message.relatedInvoiceId.slice(0, 8)
        : "Support message"),
    status: message.status,
  }))

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Recent operational activity</CardTitle>
            <CardDescription>
              Live activity stream across billing, customer enquiries, and delivery notifications
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="invoices" className="w-full">
          <div className="border-b border-border px-5 pt-3">
            <TabsList variant="line" className="h-9">
              <TabsTrigger value="invoices" className="text-xs">
                Invoices ({invoiceRows.length})
              </TabsTrigger>
              <TabsTrigger value="enquiries" className="text-xs">
                Enquiries ({contactRows.length})
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs">
                WhatsApp ({messageRows.length})
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="invoices" className="mt-0">
            <ActivityList
              rows={invoiceRows}
              viewAllHref="/dashboard/invoices"
              viewAllLabel="Open invoices"
            />
          </TabsContent>
          <TabsContent value="enquiries" className="mt-0">
            <ActivityList
              rows={contactRows}
              viewAllHref="/dashboard/messages"
              viewAllLabel="Open messages"
            />
          </TabsContent>
          <TabsContent value="messages" className="mt-0">
            <ActivityList
              rows={messageRows}
              viewAllHref="/dashboard/communications"
              viewAllLabel="Open communications"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
