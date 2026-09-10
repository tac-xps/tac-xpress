import { afterEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({ from: vi.fn(), audit: vi.fn() }))
vi.mock("server-only", () => ({}))
vi.mock("@/lib/supabase/clients", () => ({
  supabaseAdmin: { from: mocks.from },
}))
vi.mock("@/lib/audit", () => ({ logAudit: mocks.audit }))

const { applySLA } = await import("@/app/actions/sla")

describe("SLA retries", () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it("keeps response deadlines anchored to receipt when triage runs again later", async () => {
    vi.useFakeTimers()
    const update = vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }))
    const policyQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: "policy",
          category: "tracking",
          first_response_minutes: 30,
          resolution_minutes: 120,
        },
        error: null,
      }),
    }
    mocks.from.mockImplementation((table: string) =>
      table === "sla_policies"
        ? policyQuery
        : {
            update,
            select: () => ({
              eq: () => ({
                single: async () => ({
                  data: { created_at: "2026-09-07T10:00:00Z" },
                  error: null,
                }),
              }),
            }),
          }
    )
    vi.setSystemTime(new Date("2026-09-07T10:01:00Z"))
    await applySLA("ticket", "high", "tracking")
    vi.setSystemTime(new Date("2026-09-07T11:00:00Z"))
    await applySLA("ticket", "high", "tracking")
    expect(update.mock.calls).toEqual([
      [
        {
          sla_deadline_first_response: "2026-09-07T10:30:00.000Z",
          sla_deadline_resolution: "2026-09-07T12:00:00.000Z",
          assigned_team: "tracking",
        },
      ],
      [
        {
          sla_deadline_first_response: "2026-09-07T10:30:00.000Z",
          sla_deadline_resolution: "2026-09-07T12:00:00.000Z",
          assigned_team: "tracking",
        },
      ],
    ])
    expect(policyQuery.order).toHaveBeenCalledWith("category", {
      ascending: false,
      nullsFirst: false,
    })
  })

  it("fails for retry when policy lookup is unavailable instead of silently losing the SLA", async () => {
    const query = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi
        .fn()
        .mockResolvedValue({
          data: null,
          error: new Error("Database unavailable"),
        }),
    }
    mocks.from.mockReturnValue(query)
    await expect(applySLA("ticket", "high", "tracking")).rejects.toThrow(
      "Database unavailable"
    )
    expect(mocks.audit).not.toHaveBeenCalled()
  })
})
