"use server"

import { logAudit } from "@/lib/audit"
import { supabaseAdmin } from "@/lib/supabase/clients"

export async function applySLA(
  ticketId: string,
  priority: string,
  category?: string
) {
  // Find matching policy (exact category match first, then priority-only fallback)
  const { data: policy } = await supabaseAdmin
    .from("sla_policies")
    .select("*")
    .eq("priority", priority)
    .eq("is_active", true)
    .or(`category.eq.${category},category.is.null`)
    .order("category", { ascending: false }) // Non-null category first
    .limit(1)
    .single()

  if (!policy) {
    console.warn(
      `No SLA policy found for priority=${priority}, category=${category}`
    )
    return
  }

  const now = new Date()
  const firstResponseMs = policy.first_response_minutes * 60000
  const resolutionMs = policy.resolution_minutes * 60000

  const firstResponseDeadline = new Date(now.getTime() + firstResponseMs)
  const resolutionDeadline = new Date(now.getTime() + resolutionMs)
  const updatePayload = {
    sla_deadline_first_response: firstResponseDeadline.toISOString(),
    sla_deadline_resolution: resolutionDeadline.toISOString(),
    assigned_team: policy.category || "general_queue",
  }

  const { error } = await supabaseAdmin
    .from("tickets")
    .update(updatePayload)
    .eq("id", ticketId)

  if (error) throw error

  await logAudit({
    action: "sla_applied",
    entity: "tickets",
    entityId: ticketId,
    userEmail: "sla-engine@system",
    after: updatePayload,
    metadata: {
      priority,
      category: category ?? null,
      policy_id: policy.id,
    },
  })
}
