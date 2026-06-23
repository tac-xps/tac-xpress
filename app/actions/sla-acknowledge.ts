"use server"

import { supabaseAdmin } from "@/lib/supabase/clients"
import { requireDashboardSession } from "@/lib/auth/guards"
import * as Sentry from "@sentry/nextjs"
import { logAudit } from "@/lib/audit"

export async function acknowledgeShipmentRisk(
  awbNumber: string,
  userId?: string
) {
  const session = await requireDashboardSession()
  const updatePayload = {
    sla_risk_acknowledged: true,
    sla_risk_acknowledged_at: new Date().toISOString(),
    sla_risk_acknowledged_by: userId || session.user.id,
  }

  const { data, error } = await supabaseAdmin
    .from("shipments")
    .update(updatePayload)
    .eq("awb_number", awbNumber)
    .select("id")
    .single()

  if (error) {
    Sentry.captureException(error)
    console.error("Failed to acknowledge SLA risk", error)
    return { success: false, error }
  }

  await logAudit({
    action: "sla_acknowledged",
    entity: "shipments",
    entityId: data.id,
    userId: session.user.id,
    userEmail: session.user.email ?? null,
    after: {
      awb_number: awbNumber,
      ...updatePayload,
    },
  })

  return { success: true, id: data.id }
}
