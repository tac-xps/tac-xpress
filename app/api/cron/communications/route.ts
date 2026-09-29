import { NextResponse } from "next/server"
import { processBackgroundJobs } from "@/lib/jobs/worker"
import { db } from "@/lib/db"
import { deadLetterQueue } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"

export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const jobResults = await processBackgroundJobs()

    // DLQ Depth Monitoring (Phase 2.5): Alert when failed tasks accumulate
    const [{ count: dlqCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(deadLetterQueue)

    const DLQ_ALERT_THRESHOLD = Number(process.env.DLQ_ALERT_THRESHOLD) || 5
    if (dlqCount >= DLQ_ALERT_THRESHOLD) {
      Sentry.captureMessage(
        `Dead Letter Queue depth exceeded threshold: ${dlqCount} items pending operator intervention`,
        {
          level: "warning",
          tags: { area: "dlq_monitoring", severity: "high" },
          extra: { dlqCount, threshold: DLQ_ALERT_THRESHOLD },
        }
      )
    }

    return NextResponse.json(
      { ...jobResults, dlqDepth: dlqCount },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "communications_cron" } })
    return NextResponse.json({ error: "Worker unavailable" }, { status: 503 })
  }
}
