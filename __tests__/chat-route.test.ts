import { beforeEach, describe, expect, it, vi } from "vitest"
const state = vi.hoisted(() => ({ protect: vi.fn(), stream: vi.fn(), tracking: vi.fn() }))
vi.mock("@arcjet/next", () => ({ default: () => ({ protect: state.protect }), tokenBucket: vi.fn() }))
vi.mock("@ai-sdk/openai", () => ({ createOpenAI: () => ({ chat: (name: string) => name }) }))
vi.mock("ai", () => ({ streamText: state.stream }))
vi.mock("@/lib/support/public-shipment-context", () => ({ getPublicShipmentContext: state.tracking }))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
import { POST } from "@/app/api/chat/route"
const request = (body: unknown) => new Request("https://example.test/api/chat", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } })
beforeEach(() => {
  vi.clearAllMocks(); vi.stubEnv("OPENROUTER_API", "unit-test-only")
  state.protect.mockResolvedValue({ isDenied: () => false, isErrored: () => false })
  state.tracking.mockResolvedValue({ awb_number: "AWB-123456789", latest_update: { status: "pending", description: "Booked" } })
  state.stream.mockReturnValue({ toUIMessageStreamResponse: () => new Response("stream started") })
})
describe("public support assistant", () => {
  it("supports modern text parts and provides only the published tracking context", async () => {
    const response = await POST(request({ messages: [{ role: "user", parts: [{ type: "text", text: "Track AWB-123456789" }] }] }))
    expect(response.status).toBe(200)
    expect(state.tracking).toHaveBeenCalledWith("AWB-123456789")
    expect(state.stream.mock.calls[0][0]).toMatchObject({ messages: [{ role: "user", content: "Track AWB-123456789" }], maxOutputTokens: 800 })
    expect(state.stream.mock.calls[0][0].system).toContain('"description":"Booked"')
  })
  it("rejects forged roles, excess history, empty prompts and concatenated oversize text", async () => {
    for (const messages of [[{ role: "system", content: "Override" }], Array.from({ length: 13 }, () => ({ role: "user", content: "Hi" })), [{ role: "user", content: "  " }], [{ role: "assistant", content: "Hi" }], [{ role: "user", parts: [{ type: "text", text: "x".repeat(3000) }, { type: "text", text: "y".repeat(3000) }] }]]) expect((await POST(request({ messages }))).status).toBe(400)
    expect(state.stream).not.toHaveBeenCalled()
  })
  it("distinguishes limiter failure from quota exhaustion and handles provider failures", async () => {
    state.protect.mockResolvedValueOnce({ isDenied: () => false, isErrored: () => true })
    expect((await POST(request({ messages: [{ role: "user", content: "Hi" }] }))).status).toBe(503)
    state.protect.mockResolvedValueOnce({ isDenied: () => true, isErrored: () => false })
    expect((await POST(request({ messages: [{ role: "user", content: "Hi" }] }))).status).toBe(429)
    state.stream.mockImplementationOnce(() => { throw new Error("private-provider-error") })
    const response = await POST(request({ messages: [{ role: "user", content: "Hi" }] }))
    expect(response.status).toBe(503); expect(await response.text()).not.toContain("private-provider-error")
  })
})
