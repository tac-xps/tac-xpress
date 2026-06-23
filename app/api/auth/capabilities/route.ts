import { NextResponse } from "next/server"

import { requireDashboardApi } from "@/lib/auth/guards"

const ROLE_CAPABILITIES: Record<string, string[]> = {
  admin: [
    "org:admin",
    "org:manager",
    "warehouse:manager",
    "warehouse:operator",
    "shipment:owner",
    "org:member",
    "carrier:partner",
  ],
  staff: [
    "org:manager",
    "warehouse:manager",
    "warehouse:operator",
    "shipment:owner",
    "org:member",
  ],
}

export async function GET() {
  const authResult = await requireDashboardApi()
  if (!authResult.ok) return authResult.response

  const role = authResult.session.user.role
  return NextResponse.json({
    capabilities: ROLE_CAPABILITIES[role] ?? ["org:member"],
    token: null,
    orgId: authResult.session.user.org_id || "default-org",
    role,
  })
}
