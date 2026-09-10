import { beforeEach, describe, expect, it, vi } from "vitest"
import { createHmac } from "node:crypto"
const state = vi.hoisted(() => ({ secret: "webhook-test-secret", token: "verification-test-token", inbound: vi.fn(), receipt: vi.fn() }))
vi.mock("@/lib/whatsapp/config", () => ({ getWhatsAppConfig: () => ({ appSecret: state.secret, verifyToken: state.token }) }))
vi.mock("@/app/actions/whatsapp-inbound", () => ({ processInboundMessage: state.inbound }))
vi.mock("@/lib/whatsapp/service", () => ({ recordWhatsAppStatusUpdate: state.receipt }))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
import { GET, POST } from "@/app/api/webhooks/whatsapp/route"
const payload = { entry: [{ changes: [{ value: { messages: [{ id: "wamid.fixture", from: "919876543210", timestamp: "1788780000", type: "text", text: { body: "Track AWB-123456789" } }] } }] }] }
function request(body = JSON.stringify(payload), signature?: string) {
  return new Request("https://example.test/api/webhooks/whatsapp", { method: "POST", body, headers: { "x-hub-signature-256": signature ?? `sha256=${createHmac("sha256", state.secret).update(body).digest("hex")}` } })
}
beforeEach(() => { vi.clearAllMocks(); state.secret = "webhook-test-secret"; state.token = "verification-test-token"; state.inbound.mockResolvedValue({}); state.receipt.mockResolvedValue(undefined) })
describe("WhatsApp webhook boundary", () => {
  it("requires configured verification and handles Unicode tokens without a crash", async () => {
    state.token = ""
    expect((await GET(new Request("https://example.test?hub.mode=subscribe"))).status).toBe(403)
    state.token = "aa"
    expect((await GET(new Request("https://example.test?hub.mode=subscribe&hub.verify_token=éé&hub.challenge=42"))).status).toBe(403)
  })
  it("returns the challenge only for the configured token", async () => {
    const response = await GET(new Request(`https://example.test?hub.mode=subscribe&hub.verify_token=${state.token}&hub.challenge=42`))
    expect(response.status).toBe(200); expect(await response.text()).toBe("42")
  })
  it("rejects unsigned or oversized payloads before processing", async () => {
    expect((await POST(request(undefined, "sha256=" + "0".repeat(64)))).status).toBe(403)
    expect((await POST(request("x".repeat(128001)))).status).toBe(413)
    expect(state.inbound).not.toHaveBeenCalled()
  })
  it("validates shape and persists authentic messages", async () => {
    expect((await POST(request("{broken"))).status).toBe(400)
    expect((await POST(request('{"entry": "bad"}'))).status).toBe(400)
    expect((await POST(request())).status).toBe(200)
    expect(state.inbound).toHaveBeenCalledTimes(1)
  })
  it("asks the provider to retry persistence and delivery-receipt failures", async () => {
    state.inbound.mockRejectedValue(new Error("database unavailable"))
    expect((await POST(request())).status).toBe(503)
    state.receipt.mockRejectedValue(new Error("receipt arrived before insert"))
    expect((await POST(request(JSON.stringify({ entry: [{ changes: [{ value: { statuses: [{ id: "receipt-1", status: "delivered", timestamp: "1788780000" }] } }] }] })))).status).toBe(503)
  })
})
