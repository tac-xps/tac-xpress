import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
const state = vi.hoisted(() => ({ writes: [] as { table: string; operation: string; payload: Record<string, unknown> }[], logFailure: false }))
vi.mock("server-only", () => ({}))
vi.mock("@/lib/db", () => ({ db: {} }))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn(), captureMessage: vi.fn() }))
vi.mock("@/lib/supabase/clients", () => ({ supabaseAdmin: { from: (table: string) => {
  const write = (operation: string, payload: Record<string, unknown>) => {
    state.writes.push({ table, operation, payload })
    const result = { data: { id: "attempt-1" }, error: state.logFailure ? { message: "database unavailable" } : null }
    const chain = { select: () => ({ single: async () => result }) }
    return Object.assign(Promise.resolve(result), chain, { eq: () => chain })
  }
  return { insert: (payload: Record<string, unknown>) => write("insert", payload), update: (payload: Record<string, unknown>) => write("update", payload) }
} } }))
import { sendWhatsAppTextMessage } from "@/lib/whatsapp/service"
beforeEach(() => { state.writes = []; state.logFailure = false; vi.stubEnv("WHATSAPP_ENABLED", "true"); vi.stubEnv("WPBOX_API_TOKEN", "unit-only"); vi.stubEnv("WPBOX_BASE_URL", "https://example.test") })
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })
describe("WhatsApp provider delivery", () => {
  it("records the attempt before sending and persists provider identifiers", async () => {
    const fetcher = vi.fn(async () => {
      expect(state.writes[0]).toMatchObject({ table: "message_outbound", operation: "insert", payload: { status: "pending" } })
      return new Response(JSON.stringify({ status: "success", data: { id: "relay-1" }, message_wamid: "meta-1" }))
    })
    vi.stubGlobal("fetch", fetcher)
    expect(await sendWhatsAppTextMessage({ to: "+919876543210", text: "Simulated fixture" })).toMatchObject({ success: true, logId: "attempt-1", metaMessageId: "meta-1" })
    expect(state.writes.at(-1)).toMatchObject({ operation: "update", payload: { status: "sent", meta_message_id: "meta-1" } })
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
  it("does not send when the initial delivery record cannot be saved", async () => {
    state.logFailure = true; const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher)
    expect(await sendWhatsAppTextMessage({ to: "+919876543210", text: "Fixture" })).toMatchObject({ success: false })
    expect(fetcher).not.toHaveBeenCalled()
  })
  it("does not automatically resend after an ambiguous timeout", async () => {
    const fetcher = vi.fn(async () => { throw new Error("timeout") }); vi.stubGlobal("fetch", fetcher)
    expect(await sendWhatsAppTextMessage({ to: "+919876543210", text: "Fixture" })).toMatchObject({ success: false, error: expect.stringContaining("may already have been accepted") })
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(state.writes.at(-1)).toMatchObject({ table: "message_outbound", operation: "update", payload: { status: "failed" } })
  })
})
