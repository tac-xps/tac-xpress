import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest, NextResponse, type NextFetchEvent } from "next/server"

const mocks = vi.hoisted(() => ({
  protect: vi.fn(),
  downstream: vi.fn(),
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}))
vi.mock("@arcjet/next", () => ({
  default: () => ({ protect: mocks.protect }),
  shield: vi.fn(),
  detectBot: vi.fn(),
  slidingWindow: vi.fn(),
}))
vi.mock("next-auth", () => ({
  default: () => ({ auth: () => mocks.downstream }),
}))
vi.mock("@/auth.config", () => ({ authConfig: {} }))
vi.mock("@/lib/auth/document-token", () => ({
  verifyDocumentToken: () => false,
}))
vi.mock("@sentry/nextjs", () => ({
  captureException: mocks.captureException,
  captureMessage: mocks.captureMessage,
}))
import { proxy } from "@/proxy"

const event = {} as NextFetchEvent
const decision = ({
  error = false,
  denied = false,
  rateLimit = false,
  partialError = false,
} = {}) => ({
  id: "test-decision",
  isErrored: () => error,
  isDenied: () => denied,
  reason: { isRateLimit: () => rateLimit },
  results: partialError ? [{ conclusion: "ERROR" }] : [],
})
const request = (
  path: string,
  method = "GET",
  headers: Record<string, string> = {}
) => new NextRequest(`https://website.example.test${path}`, { method, headers })

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("NODE_ENV", "production")
  vi.stubEnv("ARCJET_KEY", "ajkey_synthetic_unit_only")
  mocks.downstream.mockResolvedValue(NextResponse.next())
  mocks.protect.mockResolvedValue(decision())
})
afterEach(() => vi.unstubAllEnvs())

describe("request perimeter failures", () => {
  it.each([
    "/api/hubs",
    "/dashboard",
    "/portal/invoices",
    "/driver/delivery",
    "/invoice/test",
  ])("denies %s when protection cannot evaluate the request", async (path) => {
    mocks.protect.mockResolvedValue(decision({ error: true }))
    const response = await proxy(request(path), event)
    expect(response?.status).toBe(503)
    expect(mocks.downstream).not.toHaveBeenCalled()
    expect(mocks.captureMessage).toHaveBeenCalled()
  })
  it("rejects a partial rule error even when the aggregate decision allows the request", async () => {
    mocks.protect.mockResolvedValue(decision({ partialError: true }))
    expect((await proxy(request("/api/documents"), event))?.status).toBe(503)
    expect(mocks.downstream).not.toHaveBeenCalled()
  })
  it("rejects an interrupted protection request without exposing its exception", async () => {
    mocks.protect.mockRejectedValue(new Error("private provider detail"))
    const response = await proxy(request("/api/documents", "POST"), event)
    expect(response?.status).toBe(503)
    expect(await (response as Response).text()).not.toContain(
      "private provider detail"
    )
    expect(mocks.captureException).toHaveBeenCalled()
  })
  it("requires protection for a server action on a public page", async () => {
    mocks.protect.mockResolvedValue(decision({ error: true }))
    expect(
      (
        await proxy(
          request("/contact", "POST", { "next-action": "synthetic" }),
          event
        )
      )?.status
    ).toBe(503)
    expect(mocks.downstream).not.toHaveBeenCalled()
  })
  it("keeps public information available during a protection outage", async () => {
    mocks.protect.mockResolvedValue(decision({ error: true }))
    expect((await proxy(request("/services"), event))?.status).toBe(200)
    expect(mocks.downstream).toHaveBeenCalledOnce()
    expect(mocks.captureMessage).toHaveBeenCalled()
  })
  it("preserves rate-limit denials with a retry hint", async () => {
    mocks.protect.mockResolvedValue(decision({ denied: true, rateLimit: true }))
    const response = await proxy(request("/track"), event)
    expect(response?.status).toBe(429)
    expect(response?.headers.get("Retry-After")).toBe("60")
    expect(mocks.downstream).not.toHaveBeenCalled()
  })
  it("preserves bot and shield denials", async () => {
    mocks.protect.mockResolvedValue(decision({ denied: true }))
    expect((await proxy(request("/"), event))?.status).toBe(403)
    expect(mocks.downstream).not.toHaveBeenCalled()
  })
  it("continues to the auth boundary when protection allows the request", async () => {
    expect((await proxy(request("/api/hubs"), event))?.status).toBe(200)
    expect(mocks.downstream).toHaveBeenCalledOnce()
  })
  it("does not accept a development placeholder in production", async () => {
    vi.stubEnv("ARCJET_KEY", "ajkey_dev_placeholder")
    expect((await proxy(request("/"), event))?.status).toBe(503)
    expect(mocks.protect).not.toHaveBeenCalled()
    expect(mocks.downstream).not.toHaveBeenCalled()
  })
})
