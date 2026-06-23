import * as Sentry from "@sentry/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { requireDashboardApi } from "@/lib/auth/guards"
import { getWhatsAppConfig } from "@/lib/whatsapp/config"

function isAuthorizedHealthCheck(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  return Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)
}

async function checkOpenRouter() {
  const apiKey = process.env.OPENROUTER_API?.trim()

  if (!apiKey) {
    return {
      status: "unconfigured",
    }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
      })

      return {
        status: response.ok ? "up" : "degraded",
        statusCode: response.status,
      }
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    Sentry.captureException(error)

    return {
      status: "degraded",
      error: "OpenRouter probe failed",
    }
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedHealthCheck(request)) {
    const authResult = await requireDashboardApi()
    if (!authResult.ok) return authResult.response
  }

  const healthChecks: {
    timestamp: string
    status: "ok" | "degraded"
    services: Record<string, unknown>
  } = {
    timestamp: new Date().toISOString(),
    status: "ok",
    services: {},
  }

  try {
    await db.execute(sql`select 1`)
    healthChecks.services.database = { status: "up" }
  } catch (error) {
    Sentry.captureException(error)
    healthChecks.status = "degraded"
    healthChecks.services.database = { status: "down" }
  }

  const openRouterStatus = await checkOpenRouter()
  healthChecks.services.openrouter = openRouterStatus
  if (openRouterStatus.status === "degraded") {
    healthChecks.status = "degraded"
  }

  const whatsappConfig = getWhatsAppConfig()
  const isWhatsAppConfigured =
    !!whatsappConfig.relayToken &&
    !!whatsappConfig.appSecret &&
    !!whatsappConfig.verifyToken

  healthChecks.services.whatsapp = {
    status: isWhatsAppConfigured ? "configured" : "unconfigured",
    enabled: whatsappConfig.enabled,
    relayBaseUrl: whatsappConfig.relayBaseUrl,
  }

  if (whatsappConfig.enabled && !isWhatsAppConfigured) {
    healthChecks.status = "degraded"
  }

  const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim())
  healthChecks.services.resend = {
    status: resendConfigured ? "configured" : "unconfigured",
  }

  return NextResponse.json(healthChecks, {
    status: healthChecks.status === "ok" ? 200 : 503,
  })
}
