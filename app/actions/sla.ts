import "server-only"

import { logAudit } from "@/lib/audit"
import { supabaseAdmin } from "@/lib/supabase/clients"

export async function applySLA(
  ticketId: string,
  priority: string,
  category?: string
) {
  // Find matching policy (exact category match first, then priority-only fallback)
  const { data: policy, error: policyError } = await supabaseAdmin
    .from("sla_policies")
    .select("*")
    .eq("priority", priority)
    .eq("is_active", true)
    .or(`category.eq.${category},category.is.null`)
    .order("category", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle()

  if (policyError) throw policyError

  if (!policy) {
    console.warn(
      `No SLA policy found for priority=${priority}, category=${category}`
    )
    return
  }

  const { data: ticket, error: ticketError } = await supabaseAdmin
    .from("tickets")
    .select("created_at")
    .eq("id", ticketId)
    .single()
  if (ticketError || !ticket)
    throw ticketError || new Error("Ticket unavailable.")
  // Retrying triage must not postpone the customer's response deadline.
  const now = new Date(ticket.created_at)
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
