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
  reply: vi.fn(),
  send: vi.fn(),
  audit: vi.fn(),
}))
let database: ReturnType<typeof drizzle>
vi.mock("server-only", () => ({}))
vi.mock("@/lib/db", () => ({
  get db() {
    return database
  },
}))
vi.mock("@/lib/auth/guards", () => ({
  requireDashboardAction: async () => ({
    ok: true,
    session: { user: { id: "00000000-0000-0000-0000-000000000001" } },
  }),
}))
vi.mock("@/lib/audit", () => ({ logAuditInTransaction: mocks.audit }))
vi.mock("@/app/actions/ai-responder", () => ({
  generateAutoReply: mocks.reply,
}))
vi.mock("@/lib/whatsapp/service", () => ({
  sendWhatsAppTextMessage: mocks.send,
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
import { retryDlqItem, dismissDlqItem } from "@/app/actions/dlq-actions"

const require = createRequire(import.meta.url)
const { PGlite } = createRequire(require.resolve("gbrain"))(
  "@electric-sql/pglite"
)
const pg = new PGlite()
const id = "00000000-0000-4000-8000-000000000002"
beforeAll(async () => {
  database = drizzle(pg)
  await pg.exec(
    `create table dead_letter_queue (id uuid primary key, action text not null, payload jsonb, error text, retry_count integer not null default 0, recovery_token uuid, locked_until timestamptz, created_at timestamptz not null default now()); create table background_jobs (id uuid primary key default gen_random_uuid(), kind text check(kind in ('support_email','support_triage')), dedupe_key text, payload jsonb, status text default 'pending', attempts integer default 0, available_at timestamptz default now(), created_at timestamptz default now(), unique(kind,dedupe_key));`
  )
})
afterAll(async () => {
  await pg.close()
})
beforeEach(async () => {
  await pg.exec("truncate dead_letter_queue, background_jobs")
  vi.clearAllMocks()
  mocks.audit.mockResolvedValue(undefined)
})
async function seed(action = "ai_auto_reply_generation") {
  await pg.query(
    "insert into dead_letter_queue(id,action,payload) values ($1,$2,$3)",
    [id, action, { ticketId: id, category: "tracking", awb: "SYNTHETIC" }]
  )
}
describe("DLQ recovery ownership", () => {
  it("allows one concurrent recovery and prevents dismissal during that recovery", async () => {
    await seed()
    let release = () => {}
    let started = () => {}
    const entered = new Promise<void>((resolve) => {
      started = resolve
    })
    mocks.reply.mockImplementation(async () => {
      started()
      await new Promise<void>((resolve) => {
        release = resolve
      })
      return { success: true }
    })
    const first = retryDlqItem(id)
    await entered
    expect((await retryDlqItem(id)).success).toBe(false)
    expect((await dismissDlqItem(id)).success).toBe(false)
    release()
    expect((await first).success).toBe(true)
    expect(mocks.reply).toHaveBeenCalledTimes(1)
  })
  it("keeps expired ownership closed until the provider outcome is reviewed", async () => {
    await seed()
    await pg.exec(
      "update dead_letter_queue set recovery_token=gen_random_uuid(),locked_until=now()-interval '1 minute'"
    )
    expect((await retryDlqItem(id)).success).toBe(false)
    expect(mocks.reply).not.toHaveBeenCalled()
  })
  it("never automatically resends a WhatsApp delivery with an uncertain outcome", async () => {
    await seed("whatsapp_relay_send")
    expect((await retryDlqItem(id)).success).toBe(false)
    expect(mocks.send).not.toHaveBeenCalled()
  })
  it("queues an SLA escalation using the supported email kind and preserves its template", async () => {
    await seed("sla_breach_email_fr")
    expect((await retryDlqItem(id)).success).toBe(true)
    const result = await pg.query("select kind,payload from background_jobs")
    expect(result.rows).toMatchObject([
      { kind: "support_email", payload: { notificationType: "sla_breach" } },
    ])
  })
  it("retains the item and its ownership when audit fails after recovery completed", async () => {
    await seed()
    mocks.reply.mockResolvedValue({ success: true })
    mocks.audit.mockRejectedValue(new Error("Synthetic audit failure"))
    expect((await retryDlqItem(id)).success).toBe(false)
    expect(
      (
        await pg.query(
          "select recovery_token is not null as claimed from dead_letter_queue"
        )
      ).rows
    ).toEqual([{ claimed: true }])
    expect((await retryDlqItem(id)).success).toBe(false)
    expect(mocks.reply).toHaveBeenCalledTimes(1)
  })
  it("rolls back dismissal when its audit cannot persist", async () => {
    await seed()
    mocks.audit.mockRejectedValue(new Error("Synthetic audit failure"))
    await expect(dismissDlqItem(id)).rejects.toThrow("Synthetic audit failure")
    expect(
      (await pg.query("select count(*)::int as count from dead_letter_queue"))
        .rows
    ).toEqual([{ count: 1 }])
  })
})

