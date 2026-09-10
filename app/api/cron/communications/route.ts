import { NextResponse } from "next/server"
import { processBackgroundJobs } from "@/lib/jobs/worker"
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
    return NextResponse.json(await processBackgroundJobs(), {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "communications_cron" } })
    return NextResponse.json({ error: "Worker unavailable" }, { status: 503 })
  }
}
