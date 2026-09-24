import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { feedback } from "@/lib/db/schema"
import { desc, ilike, or, sql } from "drizzle-orm"
import { FeedbackClientTable } from "./feedback-client-table"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import {
  DEFAULT_PAGE_SIZE,
  parsePage,
} from "@/components/ui/page-navigation"
import { containsPattern, firstParam, type RecordSearchParams } from "@/lib/table-query"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Feedback",
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<RecordSearchParams>
}) {
  await requireStaffPage()

  const params = await searchParams
  const page = parsePage(params.page)
  const q = firstParam(params.q).trim().slice(0, 100)
  const pattern = containsPattern(q)

  const feedbackRows = await db.query.feedback.findMany({
    where: q
      ? or(
          ilike(feedback.name, pattern),
          ilike(feedback.email, pattern),
          ilike(feedback.message, pattern)
        )
      : undefined,
    orderBy: [desc(feedback.createdAt)],
    limit: DEFAULT_PAGE_SIZE,
    offset: (page - 1) * DEFAULT_PAGE_SIZE,
  })

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(feedback)
    .where(
      q
        ? or(
            ilike(feedback.name, pattern),
            ilike(feedback.email, pattern),
            ilike(feedback.message, pattern)
          )
        : undefined
    )
  const totalCount = Number(countResult[0].count)
  const pageCount = Math.ceil(totalCount / DEFAULT_PAGE_SIZE)

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
        description="Review feedback and messages submitted by customers."
      />
      
      <div className="rounded-none border bg-card">
        <TableToolbar
          pathname="/dashboard/feedback"
          query={q}
          placeholder="Search by name, email, or message..."
        />
        <FeedbackClientTable
          data={formattedData}
          pageCount={pageCount}
        />
      </div>
    </div>
  )
}
