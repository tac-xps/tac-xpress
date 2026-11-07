import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { createRequire } from "node:module"
import { drizzle } from "drizzle-orm/pglite"
const mocks = vi.hoisted(() => ({
  results: [] as {
    data: Record<string, string>[] | null
    error: Error | null
  }[],
  filters: vi.fn(),
  audit: vi.fn(),
}))
let database: ReturnType<typeof drizzle>
vi.mock("server-only", () => ({}))
vi.mock("@/lib/db", () => ({
  get db() {
    return database
  },
}))
vi.mock("@/lib/supabase/clients", () => ({
  supabaseAdmin: {
    from: () => {
      const chain = {
        select: () => chain,
        is: () => chain,
        lt: () => chain,
        gt: () => chain,
        eq: () => chain,
        not: () => chain,
        or: () => chain,
        in: (...args: unknown[]) => {
          mocks.filters(...args)
          return chain
        },
        limit: async () => mocks.results.shift(),
      }
      return chain
    },
  },
}))
vi.mock("@/lib/audit", () => ({ logAuditInTransaction: mocks.audit }))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
import { GET } from "@/app/api/cron/sla-check/route"
const require = createRequire(import.meta.url)
const { PGlite } = createRequire(require.resolve("gbrain"))(
  "@electric-sql/pglite"
)
const pg = new PGlite()
const id = "00000000-0000-0000-0000-000000000003"
const request = () =>
  new Request("http://localhost/api/cron/sla-check", {
    headers: { authorization: "Bearer synthetic-cron" },
  })
beforeAll(async () => {
  database = drizzle(pg)
  await pg.exec(
    `create type shipment_status as enum ('pending','in-transit','delivered'); create table tickets (id uuid primary key, status text default 'open', first_reply_at timestamptz, sla_deadline_first_response timestamptz, sla_deadline_resolution timestamptz, sla_breached boolean default false, sla_breach_type text, sla_at_risk boolean default false, sla_breach_processed_at timestamptz); create table shipments (id uuid primary key, status shipment_status, deleted_at timestamptz, edd timestamptz, sla_at_risk boolean default false, sla_at_risk_alerted_at timestamptz); create table notifications (ticket_id uuid, recipient_email text, type text, payload jsonb); create table background_jobs (kind text, dedupe_key text, payload jsonb, unique(kind,dedupe_key));`
  )
})
afterAll(async () => {
  await pg.close()
  vi.unstubAllEnvs()
})
beforeEach(async () => {
  vi.clearAllMocks()
  mocks.audit.mockResolvedValue(undefined)
  vi.stubEnv("CRON_SECRET", "synthetic-cron")
  vi.stubEnv("OPS_NOTIFICATION_EMAIL", "ops@example.test")
  await pg.exec("truncate tickets,shipments,notifications,background_jobs")
  await pg.query(
    "insert into tickets(id,sla_deadline_first_response,sla_deadline_resolution) values ($1,now()-interval '1 hour',now()+interval '1 hour')",
    [id]
  )
  mocks.results = [
    { data: [{ id, priority: "high", assigned_team: "ops" }], error: null },
    { data: [], error: null },
    { data: [], error: null },
  ]
})
describe("SLA scheduler", () => {
  it("does not mark breaches when the operator recipient is missing", async () => {
    vi.stubEnv("OPS_NOTIFICATION_EMAIL", "")
    vi.stubEnv("ADMIN_EMAIL", "")
    expect((await GET(request())).status).toBe(503)
    expect((await pg.query("select sla_breached from tickets")).rows).toEqual([
      { sla_breached: false },
    ])
    expect(
      (await pg.query("select count(*)::int as count from notifications")).rows
    ).toEqual([{ count: 0 }])
  })
  it("denies an unauthenticated invocation before database access", async () => {
    expect(
      (await GET(new Request("http://localhost/api/cron/sla-check"))).status
    ).toBe(401)
  })
  it("returns an error when a lookup fails instead of reporting zero breaches", async () => {
    mocks.results[0] = {
      data: null,
      error: new Error("Synthetic lookup failure"),
    }
    expect((await GET(request())).status).toBe(503)
    expect((await pg.query("select sla_breached from tickets")).rows).toEqual([
      { sla_breached: false },
    ])
  })
  it("commits one durable email and operator alert, with valid shipment enum filters", async () => {
    expect((await GET(request())).status).toBe(200)
    expect(mocks.filters).toHaveBeenCalledWith("status", [
      "pending",
      "in-transit",
    ])
    expect(
      (await pg.query("select kind,payload from background_jobs")).rows
    ).toMatchObject([
      {
        kind: "support_email",
        payload: { ticketId: id, notificationType: "sla_breach" },
      },
    ])
    expect((await pg.query("select type from notifications")).rows).toEqual([
      { type: "sla_breached" },
    ])
    mocks.results = [
      { data: [{ id, priority: "high", assigned_team: "ops" }], error: null },
      { data: [], error: null },
      { data: [], error: null },
    ]
    await GET(request())
    expect(
      (await pg.query("select count(*)::int as count from background_jobs"))
        .rows
    ).toEqual([{ count: 1 }])
  })
  it("rolls back breach flags and queued delivery if audit persistence fails", async () => {
    mocks.audit.mockRejectedValue(new Error("Synthetic audit failure"))
    expect((await GET(request())).status).toBe(503)
    expect((await pg.query("select sla_breached from tickets")).rows).toEqual([
      { sla_breached: false },
    ])
    expect(
      (await pg.query("select count(*)::int as count from notifications")).rows
    ).toEqual([{ count: 0 }])
    expect(
      (await pg.query("select count(*)::int as count from background_jobs"))
        .rows
    ).toEqual([{ count: 0 }])
  })
})
it("rejects a placeholder operator recipient in production", async () => {
  vi.stubEnv("NODE_ENV", "production")
  vi.stubEnv("OPS_NOTIFICATION_EMAIL", "ops@example.com")
  expect((await GET(request())).status).toBe(503)
  expect((await pg.query("select sla_breached from tickets")).rows).toEqual([
    { sla_breached: false },
  ])
})
