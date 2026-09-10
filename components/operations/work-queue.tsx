import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
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
        <CardTitle>Work requiring attention</CardTitle>
        <CardDescription>Current queues across the operation</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <ul>
          {items.map((item) => (
            <li key={item.title} className="border-t first:border-0">
              <Link
                href={item.href}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted"
              >
                <span className="w-10 shrink-0 text-2xl font-medium tabular-nums">
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
      </CardContent>
    </Card>
  )
}
