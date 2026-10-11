import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { feedback } from "@/lib/db/schema"
import { and, ilike, or, sql, type SQL } from "drizzle-orm"
import { FeedbackClientTable } from "./feedback-client-table"
import { FeedbackMetrics } from "./feedback-metrics"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExternalLink, Sparkles } from "lucide-react"
import {
  containsPattern,
  parseRecordQuery,
  recordOrder,
  type RecordSearchParams,
} from "@/lib/table-query"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Customer Feedback",
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<RecordSearchParams>
}) {
  await requireStaffPage()

  const params = await searchParams
  const { page, pageSize, q, sort, order } = parseRecordQuery(
    params,
    ["name", "email", "createdAt"] as const,
    "createdAt"
  )
  const pattern = containsPattern(q)

  const rawSentiment = typeof (params as any).sentiment === "string" ? (params as any).sentiment : "all"
  const sentiment = ["positive", "negative", "general"].includes(rawSentiment)
    ? rawSentiment
    : "all"

  const negativeSql = sql`(${feedback.message} ~* '\\m(delay[[:alpha:]]*|damage[[:alpha:]]*|broken|lost|late|poor|terrible|worst)\\M')`
  const positiveSql = sql`(${feedback.message} ~* '\\m(great|fast|excellent|good|smooth|thank[[:alpha:]]*|awesome)\\M')`

  let sentimentCondition: SQL | undefined = undefined
  if (sentiment === "negative") {
    sentimentCondition = negativeSql
  } else if (sentiment === "positive") {
    sentimentCondition = sql`(${positiveSql} AND NOT (${negativeSql}))`
  } else if (sentiment === "general") {
    sentimentCondition = sql`(NOT (${positiveSql}) AND NOT (${negativeSql}))`
  }

  const searchCondition = q
    ? or(
        ilike(feedback.name, pattern),
        ilike(feedback.email, pattern),
        ilike(feedback.message, pattern)
      )
    : undefined

  const whereCondition =
    searchCondition && sentimentCondition
      ? and(searchCondition, sentimentCondition)
      : searchCondition || sentimentCondition

  const sortColumns = {
    name: feedback.name,
    email: feedback.email,
    createdAt: feedback.createdAt,
  }
  const sortColumn = sortColumns[sort as keyof typeof sortColumns] ?? feedback.createdAt

  // Fetch paginated feedback records and aggregate telemetry counts in parallel
  const [feedbackRows, countResult, totalAgg, positiveAgg, negativeAgg] = await Promise.all([
    db.query.feedback.findMany({
      where: whereCondition,
      orderBy: [recordOrder(sortColumn, order)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(feedback)
      .where(whereCondition),
    db.select({ count: sql<number>`count(*)` }).from(feedback),
    db
      .select({ count: sql<number>`count(*)` })
      .from(feedback)
      .where(sql`(${positiveSql} AND NOT (${negativeSql}))`),
    db.select({ count: sql<number>`count(*)` }).from(feedback).where(negativeSql),
  ])

  const totalCount = Number(countResult[0]?.count ?? 0)
  const pageCount = Math.ceil(totalCount / pageSize)

  const totalAll = Number(totalAgg[0]?.count ?? 0)
  const positiveAll = Number(positiveAgg[0]?.count ?? 0)
  const negativeAll = Number(negativeAgg[0]?.count ?? 0)
  const generalAll = Math.max(0, totalAll - positiveAll - negativeAll)

  const formattedData = feedbackRows.map((fb) => ({
    id: fb.id,
    name: fb.name,
    email: fb.email,
    message: fb.message,
    createdAt: fb.createdAt.toISOString(),
  }))

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Customer Feedback"
        description="Monitor real-time sentiment telemetry, inspect customer testimonials, and respond to operational friction."
      >
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 gap-1.5 text-xs font-mono"
        >
          <Link href="/feedback" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
            Public Form
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 gap-1.5 text-xs font-mono"
        >
          <Link href="/#feedback" target="_blank" rel="noopener noreferrer">
            <Sparkles className="size-3.5 text-primary" />
            Landing Section
          </Link>
        </Button>
      </PageHeader>

      {/* Aggregate Telemetry KPI Strip */}
      <FeedbackMetrics
        metrics={{
          total: totalAll,
          positive: positiveAll,
          negative: negativeAll,
          general: generalAll,
        }}
      />
      
      <div className="rounded-none border bg-card">
        <TableToolbar
          pathname="/dashboard/feedback"
          query={q}
          sort={sort}
          order={order}
          placeholder="Search by name, email, or message..."
        >
          {sentiment !== "all" && (
            <input type="hidden" name="sentiment" value={sentiment} />
          )}
        </TableToolbar>
        <FeedbackClientTable
          data={formattedData}
          pageCount={pageCount}
        />
      </div>
    </div>
  )
}

