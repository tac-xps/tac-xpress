"use server"

import * as Sentry from "@sentry/nextjs"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { verifyPortalSession } from "@/app/actions/portal-auth"
import { writeAuditLog } from "@/lib/audit"

const PAGE_SIZE = 25

export async function getPortalShipments(page = 0) {
  try {
    const session = await verifyPortalSession()
    if (!session) return { success: false, error: "Unauthorized" }

    const offset = page * PAGE_SIZE

    const { data, error, count } = await supabaseAdmin
      .from("shipments")
      .select(
        "id, awb_number, status, origin, destination, service_type, weight_kg, created_at, edd, customer_name",
        { count: "exact" }
      )
      .eq("customer_email", session.email)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) {
      console.error("[getPortalShipments]", error)
      return { success: false, error: "Failed to load shipments" }
    }

    // Audit log (fire-and-forget)
    writeAuditLog({ userEmail: session.email, action: "shipment_view" })

    return {
      success: true,
      data: {
        shipments: data ?? [],
        total: count ?? 0,
        page,
        pageSize: PAGE_SIZE,
        hasMore: (count ?? 0) > offset + PAGE_SIZE,
      },
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "portal_shipments" },
      extra: { page },
    })
    return { success: false, error: "Failed to load shipments" }
  }
}
