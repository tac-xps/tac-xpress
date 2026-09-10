import "server-only"
import { sql, type SQL } from "drizzle-orm"
import { db } from "@/lib/db"

export type JobKind = "support_email" | "support_triage"
export interface BackgroundJob {
  id: string
  kind: JobKind
  dedupe_key: string
  payload: { ticketId: string }
  attempts: number
  lease_token: string
  created_at: Date
}
export function queryRows<T>(result: unknown): T[] {
  return (
    Array.isArray(result) ? result : (result as { rows: T[] }).rows
  ) as T[]
}
export async function enqueueTicketJobs(
  tx: { execute: (statement: SQL) => Promise<unknown> },
  ticketId: string
) {
  for (const kind of ["support_email", "support_triage"] as const) {
    await tx.execute(
      sql`insert into background_jobs (kind, dedupe_key, payload) values (${kind}, ${ticketId}, ${JSON.stringify({ ticketId })}::jsonb) on conflict (kind, dedupe_key) do nothing`
    )
  }
}
export async function claimJob(ticketId?: string) {
  await db.execute(
    sql`update background_jobs set status = 'failed', last_error = 'Worker lease expired after final attempt', locked_until = null, lease_token = null where status = 'processing' and locked_until < now() and attempts >= 5`
  )
  const token = crypto.randomUUID()
  const result = await db.execute(sql`
    with candidate as (
      select id from background_jobs
      where attempts < 5 and (status = 'pending' or (status = 'processing' and locked_until < now()))
        and available_at <= now() ${ticketId ? sql`and dedupe_key = ${ticketId}` : sql``}
      order by created_at, id for update skip locked limit 1
    )
    update background_jobs j set status = 'processing', attempts = attempts + 1,
      locked_until = now() + interval '5 minutes', lease_token = ${token}::uuid
    from candidate where j.id = candidate.id returning j.*`)
  return queryRows<BackgroundJob>(result)[0] ?? null
}
export async function finishJob(
  job: BackgroundJob,
  success: boolean,
  error?: string
) {
  await db.execute(sql`update background_jobs set status = ${success ? "completed" : job.attempts >= 5 ? "failed" : "pending"},
    completed_at = ${success ? new Date().toISOString() : null}::timestamptz, locked_until = null, lease_token = null,
    last_error = ${error?.slice(0, 500) ?? null}, available_at = now() + (${Math.min(60 * 2 ** job.attempts, 3600)} * interval '1 second')
    where id = ${job.id}::uuid and lease_token = ${job.lease_token}::uuid`)
}
