import type { Metadata } from "next"
import { DeliveryHistory } from "@/components/operations/delivery-history"
import Link from "next/link"
import { and, desc, eq, sql } from "drizzle-orm"
import { requireStaffPage } from "@/lib/auth/page-access"

export const metadata: Metadata = {
  title: "Communications Hub | TAC-XPRESS",
  description: "Outbound notifications, delivery history, WhatsApp delivery receipts, and email logs.",
}
import { db } from "@/lib/db"
import { messageOutbound, backgroundJobs, deadLetterQueue, emailNotifications } from "@/lib/db/schema"
import { PageHeader } from "@/components/operations/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  const [messages, jobResult, emails, dlqResult] = await Promise.all([
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
      // shortcut: 50 recent outbound messages queried for fast staff review. Fix condition: daily outbound message volume exceeds 500/day.
      .limit(50),
    db
      .select({
        status: backgroundJobs.status,
        count: sql<number>`count(*)::int`,
      })
      .from(backgroundJobs)
      .groupBy(backgroundJobs.status),
    db
      .select({
        id: emailNotifications.id,
        template_name: emailNotifications.templateName,
        status: emailNotifications.status,
        sent_at: emailNotifications.sentAt,
      })
      .from(emailNotifications)
      .orderBy(desc(emailNotifications.sentAt), desc(emailNotifications.id))
      .limit(10),
    db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(deadLetterQueue),
  ])
  const dlqCount = dlqResult[0]?.count ?? 0
  const pending = jobResult
    .filter((job) => job.status === "pending" || job.status === "processing")
    .reduce((sum, job) => sum + job.count, 0)
  const emailsFailed = emails.filter((email) => email.status === "failed").length
  const failed = jobResult.find((job) => job.status === "failed")?.count ?? 0
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
          <CardHeader>
            <CardTitle>Dead letter queue</CardTitle>
            <CardDescription>
              Exhausted retries and unhandled events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl tabular-nums ${dlqCount > 0 ? "text-destructive" : ""}`}>{dlqCount}</span>
              <span className="text-xs text-muted-foreground">items awaiting recovery</span>
            </div>
            <div className="mt-4">
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href="/dashboard/jobs">Review queue</Link>
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
              <>
                <dl className="flex gap-8">
                  <div>
                    <dt className="text-sm text-muted-foreground">Accepted</dt>
                    <dd className="mt-2 text-2xl tabular-nums">{emails.length - emailsFailed}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Failed</dt>
                    <dd className={`mt-2 text-2xl tabular-nums ${emailsFailed > 0 ? "text-destructive" : ""}`}>
                      {emailsFailed}
                    </dd>
                  </div>
                </dl>
                <ul className="mt-4 flex flex-col gap-2 border-t pt-4">
                  {emails.slice(0, 3).map((email) => (
                    <li
                      key={email.id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="capitalize">{email.template_name.replaceAll("_", " ")}</span>
                      <span
                        className={`text-xs ${email.status === "failed" ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        {email.status === "failed" ? "Failed" : "Accepted"}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
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
