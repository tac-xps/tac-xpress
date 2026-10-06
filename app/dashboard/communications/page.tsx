import { DeliveryHistory } from "@/components/operations/delivery-history"
import Link from "next/link"
import { and, desc, eq, sql } from "drizzle-orm"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { messageOutbound } from "@/lib/db/schema"
import { queryRows } from "@/lib/jobs/store"
import { PageHeader } from "@/components/operations/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
interface CommunicationParams {
  status?: string
}
export default async function CommunicationsPage({
  searchParams,
}: {
  searchParams: Promise<CommunicationParams>
}) {
  await requireStaffPage()
  const { status } = await searchParams
  const failedOnly = status === "failed"
  const [messages, jobResult, emailResult, dlqResult] = await Promise.all([
    db
      .select({
        id: messageOutbound.id,
        phone: messageOutbound.phone,
        body: messageOutbound.body,
        status: messageOutbound.status,
        templateName: messageOutbound.templateName,
        templateLanguage: messageOutbound.templateLanguage,
        relatedInvoiceId: messageOutbound.relatedInvoiceId,
        relatedAwb: messageOutbound.relatedAwb,
        failureReason: messageOutbound.failureReason,
        providerPayload: messageOutbound.providerPayload,
        createdAt: messageOutbound.createdAt,
      })
      .from(messageOutbound)
      .where(and(failedOnly ? eq(messageOutbound.status, "failed") : undefined))
      .orderBy(desc(messageOutbound.createdAt), desc(messageOutbound.id))
      .limit(50),
    db.execute(
      sql`select status, count(*)::int as count from background_jobs group by status`
    ),
    db.execute(
      sql`select id, template_name, status, sent_at from email_notifications order by sent_at desc, id desc limit 10`
    ),
    db.execute(
      sql`select count(*)::int as count from dead_letter_queue`
    ),
  ])
  const jobs = queryRows<{ status: string; count: number }>(jobResult)
  const emails = queryRows<{
    id: string
    template_name: string
    status: string
    sent_at: string
  }>(emailResult)
  const dlqCount = queryRows<{ count: number }>(dlqResult)[0]?.count ?? 0
  const pending = jobs
    .filter((job) => job.status === "pending" || job.status === "processing")
    .reduce((sum, job) => sum + job.count, 0)
  const failed = jobs.find((job) => job.status === "failed")?.count ?? 0
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Communications"
        description="Review provider acceptance, delivery receipts and background follow-ups."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/messages">Support inbox</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/invoices">Send an invoice</Link>
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Background follow-ups</CardTitle>
            <CardDescription>
              Saved contact requests retain work across server restarts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="flex gap-8">
              <div>
                <dt className="text-sm text-muted-foreground">
                  Pending / processing
                </dt>
                <dd className="mt-2 text-2xl tabular-nums">{pending}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Needs review
                </dt>
                <dd className="mt-2 text-2xl tabular-nums">{failed}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Failed or uncertain sends require review before another attempt.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Dead Letter Queue</CardTitle>
              <CardDescription>
                Exhausted retries and unhandled events.
              </CardDescription>
            </div>
            <Badge
              variant={dlqCount > 0 ? "destructive" : "outline"}
              className="tabular-nums"
            >
              {dlqCount > 0 ? `${dlqCount} issues` : "Clear"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums">{dlqCount}</span>
              <span className="text-xs text-muted-foreground">items awaiting recovery</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Failed asynchronous tasks, broken webhooks, or failed AI responder calls.
            </p>
            <div className="mt-4">
              <Button asChild size="sm" variant="outline" className="w-full text-xs">
                <Link href="/dashboard/jobs">Inspect & Retry DLQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent email attempts</CardTitle>
            <CardDescription>Latest ten provider responses</CardDescription>
          </CardHeader>
          <CardContent>
            {emails.length ? (
              <ul className="flex flex-col gap-2">
                {emails.map((email) => (
                  <li
                    key={email.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span>{email.template_name.replaceAll("_", " ")}</span>
                    <Badge
                      variant={
                        email.status === "failed" ? "destructive" : "outline"
                      }
                    >
                      {email.status === "sent" ? "Accepted" : "Failed"}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No email attempts recorded yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <DeliveryHistory messages={messages} failedOnly={failedOnly} />
    </div>
  )
}
