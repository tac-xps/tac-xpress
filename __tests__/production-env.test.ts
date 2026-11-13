import { spawnSync } from "node:child_process"
import { describe, expect, it } from "vitest"

const productionEnv: NodeJS.ProcessEnv = {
  NODE_ENV: "production",
  SYSTEMROOT: process.env.SYSTEMROOT,
  PATH: process.env.PATH,
  NEXT_PUBLIC_APP_URL: "https://workspace.invalid",
  AUTH_SECRET: "a".repeat(32),
  NEXT_PUBLIC_SUPABASE_URL: "https://ujyellrhwhqjmfponhuz.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture-anon",
  SUPABASE_SERVICE_ROLE_KEY: "fixture-service",
  DATABASE_URL: "postgresql://fixture:fixture@database.invalid/tac_xpress",
  ARCJET_KEY: "fixture-arcjet",
  CRON_SECRET: "b".repeat(32),
  RESEND_API_KEY: "fixture-resend",
  FROM_EMAIL: "sender@workspace.invalid",
  OPS_NOTIFICATION_EMAIL: "operations@workspace.invalid",
  INVOICE_PDF_SIGNING_SECRET: "c".repeat(32),
  SENTRY_DSN: "https://fixture@sentry.invalid/1",
  OPENROUTER_API: "fixture-openrouter",
  MOBILE_API_SECRET: "d".repeat(32),
  WHATSAPP_ENABLED: "true",
  WPBOX_API_TOKEN: "fixture-private-relay",
  WPBOX_USER_ID: "fixture-private-account",
}

function verify(overrides: Record<string, string> = {}, args: string[] = []) {
  return spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/verify-production-env.ts", ...args],
    {
      cwd: process.cwd(),
      env: { ...productionEnv, ...overrides },
      encoding: "utf8",
      timeout: 10000,
    }
  )
}

describe("production messaging environment", { timeout: 12_000 }, () => {
  it("allows the approved Resend deferral without requiring sender settings", () => {
    const result = verify({
      RESEND_API_KEY: "",
      FROM_EMAIL: "",
      OPS_NOTIFICATION_EMAIL: "",
    }, ["--defer-resend"])
    expect(result.status).toBe(0)
    expect(result.stderr).toContain("Resend validation is deferred")
  })

  it("keeps core and active provider checks enforced during the deferral", () => {
    const result = verify({ AUTH_SECRET: "", WPBOX_API_TOKEN: "" }, ["--defer-resend"])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("AUTH_SECRET")
    expect(result.stderr).toContain("WPBOX_API_TOKEN")
  })

  it("accepts an explicit session pooler with a separate capacity warning", () => {
    const result = verify({
      DATABASE_URL:
        "postgresql://fixture:fixture@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres",
    })
    expect(result.status).toBe(0)
    expect(result.stderr).toContain("Verify serverless connection capacity")
    expect(result.stdout + result.stderr).not.toContain("postgresql://")
  })

  it("rejects an unsupported pooler port without exposing its URL", () => {
    const result = verify({
      DATABASE_URL:
        "postgresql://fixture:fixture@aws-0-ap-southeast-2.pooler.supabase.com:1234/postgres",
    })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("explicitly select port 5432 or 6543")
    expect(result.stdout + result.stderr).not.toContain("postgresql://")
  })
  it("accepts a display-name sender format", () => {
    const result = verify({
      FROM_EMAIL: "TAC-XPRESS <sender@workspace.invalid>",
    })
    expect(result.status).toBe(0)
  })

  it("checks the notification sender override as well", () => {
    const result = verify({ RESEND_FROM_EMAIL: "private-recipient@gmail.com" })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain(
      "RESEND_FROM_EMAIL must use an owned, verified Resend domain"
    )
    expect(result.stdout + result.stderr).not.toContain("private-recipient")
  })

  it("accepts a custom-domain notification sender format", () => {
    const result = verify({
      RESEND_FROM_EMAIL: "TAC-XPRESS <sender@workspace.invalid>",
    })
    expect(result.status).toBe(0)
  })

  it.each([
    "private-recipient@gmail.com",
    "TAC-XPRESS <private-recipient@GMAIL.COM>",
    "private-recipient@outlook.com",
  ])("rejects a personal mailbox used as the sender", (sender) => {
    const result = verify({ FROM_EMAIL: sender })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("owned, verified Resend domain")
    expect(result.stdout + result.stderr).not.toContain(sender)
    expect(result.stdout + result.stderr).not.toContain("private-recipient")
  })

  it.each([
    "not-an-email",
    "TAC-XPRESS <sender@workspace.invalid",
    "sender@workspace.invalid>",
  ])("rejects malformed sender configuration without printing it", (sender) => {
    const result = verify({ FROM_EMAIL: sender })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("valid sender address")
    expect(result.stdout + result.stderr).not.toContain(sender)
  })

  it("accepts LeminAI outbound setup and separately reports unverified callbacks", () => {
    const result = verify()
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("Production environment checks passed")
    expect(result.stderr).toContain("Meta callbacks are not configured")
    expect(result.stdout + result.stderr).not.toContain("fixture-private-")
  })

  it.each(["WPBOX_API_TOKEN", "WPBOX_USER_ID"])(
    "rejects missing %s",
    (name) => {
      const result = verify({ [name]: "" })
      expect(result.status).toBe(1)
      expect(result.stderr).toContain(
        `${name} is required for outbound LeminAI messaging`
      )
    }
  )

  it.each(["WHATSAPP_APP_SECRET", "WHATSAPP_VERIFY_TOKEN"])(
    "rejects a partial Meta pair with only %s",
    (name) => {
      const result = verify({ [name]: "fixture-private-meta" })
      expect(result.status).toBe(1)
      expect(result.stderr).toContain("Meta callbacks require both")
    }
  )

  it("accepts the complete Meta pair without exposing either credential", () => {
    const result = verify({
      WHATSAPP_APP_SECRET: "fixture-private-meta-app",
      WHATSAPP_VERIFY_TOKEN: "fixture-private-meta-verify",
    })
    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
    expect(result.stdout).not.toContain("fixture-private-")
  })
})
