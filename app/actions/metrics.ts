"use server"

import { supabaseAdmin } from "@/lib/supabase/clients"
import { requireDashboardSession } from "@/lib/auth/guards"

export async function getSLABreachRate(days: number = 30) {
  await requireDashboardSession(["admin"])

  const { data, error } = await supabaseAdmin.rpc("get_sla_breach_rate", {
    days_back: days,
  })
  if (error) throw error
  return data
}

export async function getResolutionMetrics(days: number = 30) {
  await requireDashboardSession(["admin"])

  const { data, error } = await supabaseAdmin.rpc("get_resolution_metrics", {
    days_back: days,
  })
  if (error) throw error
  return data
}

export async function getDailyTicketVolume(days: number = 14) {
  await requireDashboardSession(["admin"])

  const { data, error } = await supabaseAdmin
    .from("tickets")
    .select("created_at")
    .gte("created_at", new Date(Date.now() - days * 86400000).toISOString())
    .order("created_at", { ascending: true })

  if (error) throw error

  // Group by date in-app or use a DB function
  const grouped = data.reduce((acc: Record<string, number>, row) => {
    const date = row.created_at.split("T")[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  return Object.entries(grouped).map(([date, count]) => ({ date, count }))
}
