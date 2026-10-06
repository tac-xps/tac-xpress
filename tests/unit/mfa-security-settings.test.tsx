// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"

const { getMfaSettingsAction, capture, captureException } = vi.hoisted(() => ({
  getMfaSettingsAction: vi.fn(),
  capture: vi.fn(),
  captureException: vi.fn(),
}))

vi.mock("@/app/actions/mfa-actions", () => ({
  getMfaSettingsAction,
  startTotpSetupAction: vi.fn(),
  confirmTotpSetupAction: vi.fn(),
  disableTotpAction: vi.fn(),
  startPasskeyRegistrationAction: vi.fn(),
  finishPasskeyRegistrationAction: vi.fn(),
  deletePasskeyAction: vi.fn(),
}))
vi.mock("posthog-js", () => ({ default: { capture } }))
vi.mock("@sentry/nextjs", () => ({ captureException }))

import { MfaSecuritySettings } from "@/components/operations/mfa-security-settings"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe("MfaSecuritySettings load failure", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it("replaces the spinner with an error and a retry button when the load throws", async () => {
    getMfaSettingsAction.mockRejectedValueOnce(
      new Error('column "totp_pending_secret_encrypted" does not exist'),
    )

    await act(async () => {
      root.render(<MfaSecuritySettings />)
    })

    expect(container.querySelector(".animate-spin")).toBeNull()
    expect(container.textContent).toContain("Security settings could not load")
    expect(container.textContent).not.toContain("totp_pending_secret_encrypted")
    expect(container.textContent).not.toContain("Set up app")
    expect(captureException).toHaveBeenCalledOnce()
    expect(capture).toHaveBeenCalledWith("mfa_settings_load_failed", {
      error: "Security settings could not load. Try again later.",
    })

    getMfaSettingsAction.mockResolvedValueOnce({
      totpEnabled: true,
      hasBackupCodes: true,
      passkeys: [],
    })
    const retry = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Try again"),
    )
    await act(async () => {
      retry?.click()
    })

    expect(container.textContent).not.toContain("Security settings unavailable")
    expect(container.textContent).toContain("Active")
  })

  it("shows the error returned by the action", async () => {
    getMfaSettingsAction.mockResolvedValueOnce({ error: "Unauthorized access." })

    await act(async () => {
      root.render(<MfaSecuritySettings />)
    })

    expect(container.querySelector(".animate-spin")).toBeNull()
    expect(container.textContent).toContain("Unauthorized access.")
    expect(captureException).not.toHaveBeenCalled()
  })
})
