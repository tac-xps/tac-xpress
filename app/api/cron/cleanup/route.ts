import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import {
  authTokenConsumptions,
  backgroundJobs,
  deadLetterQueue,
  userMfa,
} from "@/lib/db/schema"
import { sql, lt, and, eq } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"

export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()

    // 1. Prune expired single-use MFA / WebAuthn tokens
    const deletedTokens = await db
      .delete(authTokenConsumptions)
      .where(lt(authTokenConsumptions.expiresAt, now))
      .returning({ jti: authTokenConsumptions.jti })

    // 2. Prune completed background jobs older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const deletedJobs = await db
      .delete(backgroundJobs)
      .where(
        and(
          eq(backgroundJobs.status, "completed"),
          lt(backgroundJobs.completedAt, sevenDaysAgo)
        )
      )
      .returning({ id: backgroundJobs.id })

    // 3. Prune dead letter queue items older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const deletedDlq = await db
      .delete(deadLetterQueue)
      .where(lt(deadLetterQueue.createdAt, thirtyDaysAgo))
      .returning({ id: deadLetterQueue.id })

    // 4. Auto-unlock expired user MFA lockouts
    const unlockedMfa = await db
      .update(userMfa)
      .set({
        failedAttempts: 0,
        lockedUntil: null,
      })
      .where(
        and(
          sql`${userMfa.lockedUntil} IS NOT NULL`,
          lt(userMfa.lockedUntil, now)
        )
      )
      .returning({ userId: userMfa.userId })

    return NextResponse.json(
      {
        success: true,
        prunedTokens: deletedTokens.length,
        prunedJobs: deletedJobs.length,
        prunedDlq: deletedDlq.length,
        unlockedMfa: unlockedMfa.length,
        timestamp: now.toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "cleanup_cron" } })
    return NextResponse.json(
      { error: "Cleanup routine failed" },
      { status: 500 }
    )
  }
}
