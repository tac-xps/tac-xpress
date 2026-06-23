"use server"

import { logAudit } from "@/lib/audit"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { requireDashboardSession } from "@/lib/auth/guards"

export async function getPendingNotifications() {
  await requireDashboardSession()

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("*, tickets(subject, priority, sla_breach_type)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function markNotificationSent(id: string) {
  const session = await requireDashboardSession()
  const updatePayload = {
    status: "sent" as const,
    sent_at: new Date().toISOString(),
  }

  const { error } = await supabaseAdmin
    .from("notifications")
    .update(updatePayload)
    .eq("id", id)

  if (error) throw error

  await logAudit({
    action: "update",
    entity: "notifications",
    entityId: id,
    userId: session.user.id,
    userEmail: session.user.email ?? null,
    after: updatePayload,
  })
}

export async function getUnreadCount() {
  await requireDashboardSession()

  const { count, error } = await supabaseAdmin
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  if (error) throw error
  return count || 0
}
