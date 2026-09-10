import { afterEach, describe, expect, it, vi } from "vitest"
import { verifyMobileClient } from "@/lib/auth/verify-mobile-client"
afterEach(() => vi.unstubAllEnvs())
describe("mobile integration authentication", () => {
  it("fails closed when the secret or bearer token is empty", () => {
    vi.stubEnv("MOBILE_API_SECRET", "")
    expect(verifyMobileClient(new Request("https://example.test", { headers: { authorization: "Bearer " } }))?.status).toBe(401)
    vi.stubEnv("MOBILE_API_SECRET", "configured-secret")
    expect(verifyMobileClient(new Request("https://example.test"))?.status).toBe(401)
  })
  it("accepts only the exact configured credential", () => {
    vi.stubEnv("MOBILE_API_SECRET", "configured-secret")
    expect(verifyMobileClient(new Request("https://example.test", { headers: { authorization: "Bearer configured-secret" } }))).toBeNull()
    expect(verifyMobileClient(new Request("https://example.test", { headers: { authorization: "Bearer invalid-credential" } }))?.status).toBe(401)
  })
})
