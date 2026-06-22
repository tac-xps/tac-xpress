import { NextResponse } from "next/server"
import type { Session } from "next-auth"
import { auth } from "@/auth"

export const DASHBOARD_ROLES = ["admin", "staff"] as const

type DashboardRole = (typeof DASHBOARD_ROLES)[number]

type AuthSession = Session | null

function getRole(session: AuthSession) {
  return session?.user?.role
}

function isAllowedRole(
  session: AuthSession,
  allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
) {
  const role = getRole(session)
  return Boolean(
    session?.user?.id && role && allowedRoles.includes(role as DashboardRole)
  )
}

export async function requireDashboardSession(
  allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  if (!isAllowedRole(session, allowedRoles)) {
    throw new Error("Forbidden")
  }

  return session
}

export async function requireDashboardAction(
  allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      ok: false as const,
      response: {
        success: false,
        error: "You must be signed in to perform this action.",
      },
    }
  }

  if (!isAllowedRole(session, allowedRoles)) {
    return {
      ok: false as const,
      response: {
        success: false,
        error: "You do not have permission to perform this action.",
      },
    }
  }

  return { ok: true as const, session }
}

export async function requireDashboardApi(
  allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  if (!isAllowedRole(session, allowedRoles)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { ok: true as const, session }
}
