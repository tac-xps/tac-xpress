import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  ArcjetAllowDecision,
  ArcjetDenyDecision,
  ArcjetErrorDecision,
  ArcjetErrorReason,
  ArcjetReason,
  ArcjetRuleResult,
  type createRemoteClient,
} from "@arcjet/next"
import { CredentialsSignin } from "next-auth"

const mocks = vi.hoisted(() => ({
  decide: vi.fn<ReturnType<typeof createRemoteClient>["decide"]>(),
  report: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  signIn: vi.fn(),
}))

vi.mock("server-only", () => ({}))
vi.mock("@/auth", () => ({ signIn: mocks.signIn }))
vi.mock("next-auth", async () => {
  // Load Auth.js's real error classes without its Next.js runtime entrypoint,
  // whose extensionless server imports require the Next.js bundler.
  const { createRequire } = await import("node:module")
  const { pathToFileURL } = await import("node:url")
  const resolve = createRequire(import.meta.url).resolve
  return import(
    pathToFileURL(
      resolve("@auth/core/errors", { paths: [resolve("next-auth")] })
    ).href
  )
})
vi.mock("@sentry/nextjs", () => ({
  captureException: mocks.captureException,
  captureMessage: mocks.captureMessage,
}))
vi.mock("@arcjet/next", async (importOriginal) => {
  const sdk = await importOriginal<typeof import("@arcjet/next")>()
  return {
    ...sdk,
    // Exercise the real request normalization and fingerprint generation;
    // only the remote service is replaced, so these tests never use the network.
    default: (options: Parameters<typeof sdk.default>[0]) =>
      sdk.default({
        ...options,
        key: "ajkey_test",
        client: { decide: mocks.decide, report: mocks.report },
        log: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
      }),
  }
})

const { allowCredentialAttempt } =
  await import("@/lib/auth/credential-rate-limit")
const { loginAction } = await import("@/app/(auth)/signin/actions")

function request() {
  return new Request("https://workspace.example.com/signin", {
    method: "POST",
    headers: { "x-forwarded-for": "8.8.8.8" },
  })
}

function submitLogin() {
  const formData = new FormData()
  formData.set("email", "operator@example.com")
  formData.set("password", "valid-test-password")
  return loginAction(undefined, formData)
}

describe("credential attempt protection", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.decide.mockResolvedValue(
      new ArcjetAllowDecision({
        ttl: 0,
        reason: new ArcjetReason(),
        results: [],
      })
    )
    mocks.signIn.mockImplementation(() =>
      allowCredentialAttempt(request(), "operator@example.com")
    )
  })

  it("builds an account fingerprint and reaches the rate-limit service", async () => {
    await expect(
      allowCredentialAttempt(request(), "operator@example.com")
    ).resolves.toBe(true)
    expect(mocks.decide).toHaveBeenCalledOnce()
    expect(mocks.decide.mock.calls[0][0].fingerprint).toEqual(
      expect.any(String)
    )
    expect(mocks.decide.mock.calls[0][0].fingerprint).not.toBe("")
  })

  it("keeps each account in its own stable rate-limit bucket", async () => {
    await allowCredentialAttempt(request(), "first@example.com")
    await allowCredentialAttempt(request(), "first@example.com")
    await allowCredentialAttempt(request(), "second@example.com")
    const fingerprints = mocks.decide.mock.calls.map(
      ([context]) => context.fingerprint
    )
    expect(fingerprints[0]).toBe(fingerprints[1])
    expect(fingerprints[0]).not.toBe(fingerprints[2])
  })

  it("reports exhausted attempts without claiming the password is wrong", async () => {
    mocks.decide.mockResolvedValue(
      new ArcjetDenyDecision({
        ttl: 0,
        reason: new ArcjetReason(),
        results: [],
      })
    )
    await expect(submitLogin()).resolves.toEqual({
      error: "Too many sign-in attempts. Please try again later.",
    })
  })

  it("fails closed and reports a protection service error", async () => {
    mocks.decide.mockResolvedValue(
      new ArcjetErrorDecision({
        ttl: 0,
        reason: new ArcjetErrorReason("Service unavailable"),
        results: [],
      })
    )
    await expect(submitLogin()).resolves.toEqual({
      error: "Sign-in is temporarily unavailable. Please try again shortly.",
    })
    expect(mocks.captureMessage).toHaveBeenCalledWith(
      "Credential rate-limit check failed",
      expect.objectContaining({ tags: { area: "credential_rate_limit" } })
    )
  })

  it("rejects an aggregate allow decision when its rate-limit rule errors", async () => {
    mocks.decide.mockResolvedValue(
      new ArcjetAllowDecision({
        ttl: 0,
        reason: new ArcjetReason(),
        results: [
          new ArcjetRuleResult({
            ruleId: "credential-limit",
            fingerprint: "",
            ttl: 0,
            state: "RUN",
            conclusion: "ERROR",
            reason: new ArcjetErrorReason("Rule unavailable"),
          }),
        ],
      })
    )
    await expect(submitLogin()).resolves.toEqual({
      error: "Sign-in is temporarily unavailable. Please try again shortly.",
    })
  })

  it("fails closed when the protection service cannot be reached", async () => {
    mocks.decide.mockRejectedValue(new Error("Connection unavailable"))
    await expect(submitLogin()).resolves.toEqual({
      error: "Sign-in is temporarily unavailable. Please try again shortly.",
    })
  })

  it("keeps actual credential failures generic", async () => {
    mocks.signIn.mockRejectedValue(new CredentialsSignin())
    await expect(submitLogin()).resolves.toEqual({
      error: "Invalid email or password.",
    })
  })

  it("preserves the successful Next.js redirect", async () => {
    const redirect = new Error("NEXT_REDIRECT")
    mocks.signIn.mockRejectedValue(redirect)
    await expect(submitLogin()).rejects.toBe(redirect)
  })
})
