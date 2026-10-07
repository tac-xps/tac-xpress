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
    const jobResults = await processBackgroundJobs(25)

    // DLQ Depth Monitoring (Phase 2.5): Alert when failed tasks accumulate
    const [dlqRow] = await db
      .select({ count: sql<string>`count(*)` })
      .from(deadLetterQueue)

    const dlqCount = Number(dlqRow?.count ?? 0)
    const DLQ_ALERT_THRESHOLD = Number(process.env.DLQ_ALERT_THRESHOLD) || 5

    // Throttle Sentry warning: alert once per hour window or on critical depth
    const currentMinute = new Date().getMinutes()
    if (dlqCount >= DLQ_ALERT_THRESHOLD && currentMinute < 5) {
      Sentry.captureMessage(
        `Dead Letter Queue depth exceeded threshold: ${dlqCount} items pending operator intervention`,
        {
          level: "warning",
          tags: { area: "dlq_monitoring", severity: "high" },
          extra: { dlqCount, threshold: DLQ_ALERT_THRESHOLD },
          fingerprint: ["dlq_depth_alert", String(Math.floor(Date.now() / (3600 * 1000)))],
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
