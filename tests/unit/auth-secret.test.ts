import { afterEach, describe, expect, it, vi } from "vitest"

import { getConfiguredAuthSecret, resolveAuthSecret } from "@/lib/auth/secret"

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe("auth secret resolution", () => {
  it("prefers AUTH_SECRET when present", () => {
    vi.stubEnv("AUTH_SECRET", "primary-secret")
    vi.stubEnv("NEXTAUTH_SECRET", "compat-secret")

    expect(getConfiguredAuthSecret()).toBe("primary-secret")
    expect(resolveAuthSecret()).toBe("primary-secret")
  })

  it("falls back to NEXTAUTH_SECRET as a compatibility alias", () => {
    vi.stubEnv("NEXTAUTH_SECRET", "compat-secret")
    // Ensure AUTH_SECRET is not set
    vi.stubEnv("AUTH_SECRET", "")

    expect(getConfiguredAuthSecret()).toBe("compat-secret")
    expect(resolveAuthSecret()).toBe("compat-secret")
  })

  it("throws in production when no secret is configured", () => {
    vi.stubEnv("AUTH_SECRET", "")
    vi.stubEnv("NEXTAUTH_SECRET", "")
    vi.stubEnv("NODE_ENV", "production")

    expect(() => resolveAuthSecret()).toThrow(/Missing AUTH_SECRET/i)
  })
})
