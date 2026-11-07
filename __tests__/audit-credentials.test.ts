import { describe, expect, it, vi } from "vitest"
import { PgDialect } from "drizzle-orm/pg-core"
import type { SQL } from "drizzle-orm"

vi.mock("@/lib/supabase/clients", () => ({ supabaseAdmin: {} }))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
import { logAuditInTransaction } from "@/lib/audit"

describe("audit credential boundary", () => {
  it("redacts legacy password fields while preserving before and after roles", async () => {
    const execute = vi.fn(async (_query: SQL) => undefined)
    await logAuditInTransaction(
      { execute },
      {
        action: "update",
        entity: "users",
        before: { role: "staff", password: "synthetic-legacy-hash" },
        after: { role: "admin", password: "synthetic-legacy-hash" },
      }
    )
    const call = execute.mock.calls[0]
    if (!call) throw new Error("Expected a transactional audit insert")
    const params = JSON.stringify(new PgDialect().sqlToQuery(call[0]).params)
    expect(params).not.toContain("synthetic-legacy-hash")
    expect(params).toContain("[REDACTED]")
    expect(params).toContain("staff")
    expect(params).toContain("admin")
  })
})
