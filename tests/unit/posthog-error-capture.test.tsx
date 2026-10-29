// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest"
import { act } from "react"
import { createRoot } from "react-dom/client"

const { posthogInit, posthogCaptureException, sentryCaptureException } = vi.hoisted(() => ({
  posthogInit: vi.fn(),
  posthogCaptureException: vi.fn(),
  sentryCaptureException: vi.fn(),
}))

vi.mock("posthog-js", () => ({
  default: {
    init: posthogInit,
    onSessionId: vi.fn(),
    captureException: posthogCaptureException,
  },
}))
vi.mock("@sentry/nextjs", () => ({
  init: vi.fn(),
  replayIntegration: vi.fn(),
  browserTracingIntegration: vi.fn(),
  captureRouterTransitionStart: vi.fn(),
  setTag: vi.fn(),
  captureException: sentryCaptureException,
}))

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe("PostHog error capture", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("loads PostHog in instrumentation-client, before any React render", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test")
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com")

    await import("@/instrumentation-client")

    expect(posthogInit).toHaveBeenCalledWith("phc_test", expect.any(Object))
  })

  it("sends a manifests crash to PostHog with the server digest", async () => {
    const { default: ManifestsError } = await import("@/app/dashboard/manifests/error")
    const error = Object.assign(new Error("render failed"), { digest: "115732306" })
    const container = document.createElement("div")
    const root = createRoot(container)

    await act(async () => {
      root.render(<ManifestsError error={error} reset={() => {}} />)
    })

    expect(sentryCaptureException).toHaveBeenCalledWith(error, expect.any(Object))
    expect(posthogCaptureException).toHaveBeenCalledWith(error, { digest: "115732306" })
    act(() => root.unmount())
  })
})
