import { afterEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  init: vi.fn(),
  replay: vi.fn(() => ({ name: "Replay" })),
}))

vi.mock("@sentry/nextjs", () => ({
  init: mocks.init,
  replayIntegration: mocks.replay,
  browserTracingIntegration: () => ({ name: "BrowserTracing" }),
  captureRouterTransitionStart: vi.fn(),
}))

vi.mock("posthog-js", () => ({
  default: { init: vi.fn(), onSessionId: vi.fn() },
}))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe("browser Sentry privacy settings", () => {
  it.each([undefined, "false"])("keeps replay disabled with flag %s", async (flag) => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_REPLAY_ENABLED", flag)
    vi.resetModules()
    await import("@/instrumentation-client")

    expect(mocks.replay).not.toHaveBeenCalled()
    expect(mocks.init).toHaveBeenCalledWith(expect.objectContaining({
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      sendDefaultPii: false,
    }))
  })

  it("masks opted-in replay while keeping default PII off", async () => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_REPLAY_ENABLED", "true")
    vi.resetModules()
    await import("@/instrumentation-client")

    expect(mocks.replay).toHaveBeenCalledWith({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    })
    expect(mocks.init).toHaveBeenCalledWith(expect.objectContaining({
      integrations: expect.arrayContaining([{ name: "Replay" }]),
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 0.5,
      sendDefaultPii: false,
    }))
  })
})
