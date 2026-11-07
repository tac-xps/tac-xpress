import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/auth/page-access", () => ({ requireStaffPage: vi.fn() }))
vi.mock("@/lib/config/app-url", () => ({
  getAppUrl: () => "https://workspace.invalid",
}))
vi.mock("@/app/dashboard/integrations/scanner-test", () => ({
  ScannerTest: () => null,
}))
import IntegrationsPage from "@/app/dashboard/integrations/page"

beforeEach(() => {
  vi.stubEnv("WHATSAPP_ENABLED", "true")
  vi.stubEnv("WPBOX_API_TOKEN", "synthetic-private-relay-token")
  vi.stubEnv("WPBOX_USER_ID", "synthetic-private-user-id")
  vi.stubEnv("WHATSAPP_APP_SECRET", "synthetic-private-app-secret")
  vi.stubEnv("WHATSAPP_VERIFY_TOKEN", "synthetic-private-verification-token")
  vi.stubEnv("RESEND_API_KEY", "")
  vi.stubEnv("CARRIER_WEBHOOK_SECRET", "")
})
afterEach(() => vi.unstubAllEnvs())

describe("integration configuration boundary", () => {
  it("passes callback configuration to the client without secret values", async () => {
    const page = JSON.stringify(await IntegrationsPage())
    expect(page).toContain("https://workspace.invalid/api/webhooks/whatsapp")
    expect(page).toContain('"isConfigured":true')
    expect(page).not.toContain("synthetic-private-")
    expect(page).not.toContain("secretValue")
  })

  it.each([
    ["", ""],
    ["", "synthetic-private-verification-token"],
    ["synthetic-private-app-secret", ""],
  ])(
    "separates LeminAI outbound setup from incomplete Meta callbacks",
    async (secret, token) => {
      vi.stubEnv("WHATSAPP_APP_SECRET", secret)
      vi.stubEnv("WHATSAPP_VERIFY_TOKEN", token)
      const page = JSON.stringify(await IntegrationsPage())
      expect(page).toContain("WhatsApp delivery via LeminAI")
      expect(page).toContain("Configuration present")
      expect(page).not.toContain("Configuration incomplete")
      expect(page).toContain(
        '"secretName":"Meta app secret and verification token","isConfigured":false'
      )
      expect(page).not.toContain("synthetic-private-")
    }
  )

  it.each(["WPBOX_API_TOKEN", "WPBOX_USER_ID"])(
    "requires %s for outbound configuration",
    async (name) => {
      vi.stubEnv(name, "")
      expect(JSON.stringify(await IntegrationsPage())).toContain(
        "Configuration incomplete"
      )
    }
  )
})
