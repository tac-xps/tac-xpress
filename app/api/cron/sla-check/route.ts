import { supabaseAdmin } from "@/lib/supabase/clients"
import { NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"
import { logAuditInTransaction } from "@/lib/audit"
import { queryRows } from "@/lib/jobs/store"
import { z } from "zod"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const now = new Date().toISOString()
    const recipient = z
      .string()
      .email()
      .safeParse(
        process.env.OPS_NOTIFICATION_EMAIL?.trim() ||
          process.env.ADMIN_EMAIL?.trim()
      )
    if (
      !recipient.success ||
      /^(?:placeholder|dummy|your[-_]?email)@/i.test(recipient.data) ||
      (process.env.NODE_ENV === "production" &&
        /@(?:example\.(?:com|org|net)|[^@]*\.(?:invalid|test|example))$/i.test(
          recipient.data
        ))
    )
      throw new Error(
        "Configure a valid operator notification email before running SLA checks."
      )
    const opsEmail = recipient.data
    const firstResponse = await supabaseAdmin
      .from("tickets")
      .select("id, sla_deadline_first_response, priority, assigned_team")
      .is("first_reply_at", null)
      .lt("sla_deadline_first_response", now)
      .eq("sla_breached", false)
      .in("status", ["open", "in_progress"])
      .limit(100)
    if (firstResponse.error) throw firstResponse.error
    const resolution = await supabaseAdmin
      .from("tickets")
      .select("id, sla_deadline_resolution, priority, assigned_team")
      .lt("sla_deadline_resolution", now)
      .eq("sla_breached", false)
      .not("status", "in", '("resolved")')
      .limit(100)
    if (resolution.error) throw resolution.error
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const alertBefore = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    const atRisk = await supabaseAdmin
      .from("shipments")
      .select("id, awb_number, status, edd")
      .in("status", ["pending", "in-transit"])
      .is("deleted_at", null)
      .lt("edd", tomorrow)
      .gt("edd", now)
      .or(
        `sla_at_risk_alerted_at.is.null,sla_at_risk_alerted_at.lt.${alertBefore}`
      )
      .limit(100)
    if (atRisk.error) throw atRisk.error

    let firstResponseBreaches = 0
    let resolutionBreaches = 0
    let shipmentsAtRisk = 0
    for (const [type, candidates] of [
      ["first_response", firstResponse.data ?? []],
      ["resolution", resolution.data ?? []],
    ] as const) {
      for (const ticket of candidates) {
        const changed = await db.transaction(async (tx) => {
          const result = await tx.execute(sql`
            update tickets set sla_breached = true, sla_breach_type = ${type},
              sla_at_risk = false, sla_breach_processed_at = ${now}::timestamptz
            where id = ${ticket.id}::uuid and sla_breached = false
              and ${
                type === "first_response"
                  ? sql`first_reply_at is null and sla_deadline_first_response < ${now}::timestamptz and status in ('open', 'in_progress')`
                  : sql`status <> 'resolved' and sla_deadline_resolution < ${now}::timestamptz`
              }
            returning id`)
          if (!queryRows(result).length) return false
          const payload = {
            breach_type: type,
            priority: ticket.priority,
            assigned_team: ticket.assigned_team,
          }
          await tx.execute(sql`insert into notifications (ticket_id, recipient_email, type, payload)
            values (${ticket.id}::uuid, ${opsEmail}, 'sla_breached', ${JSON.stringify(payload)}::jsonb)`)
          await tx.execute(sql`insert into background_jobs (kind, dedupe_key, payload)
            values ('support_email', ${`sla-breach/${ticket.id}`}, ${JSON.stringify({ ticketId: ticket.id, notificationType: "sla_breach" })}::jsonb)
            on conflict (kind, dedupe_key) do nothing`)
          await logAuditInTransaction(tx, {
            action: "update",
            entity: "tickets",
            entityId: ticket.id,
            userEmail: "sla-cron@system",
            after: { sla_breached: true, sla_breach_type: type },
            metadata: payload,
          })
          return true
        })
        if (changed && type === "first_response") firstResponseBreaches++
        if (changed && type === "resolution") resolutionBreaches++
      }
    }
    for (const shipment of atRisk.data ?? []) {
      const changed = await db.transaction(async (tx) => {
        const result = await tx.execute(sql`
          update shipments set sla_at_risk = true, sla_at_risk_alerted_at = ${now}::timestamptz
          where id = ${shipment.id}::uuid and status in ('pending', 'in-transit') and deleted_at is null
            and edd > ${now}::timestamptz and edd < ${tomorrow}::timestamptz
            and (sla_at_risk_alerted_at is null or sla_at_risk_alerted_at < ${alertBefore}::timestamptz)
          returning id`)
        if (!queryRows(result).length) return false
        const payload = {
          awb: shipment.awb_number,
          edd: shipment.edd,
          status: shipment.status,
        }
        await tx.execute(sql`insert into notifications (recipient_email, type, payload)
          values (${opsEmail}, 'shipment_at_risk', ${JSON.stringify(payload)}::jsonb)`)
        await logAuditInTransaction(tx, {
          action: "update",
          entity: "shipments",
          entityId: shipment.id,
          userEmail: "sla-cron@system",
          after: { sla_at_risk: true, sla_at_risk_alerted_at: now },
          metadata: payload,
        })
        return true
      })
      if (changed) shipmentsAtRisk++
    }
    return NextResponse.json(
      {
        success: true,
        processed: firstResponseBreaches + resolutionBreaches + shipmentsAtRisk,
        first_response_breaches: firstResponseBreaches,
        resolution_breaches: resolutionBreaches,
        shipments_at_risk: shipmentsAtRisk,
        checked_at: now,
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "sla_cron" } })
    return NextResponse.json(
      { error: "SLA checks unavailable. Retry later." },
      { status: 503 }
    )
  }
}
