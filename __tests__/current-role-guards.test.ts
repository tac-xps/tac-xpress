import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  lookup: vi.fn(),
  query: vi.fn(),
  captureException: vi.fn(),
}))

vi.mock("@/auth", () => ({ auth: mocks.auth }))
vi.mock("@sentry/nextjs", () => ({ captureException: mocks.captureException }))
vi.mock("@/lib/db", async () => {
  const { PgDialect } = await import("drizzle-orm/pg-core")
  const dialect = new PgDialect()
  return {
    db: {
      select: () => ({
        from: () => ({
          where: (condition: Parameters<typeof dialect.sqlToQuery>[0]) => {
            mocks.query(dialect.sqlToQuery(condition))
            return { limit: mocks.lookup }
          },
        }),
      }),
    },
  }
})

const { requireDashboardSession, requireDashboardAction, requireDashboardApi } =
  await import("@/lib/auth/guards")

const userId = "11111111-1111-4111-8111-111111111111"
const staleAdminSession = {
  user: {
    id: userId,
    role: "admin",
    email: "staff@example.com",
    name: "Staff",
  },
  expires: "2099-01-01T00:00:00.000Z",
}

async function expectAllForbidden(roles?: readonly ("admin" | "staff")[]) {
  await expect(requireDashboardSession(roles)).rejects.toThrow("Forbidden")
  expect(await requireDashboardAction(roles)).toEqual({
    ok: false,
    response: {
      success: false,
      error: "You do not have permission to perform this action.",
    },
  })
  const api = await requireDashboardApi(roles)
  expect(api.ok).toBe(false)
  if (api.ok) throw new Error("Expected API authorization to fail")
  expect(api.response.status).toBe(403)
  expect(await api.response.json()).toEqual({ error: "Forbidden" })
}

describe("current database role authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.auth.mockResolvedValue(staleAdminSession)
    mocks.lookup.mockResolvedValue([{ role: "staff" }])
  })

  it("rejects a demoted customer despite an admin role in the existing session", async () => {
    mocks.lookup.mockResolvedValue([{ role: "customer" }])
    await expectAllForbidden()
    expect(mocks.lookup).toHaveBeenCalledTimes(3)
  })

  it("rejects a deleted or missing staff record and requires an active row for this session ID", async () => {
    // The database returns no row when deleted_at is set. Check the real SQL
    // predicate too, so removing the deletion filter cannot leave this test green.
    mocks.lookup.mockResolvedValue([])
    await expectAllForbidden()
    expect(mocks.query).toHaveBeenCalledTimes(3)
    for (const [query] of mocks.query.mock.calls) {
      expect(query.sql).toContain('"users"."id" = $1')
      expect(query.sql).toContain('"users"."deleted_at" is null')
      expect(query.params).toEqual([userId])
    }
  })

  it("fails closed and reports database failures in all three guards", async () => {
    const failure = new Error("Authorization database unavailable")
    mocks.lookup.mockRejectedValue(failure)
    await expectAllForbidden()
    expect(mocks.captureException).toHaveBeenCalledTimes(3)
    expect(mocks.captureException).toHaveBeenCalledWith(failure, {
      tags: { area: "authorization" },
    })
  })

  it("denies admin-only access to current staff even when the JWT still says admin", async () => {
    await expectAllForbidden(["admin"])
  })

  it("returns the current staff role instead of propagating the stale admin role", async () => {
    const session = await requireDashboardSession()
    expect(session.user).toEqual({ ...staleAdminSession.user, role: "staff" })
    const action = await requireDashboardAction()
    expect(action).toMatchObject({
      ok: true,
      session: { user: { role: "staff", id: userId } },
    })
    const api = await requireDashboardApi()
    expect(api).toMatchObject({
      ok: true,
      session: { user: { role: "staff", id: userId } },
    })
    expect(staleAdminSession.user.role).toBe("admin")
  })

  it("allows admin-only access when the database still grants admin", async () => {
    mocks.lookup.mockResolvedValue([{ role: "admin" }])
    expect(await requireDashboardSession(["admin"])).toMatchObject({
      user: { role: "admin" },
    })
    expect(await requireDashboardAction(["admin"])).toMatchObject({
      ok: true,
      session: { user: { role: "admin" } },
    })
    expect(await requireDashboardApi(["admin"])).toMatchObject({
      ok: true,
      session: { user: { role: "admin" } },
    })
  })

  it("returns unauthenticated responses without querying the role database", async () => {
    mocks.auth.mockResolvedValue(null)
    await expect(requireDashboardSession()).rejects.toThrow("Unauthorized")
    expect(await requireDashboardAction()).toMatchObject({
      ok: false,
      response: { success: false },
    })
    const api = await requireDashboardApi()
    expect(api.ok).toBe(false)
    if (api.ok) throw new Error("Expected API authentication to fail")
    expect(api.response.status).toBe(401)
    expect(await api.response.json()).toEqual({ error: "Unauthorized" })
    expect(mocks.lookup).not.toHaveBeenCalled()
    expect(mocks.query).not.toHaveBeenCalled()
  })
})
