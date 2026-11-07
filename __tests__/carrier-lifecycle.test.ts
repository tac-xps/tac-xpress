import crypto from "node:crypto"
import { beforeEach, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
const mocks = vi.hoisted(() => ({ query: vi.fn(), mutate: vi.fn() }))
vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({ from: () => ({ where: () => ({ limit: mocks.query }) }) }),
    transaction: mocks.mutate,
    insert: mocks.mutate,
    update: mocks.mutate,
  },
}))
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }))
import { POST } from "@/app/api/webhooks/carrier/route"
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("CARRIER_WEBHOOK_SECRET", "synthetic-carrier-secret")
})
function request(status: string, signatureValid = true) {
  const body = JSON.stringify({ awbNumber: "SYNTHETIC-AWB", status })
  const signature = crypto
    .createHmac(
      "sha256",
      signatureValid ? "synthetic-carrier-secret" : "wrong-secret"
    )
    .update(body)
    .digest("hex")
  return new NextRequest("http://localhost/api/webhooks/carrier", {
    method: "POST",
    body,
    headers: { "x-carrier-signature": signature },
  })
}
it("rejects a correctly signed carrier delivery that lacks manifest receipt evidence", async () => {
  mocks.query.mockResolvedValue([{ id: "synthetic", status: "in-transit" }])
  expect((await POST(request("delivered"))).status).toBe(409)
  expect(mocks.mutate).not.toHaveBeenCalled()
})
it("acknowledges a repeated status without duplicating tracking or customer notifications", async () => {
  mocks.query.mockResolvedValue([{ id: "synthetic", status: "in-transit" }])
  const result = await POST(request("in-transit"))
  expect(result.status).toBe(200)
  expect(await result.json()).toEqual({ success: true, duplicate: true })
  expect(mocks.mutate).not.toHaveBeenCalled()
})
it("rejects an invalid signature before reading customer data", async () => {
  expect((await POST(request("delivered", false))).status).toBe(401)
  expect(mocks.query).not.toHaveBeenCalled()
})
