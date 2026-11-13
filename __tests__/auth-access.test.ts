import { beforeEach, afterEach, describe, expect, it, vi } from "vitest"
import { PgDialect } from "drizzle-orm/pg-core"

vi.mock("server-only", () => ({}))

const mocks = vi.hoisted(() => ({
  rows: [] as { id: string; email: string; role: string }[],
  where: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  signIn: vi.fn(),
  allow: vi.fn(),
  verifyProof: vi.fn(),
  verifyMfa: vi.fn(),
  authorize: undefined as
    | undefined
    | ((credentials: Record<string, unknown>) => Promise<unknown>),
}))

vi.mock("next-auth", () => ({
  default: (config: { providers: { authorize: typeof mocks.authorize }[] }) => {
    mocks.authorize = config.providers[0].authorize
    return { handlers: {}, auth: vi.fn(), signIn: vi.fn(), signOut: vi.fn() }
  },
}))
vi.mock("next-auth/providers/credentials", () => ({
  default: (config: unknown) => config,
}))
vi.mock("@/auth.config", () => ({ authConfig: {} }))
vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({ from: () => ({ where: mocks.where }) }),
    insert: mocks.insert,
    update: mocks.update,
  },
}))
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { signInWithPassword: mocks.signIn } }),
}))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
vi.mock("@/lib/auth/credential-rate-limit", () => ({
  allowCredentialAttempt: mocks.allow,
  verifyRateLimitProof: mocks.verifyProof,
}))
vi.mock("@/lib/auth/mfa/challenge-token", () => ({
  verifyMfaVerifiedToken: mocks.verifyMfa,
}))

await import("@/auth")

describe("staff authentication", () => {
  beforeEach(() => {
    vi.stubEnv("E2E_TEST_BYPASS_ENABLED", "false")
    mocks.rows = []
    mocks.where.mockReset().mockImplementation(async () => mocks.rows)
    mocks.allow.mockResolvedValue(true)
    mocks.verifyProof.mockReturnValue(false)
    mocks.verifyMfa.mockReset()
    mocks.insert.mockClear()
    mocks.update.mockClear()
    mocks.signIn.mockResolvedValue({
      data: { user: { id: "user-1", email: "person@example.com" } },
      error: null,
    })
  })
  afterEach(() => vi.unstubAllEnvs())

  it("rejects a valid Supabase identity without a provisioned staff record", async () => {
    expect(
      await mocks.authorize!({
        email: "person@example.com",
        password: "test-password",
      })
    ).toBeNull()
    expect(mocks.insert).not.toHaveBeenCalled()
  })

  it("rejects an identity without an ID match without reassigning an existing staff record", async () => {
    mocks.rows = [{ id: "legacy-id", email: "person@example.com", role: "staff" }]
    mocks.where.mockResolvedValueOnce([])

    expect(
      await mocks.authorize!({ email: "person@example.com", password: "test-password" })
    ).toBeNull()
    expect(mocks.where).toHaveBeenCalledOnce()
    expect(mocks.update).not.toHaveBeenCalled()
  })

  it("requires a matching Auth account when finishing MFA or passkey sign-in", async () => {
    mocks.verifyMfa.mockResolvedValue({ userId: "user-1" })
    mocks.where.mockResolvedValueOnce([])

    expect(await mocks.authorize!({ mfaToken: "verified-token" })).toBeNull()
    const query = new PgDialect().sqlToQuery(mocks.where.mock.calls[0][0])
    expect(query.sql).toContain('exists (select 1 from auth.users as identity where identity.id = "users"."id")')
    expect(query.params).toEqual(["user-1"])

    mocks.rows = [{ id: "user-1", email: "person@example.com", role: "staff" }]
    expect(await mocks.authorize!({ mfaToken: "verified-token" })).toEqual(mocks.rows[0])
  })
  it.each(["customer", "viewer", "", "owner"])(
    "does not elevate role %s",
    async (role) => {
      mocks.rows = [{ id: "user-1", email: "person@example.com", role }]
      expect(
        await mocks.authorize!({
          email: "person@example.com",
          password: "test-password",
        })
      ).toBeNull()
    }
  )
  it.each(["admin", "staff"])(
    "allows explicitly provisioned %s",
    async (role) => {
      mocks.rows = [{ id: "user-1", email: "person@example.com", role }]
      expect(
        await mocks.authorize!({
          email: "person@example.com",
          password: "test-password",
        })
      ).toEqual({ id: "user-1", email: "person@example.com", role })
    }
  )
  it("rejects malformed credentials before a provider request", async () => {
    mocks.signIn.mockClear()
    expect(await mocks.authorize!({ email: {}, password: "test" })).toBeNull()
    expect(mocks.signIn).not.toHaveBeenCalled()
  })
  it("rejects a rate-limited attempt before checking the password", async () => {
    mocks.signIn.mockClear()
    mocks.allow.mockResolvedValue(false)
    expect(
      await mocks.authorize!({
        email: "person@example.com",
        password: "test-password",
      })
    ).toBeNull()
    expect(mocks.signIn).not.toHaveBeenCalled()
  })
  it("does not honor the test bypass in production", async () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("E2E_TEST_BYPASS_ENABLED", "true")
    vi.stubEnv("E2E_TEST_USER_PASSWORD", "test-secret")
    expect(
      await mocks.authorize!({
        email: "admin@test.tacexpress.app",
        password: "test-secret",
      })
    ).toBeNull()
    expect(mocks.insert).not.toHaveBeenCalled()
  })
  it("accepts an attempt with a valid rateLimitProof without calling allowCredentialAttempt", async () => {
    mocks.signIn.mockClear()
    mocks.allow.mockClear()
    mocks.verifyProof.mockReturnValue(true)
    mocks.rows = [{ id: "user-1", email: "person@example.com", role: "admin" }]
    const result = await mocks.authorize!({
      email: "person@example.com",
      password: "test-password",
      rateLimitProof: "valid-proof",
    })
    expect(result).toEqual({ id: "user-1", email: "person@example.com", role: "admin" })
    expect(mocks.allow).not.toHaveBeenCalled()
  })
})
