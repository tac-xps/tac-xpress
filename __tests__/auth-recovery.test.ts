import { beforeEach, afterEach, describe, it, expect, vi } from "vitest"
import type { Session } from "next-auth"
import { NextRequest } from "next/server"
import { NextFetchEvent } from "next/dist/server/web/spec-extension/fetch-event"

const mocks = vi.hoisted(() => ({
  session: vi.fn<() => Session | null>(),
  requireSession: vi.fn(),
}))
vi.mock("next-auth", () => ({
  default: () => ({
    auth: (handle: (request: NextRequest & { auth: Session | null }) => Response) =>
      (request: NextRequest) => handle(Object.assign(request, { auth: mocks.session() })),
  }),
}))
vi.mock("@/auth.config", () => ({ authConfig: {} }))
vi.mock("server-only", () => ({}))
vi.mock("@/lib/auth/guards", () => ({ requireDashboardSession: mocks.requireSession }))
vi.mock("@/lib/auth/document-token", () => ({ verifyDocumentToken: () => false }))
vi.mock("next/headers", () => ({ headers: vi.fn() }))
vi.mock("next/navigation", () => ({
  redirect: (path: string) => { throw new Error(`NEXT_REDIRECT:${path}`) },
}))
import { proxy } from "@/proxy"
import { requireAdminPage, requireStaffPage } from "@/lib/auth/page-access"

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("NODE_ENV", "development")
  vi.stubEnv("ARCJET_DEV_ENABLE", "false")
  mocks.session.mockReturnValue({
    expires: "2099-01-01T00:00:00Z",
    user: { id: "11111111-1111-1111-1111-111111111111", role: "staff", org_id: "test-org" },
  })
})
afterEach(() => vi.unstubAllEnvs())

describe("revoked workspace session recovery", () => {
  it.each([
    { path: "/signin?reason=staff-only", status: 200, location: null },
    { path: "/signin", status: 307, location: "http://localhost:3001/dashboard" },
  ])("serves $path without trapping stale staff sessions", async ({ path, status, location }) => {
    const request = new NextRequest(`http://localhost:3001${path}`)
    const event = new NextFetchEvent({ request, page: "/signin", context: undefined })
    const response = await proxy(request, event)
    expect(response?.status).toBe(status)
    expect(response?.headers.get("location")).toBe(location)
  })
  it.each([requireStaffPage, requireAdminPage])("marks an authorization failure for recovery", async (guard) => {
    mocks.requireSession.mockRejectedValue(new Error("Forbidden"))
    await expect(guard()).rejects.toThrow("NEXT_REDIRECT:/signin?reason=staff-only")
  })
  it("returns an allowed session without redirecting", async () => {
    const session = mocks.session()
    mocks.requireSession.mockResolvedValue(session)
    await expect(requireStaffPage()).resolves.toEqual(session)
  })
})
