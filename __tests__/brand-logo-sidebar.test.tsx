// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { Logo, LogoMark } from "@/components/logo"
import { AppSidebar } from "@/components/operations/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}))

vi.mock("next/link", () => ({
  default: ({
    children,
    prefetch: _prefetch,
    ...props
  }: React.ComponentProps<"a"> & { prefetch?: boolean }) => (
    <a {...props}>{children}</a>
  ),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let container: HTMLDivElement
let root: Root | undefined

beforeEach(() => {
  container = document.createElement("div")
  document.body.append(container)
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      matches: false,
      media,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  )
})

afterEach(async () => {
  if (root) await act(async () => root?.unmount())
  root = undefined
  container.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("Brand Identity & Sidebar Header", () => {
  it("renders the Velocity Spear X LogoMark with industrial straight-line polygons", async () => {
    root = createRoot(container)
    await act(async () => root?.render(<LogoMark animated={false} />))

    const svg = container.querySelector("svg")
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute("viewBox")).toBe("0 0 36 36")

    // Verify presence of straight-line polygons (zero curved paths)
    const polygons = container.querySelectorAll("polygon")
    expect(polygons.length).toBeGreaterThanOrEqual(4)
  })

  it("renders full Logo with wordmark and accessible label", async () => {
    root = createRoot(container)
    await act(async () => root?.render(<Logo animated={false} />))

    const srOnly = container.querySelector(".sr-only")
    expect(srOnly?.textContent).toBe("TAC-XPRESS")
    expect(container.textContent).toContain("TAC")
    expect(container.textContent).toContain("XPRESS")
  })

  it("renders AppSidebar header without DEL ⇄ IMF clutter", async () => {
    root = createRoot(container)
    await act(async () =>
      root?.render(
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar userRole="admin" />
          </SidebarProvider>
        </TooltipProvider>
      )
    )

    const sidebarHeader = container.querySelector("#tour-sidebar [data-sidebar='header']")
    expect(sidebarHeader).not.toBeNull()

    // Assert absence of DEL ⇄ IMF in sidebar heading
    expect(sidebarHeader?.textContent).not.toContain("DEL ⇄ IMF")
    expect(sidebarHeader?.textContent).not.toContain("DEL <-> IMF")
    expect(sidebarHeader?.textContent).not.toContain("DEL")

    // Assert presence of professional freight identity
    expect(sidebarHeader?.textContent).toContain("TAC")
    expect(sidebarHeader?.textContent).toContain("XPRESS")
    expect(sidebarHeader?.textContent).toContain("Freight Operations")
  })
})
