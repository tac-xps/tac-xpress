import { beforeEach, expect, it, vi } from "vitest"
const mocks = vi.hoisted(() => ({ protect: vi.fn() }))
vi.mock("server-only", () => ({}))
vi.mock("next-auth", () => ({
  CredentialsSignin: class CredentialsSignin extends Error {
    code = "credentials"
  },
}))
vi.mock("@arcjet/next", () => ({
  default: () => ({ protect: mocks.protect }),
  createRemoteClient: () => ({}),
  slidingWindow: vi.fn(),
}))
vi.mock("@/lib/auth/token-consumption", () => ({ consumeAuthToken: vi.fn() }))
vi.mock("@sentry/nextjs", () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}))
import { allowCredentialAttempt } from "@/lib/auth/credential-rate-limit"
const request = new Request("https://synthetic.invalid/signin")
beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv("NODE_ENV", "production")
})
it("rejects sign-in when the protection service throws a network timeout", async () => {
  mocks.protect.mockRejectedValue(new Error("deadline_exceeded: timeout"))
  await expect(
    allowCredentialAttempt(request, "synthetic@example.test")
  ).rejects.toMatchObject({ code: "protection_unavailable" })
})
it("rejects sign-in when the protection decision reports a timeout", async () => {
  mocks.protect.mockResolvedValue({
    isErrored: () => true,
    reason: { message: "deadline_exceeded timeout" },
    results: [],
    id: "synthetic",
  })
  await expect(
    allowCredentialAttempt(request, "synthetic@example.test")
  ).rejects.toMatchObject({ code: "protection_unavailable" })
})
it("retains a valid allowed decision", async () => {
  mocks.protect.mockResolvedValue({
    isErrored: () => false,
    isDenied: () => false,
    isAllowed: () => true,
    results: [],
  })
  await expect(
    allowCredentialAttempt(request, "synthetic@example.test")
  ).resolves.toBe(true)
})
