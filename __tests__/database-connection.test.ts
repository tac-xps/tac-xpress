import { beforeEach, afterEach, it, expect, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  connect: vi.fn(() => ({ end: vi.fn().mockResolvedValue(undefined) })),
}))
vi.mock("server-only", () => ({}))
vi.mock("postgres", () => ({ default: mocks.connect }))
vi.mock("drizzle-orm/postgres-js", () => ({ drizzle: vi.fn(() => ({})) }))
vi.mock("@/lib/db/schema", () => ({}))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  delete globalThis._postgresClient
  vi.stubEnv("VERCEL", "")
  vi.stubEnv("AWS_LAMBDA_FUNCTION_NAME", "")
  vi.stubEnv("NETLIFY", "")
  vi.stubEnv("DATABASE_URL", "")
})
afterEach(() => {
  delete globalThis._postgresClient
  vi.unstubAllEnvs()
})

it.each([
  ["development", "5432"],
  ["development", "6543"],
  ["production", "6543"],
  ["production", "5432"],
])("preserves the configured pooler port in %s on %s", async (mode, port) => {
  const url = `postgres://synthetic:synthetic@aws-0-ap-southeast-2.pooler.supabase.com:${port}/postgres`
  vi.stubEnv("NODE_ENV", mode)
  vi.stubEnv("SUPABASE_POOLER_URL", url)
  await import("@/lib/db")
  expect(mocks.connect).toHaveBeenCalledWith(
    url,
    expect.objectContaining({
      prepare: false,
      ssl: "require",
      max: mode === "production" ? 1 : 10,
    })
  )
})
