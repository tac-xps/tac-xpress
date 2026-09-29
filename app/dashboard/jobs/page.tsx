import { requireAdminPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { backgroundJobs, deadLetterQueue } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { PageHeader } from "@/components/operations/page-header"
import { FailedJobsTable } from "./failed-jobs-table"
import { DlqTable } from "./dlq-table"
import { parseRecordQuery, type RecordSearchParams } from "@/lib/table-query"

export default async function JobsPage({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  await requireAdminPage()

  const params = await searchParams
  const { page, pageSize } = parseRecordQuery(params, [])

  const [failedJobs, dlqItems, failedJobsCountRes, dlqItemsCountRes] = await Promise.all([
    db.select().from(backgroundJobs).where(eq(backgroundJobs.status, 'failed')).orderBy(desc(backgroundJobs.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
    db.select().from(deadLetterQueue).orderBy(desc(deadLetterQueue.createdAt)).limit(pageSize).offset((page - 1) * pageSize),
    db.select({ count: sql<number>`count(*)` }).from(backgroundJobs).where(eq(backgroundJobs.status, 'failed')),
    db.select({ count: sql<number>`count(*)` }).from(deadLetterQueue)
  ])

  const failedJobsPageCount = Math.ceil(Number(failedJobsCountRes[0].count) / pageSize)
  const dlqItemsPageCount = Math.ceil(Number(dlqItemsCountRes[0].count) / pageSize)

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader 
        title="Background Jobs & DLQ" 
        description="Monitor failed background jobs and dead letter queue items."
      />

      <div className="grid gap-6">
        <FailedJobsTable data={failedJobs} pageCount={failedJobsPageCount} />
        <DlqTable data={dlqItems} pageCount={dlqItemsPageCount} />
      </div>
    </div>
  )
}
