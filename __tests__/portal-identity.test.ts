import { describe, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ user: vi.fn(), send: vi.fn(), logout: vi.fn() }))
vi.mock("@/app/actions/auth", () => ({ getCurrentUser: mocks.user, sendMagicLink: mocks.send, logoutUser: mocks.logout }))
const { verifyPortalSession, authenticatePortalAccess } = await import("@/app/actions/portal-auth")
describe("retired customer portal", () => {
  it("never authorizes a customer, including an existing verified legacy identity", async () => {
    mocks.user.mockResolvedValue({ email: "customer@example.com", email_confirmed_at: "2026-09-07" })
    expect(await verifyPortalSession()).toBeNull()
    expect(mocks.user).not.toHaveBeenCalled()
  })
  it("does not send a magic link or accept AWB plus email as staff credentials", async () => {
    const form = new FormData()
    form.set("email", "customer@example.com")
    form.set("awb_number", "KNOWN-AWB")
    expect(await authenticatePortalAccess(form)).toHaveProperty("error")
    expect(mocks.send).not.toHaveBeenCalled()
  })
})

