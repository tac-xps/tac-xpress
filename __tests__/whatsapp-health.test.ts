import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/db", () => ({ db: { execute: vi.fn().mockResolvedValue([]) } }))
vi.mock("@/lib/auth/guards", () => ({
  requireDashboardApi: vi.fn().mockResolvedValue({ ok: true }),
}))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
import { GET } from "@/app/api/health/route"

beforeEach(() => {
  vi.stubEnv("WHATSAPP_ENABLED", "true")
  vi.stubEnv("WPBOX_API_TOKEN", "fixture-private-relay")
  vi.stubEnv("WPBOX_USER_ID", "fixture-private-account")
  vi.stubEnv("WPBOX_BASE_URL", "")
  vi.stubEnv("WHATSAPP_APP_SECRET", "")
  vi.stubEnv("WHATSAPP_VERIFY_TOKEN", "")
  vi.stubEnv("OPENROUTER_API", "")
  vi.stubEnv("RESEND_API_KEY", "fixture-private-email")
})
afterEach(() => vi.unstubAllEnvs())

describe("WhatsApp configuration health", () => {
  it("reports outbound and Meta callback setup independently", async () => {
    const response = await GET(
      new NextRequest("https://workspace.invalid/api/health")
    )
    expect(response.status).toBe(200)
    const body = await response.text()
    expect(body).toContain(
      '"whatsapp":{"status":"configured","enabled":true,"relayBaseUrl":"https://chat.leminai.com","metaWebhook":"unconfigured"}'
    )
    expect(body).not.toContain("fixture-private-")
  })

  it.each(["WPBOX_API_TOKEN", "WPBOX_USER_ID"])(
    "degrades enabled outbound messaging without %s",
    async (name) => {
      vi.stubEnv(name, "")
      const response = await GET(
        new NextRequest("https://workspace.invalid/api/health")
      )
      expect(response.status).toBe(503)
      expect(await response.text()).toContain(
        '"whatsapp":{"status":"unconfigured"'
      )
    }
  )
})
