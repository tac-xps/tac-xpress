import Link from "next/link"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type WorkQueueCounts = {
  pending: number
  drafts: number
  overdue: number
  support: number
}

export function WorkQueue({ counts }: { counts: WorkQueueCounts }) {
  const totalPending =
    counts.pending + counts.drafts + counts.overdue + counts.support

  const items = [
    {
      title: "Pending shipments",
      count: counts.pending,
      href: "/dashboard/shipments?status=pending",
      detail: "Review readiness and assignment",
    },
    {
      title: "Draft manifests",
      count: counts.drafts,
      href: "/dashboard/manifests?status=draft",
      detail: "Confirm the load before finalizing",
    },
    {
      title: "Overdue invoices",
      count: counts.overdue,
      href: "/dashboard/invoices?status=overdue",
      detail: "Follow up on outstanding payment",
    },
    {
      title: "Open support work",
      count: counts.support,
      href: "/dashboard/messages",
      detail: "Review requests needing a response",
    },
  ]

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Work requiring attention</CardTitle>
            <CardDescription>Current queues across the operation</CardDescription>
          </div>
          {totalPending === 0 && (
            <span className="flex items-center gap-1.5 rounded-none border border-status-delivered/20 bg-status-delivered-wash px-2 py-0.5 text-micro font-medium text-status-delivered">
              <CheckCircle2 className="size-3" />
              All Clear
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {totalPending === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-none bg-status-delivered-wash text-status-delivered">
              <CheckCircle2 className="size-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              All Operational Queues Clear
            </h4>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              No pending consignments, drafts, overdue invoices, or open support tickets requiring urgent attention.
            </p>
          </div>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.title} className="border-t first:border-0">
                <Link
                  href={item.href}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted"
                >
                  <span
                    className={`w-10 shrink-0 text-2xl font-medium tabular-nums ${
                      item.count > 0 ? "text-foreground font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {item.count}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{item.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.detail}
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
