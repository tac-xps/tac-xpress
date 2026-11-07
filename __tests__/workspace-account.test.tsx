// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"

vi.mock("server-only", () => ({}))

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}))

vi.mock("@/app/actions/auth", () => ({
  logoutUser: vi.fn(),
}))

vi.mock("@/components/operations/account-settings", () => ({
  AccountSettings: () => null,
}))

import { WorkspaceAccount } from "@/components/operations/workspace-account"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root

class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  )
  vi.stubGlobal("ResizeObserver", MockResizeObserver)
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("WorkspaceAccount with ProfileDropdown", () => {
  it("renders the account trigger with user details", async () => {
    await act(async () =>
      root.render(
        <WorkspaceAccount
          user={{
            id: "user-1",
            name: "TAC Admin",
            email: "admin@tacxpress.in",
            role: "Admin",
          }}
        />
      )
    )

    const menu = container.querySelector("#tour-user-menu")
    expect(menu).toBeTruthy()
    const trigger = container.querySelector("button[aria-haspopup='menu']")
    expect(trigger).toBeTruthy()
    expect(trigger?.getAttribute("aria-label")).toContain("TAC Admin")
    expect(trigger?.textContent).toContain("TA")
  })

  it("opens the morphing profile dropdown menu on click", async () => {
    await act(async () =>
      root.render(
        <WorkspaceAccount
          user={{
            id: "user-1",
            name: "TAC Admin",
            email: "admin@tacxpress.in",
            role: "Admin",
          }}
        />
      )
    )

    const triggerButton = container.querySelector("button[aria-haspopup='menu']")
    expect(triggerButton).toBeTruthy()

    await act(async () => {
      triggerButton?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 })
      )
    })

    expect(container.textContent).toContain("Account & preferences")
    expect(container.textContent).toContain("Public website")
    expect(container.textContent).toContain("Sign out")
    expect(container.textContent).toContain("Status")
    expect(container.textContent).toContain("Theme")
    expect(container.textContent).toContain("Switch account")
  })
})
