import { beforeEach, afterEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  rows: [] as { id: string; email: string; role: string }[],
  insert: vi.fn(),
  signIn: vi.fn(),
  allow: vi.fn(),
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
    select: () => ({ from: () => ({ where: async () => mocks.rows }) }),
    insert: mocks.insert,
  },
}))
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { signInWithPassword: mocks.signIn } }),
}))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
vi.mock("@/lib/auth/credential-rate-limit", () => ({
  allowCredentialAttempt: mocks.allow,
}))

await import("@/auth")

describe("staff authentication", () => {
  beforeEach(() => {
    vi.stubEnv("E2E_TEST_BYPASS_ENABLED", "false")
    mocks.rows = []
    mocks.allow.mockResolvedValue(true)
    mocks.insert.mockClear()
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
})
