import { OverviewRegister } from "./overview-register"
import Link from "next/link"
import {
  ArrowUpRight,
  ClipboardList,
  MapPin,
  ReceiptText,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ControlCenterSnapshot } from "@/lib/control-center"
import { formatInvoiceCurrency } from "@/app/dashboard/invoices/invoice-types"

export function ControlCenterActions() {
  const links = [
    {
      label: "Book & invoice",
      href: "/dashboard/invoices/create",
      icon: ReceiptText,
    },
    {
      label: "Build a manifest",
      href: "/dashboard/manifests",
      icon: ClipboardList,
    },
    { label: "Scan & update", href: "/dashboard/tracking", icon: MapPin },
    {
      label: "Messages & delivery",
      href: "/dashboard/communications",
      icon: MessageSquare,
    },
  ]
  return (
    <nav aria-label="Common operational tasks" className="flex flex-wrap gap-2">
      {links.map(({ label, href, icon: Icon }) => (
        <Button key={href} asChild variant="outline" size="sm">
          <Link href={href}>
            <Icon data-icon="inline-start" />
            {label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}

export function ControlCenterPanels({
  snapshot,
}: {
  snapshot: ControlCenterSnapshot
}) {
  return (
    <>
      <dl className="grid divide-y border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          [
            "Outstanding invoices",
            formatInvoiceCurrency(snapshot.outstanding),
            "Unpaid balances across all invoices",
            "/dashboard/invoices?status=unpaid",
          ],
          [
            "Tracking to publish",
            snapshot.unpublished.toLocaleString("en-IN"),
            "Shipments without a public event",
            "/dashboard/tracking",
          ],
          [
            "WhatsApp to review",
            snapshot.failedMessages.toLocaleString("en-IN"),
            "Failed attempts across delivery history",
            "/dashboard/communications?status=failed",
          ],
        ].map(([label, value, detail, href]) => (
          <div key={label} className="min-w-0 p-5">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="my-3 text-2xl font-medium tabular-nums">{value}</dd>
            <dd>
              <Link
                href={href}
                className="flex items-center justify-between gap-3 text-xs text-muted-foreground hover:text-foreground"
              >
                {detail}
                <ArrowUpRight className="size-4 shrink-0" />
              </Link>
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <OverviewRegister
          title="Recent invoices"
          description="Latest five billing records"
          href="/dashboard/invoices"
          rows={snapshot.recentInvoices.map((invoice) => ({
            id: invoice.id,
            title: invoice.shipment?.consignorName || "Billing record",
            detail: invoice.shipment?.awbNumber || invoice.id.slice(0, 8),
            value: formatInvoiceCurrency(invoice.amount),
            status: invoice.status,
            href:
              invoice.status === "void"
                ? "/dashboard/invoices?q=" + invoice.id
                : "/invoice/" + invoice.id,
          }))}
        />
        <OverviewRegister
          title="Website enquiries"
          description="Latest five contact requests"
          href="/dashboard/messages"
          rows={snapshot.recentContacts.map((ticket) => ({
            id: ticket.id,
            title: ticket.subject,
            detail: ticket.customerName || "Website enquiry",
            status: ticket.status,
            href: "/dashboard/messages?q=" + encodeURIComponent(ticket.subject),
          }))}
        />
        <OverviewRegister
          title="WhatsApp delivery"
          description="Provider updates, latest five attempts"
          href="/dashboard/communications"
          rows={snapshot.recentMessages.map((message) => ({
            id: message.id,
            title:
              message.relatedAwb ||
              (message.relatedInvoiceId
                ? "INV-" + message.relatedInvoiceId.slice(0, 8)
                : "Support message"),
            status: message.status,
          }))}
        />
      </div>
    </>
  )
}
