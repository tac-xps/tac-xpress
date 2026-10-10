import { RecentActivityRegister } from "./recent-activity-register"
import Link from "next/link"
import {
  ArrowUpRight,
  ClipboardList,
  MapPin,
  ReceiptText,
  MessageSquare,
  ChartNoAxesCombined,
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
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: ChartNoAxesCombined,
    },
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
            <dd className="my-3 font-metric-lg text-foreground">{value}</dd>
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
      <RecentActivityRegister snapshot={snapshot} />
    </>
  )
}
