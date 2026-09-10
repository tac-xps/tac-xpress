import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
interface RegisterRow {
  id: string
  title: string
  detail?: string
  value?: string
  status: string
  href?: string
}
interface OverviewRegisterProps {
  title: string
  description: string
  href: string
  rows: RegisterRow[]
}
export function OverviewRegister({
  title,
  description,
  href,
  rows,
}: OverviewRegisterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="icon-sm">
            <Link href={href} aria-label={`Open ${title.toLowerCase()}`}>
              <ArrowUpRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        {rows.length ? (
          <ul>
            {rows.map((row) => {
              const content = (
                <>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {row.title}
                    </span>
                    {row.detail && (
                      <span className="mt-1 block truncate text-xs text-muted-foreground">
                        {row.detail}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1 text-sm tabular-nums">
                    {row.value}
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
                <li key={row.id} className="border-t px-5 py-3">
                  {row.href ? (
                    <Link
                      href={row.href}
                      className="flex items-start justify-between gap-3"
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
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No records yet</EmptyTitle>
              <EmptyDescription>
                New records will appear here as work is recorded.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
