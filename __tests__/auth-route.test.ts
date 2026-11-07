import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const mocks = vi.hoisted(() => ({
  GET: vi.fn(),
  POST: vi.fn(),
  captureException: vi.fn(),
}))
vi.mock("@/auth", () => ({ handlers: { GET: mocks.GET, POST: mocks.POST } }))
vi.mock("@sentry/nextjs", () => ({ captureException: mocks.captureException }))
import { GET, POST } from "@/app/api/auth/[...nextauth]/route"

const context = { params: Promise.resolve({ nextauth: ["session"] }) }

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("AUTH_URL", "http://localhost:3001")
  mocks.GET.mockResolvedValue(Response.json(null))
  mocks.POST.mockResolvedValue(Response.json({ url: "/signin" }))
})
afterEach(() => vi.unstubAllEnvs())

describe("Auth.js route request contract", () => {
  it.each(["session", "csrf", "providers"])(
    "returns JSON for %s when AUTH_URL is configured",
    async (action) => {
      const request = new NextRequest(`http://localhost:3001/api/auth/${action}`)
      const response = await GET(request, context)
      expect(mocks.GET).toHaveBeenCalledWith(request)
      expect(response.status).toBe(200)
      expect(response.headers.get("content-type")).toContain("application/json")
      await expect(response.json()).resolves.toBeDefined()
      expect(mocks.captureException).not.toHaveBeenCalled()
    }
  )

  it("preserves NextRequest and a POST form body", async () => {
    const request = new NextRequest("http://localhost:3001/api/auth/signout", {
      method: "POST",
      body: new URLSearchParams({ csrfToken: "synthetic-csrf" }),
    })
    await POST(request, context)
    expect(mocks.POST).toHaveBeenCalledWith(request)
  })

  it.each([GET, POST])("returns a client-readable error without private details", async (handler) => {
    mocks.GET.mockRejectedValue(new Error("private provider detail"))
    mocks.POST.mockRejectedValue(new Error("private provider detail"))
    const response = await handler(new NextRequest("http://localhost:3001/api/auth/session"), context)
    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body).toHaveProperty("message", "Authentication service unavailable")
    expect(JSON.stringify(body)).not.toContain("private provider detail")
    expect(mocks.captureException).toHaveBeenCalledOnce()
  })
})
