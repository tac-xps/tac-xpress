// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, type ComponentProps } from "react"
import { createRoot, type Root } from "react-dom/client"
import { LandingNav } from "@/components/public/landing/landing-nav"
import { MorphicNavbar } from "@/components/kokonutui/morphic-navbar"

vi.mock("next/link", () => ({
  default: ({
    prefetch: _prefetch,
    children,
    ...props
  }: ComponentProps<"a"> & { prefetch?: boolean }) => (
    <a {...props}>{children}</a>
  ),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

vi.mock("@/components/ui/theme-toggle", () => ({
  ThemeToggle: () => <button type="button" aria-label="Toggle theme">Toggle</button>,
}))

vi.mock("@/components/public/track-shipment-modal", () => ({
  TrackShipmentModal: ({ open }: { open: boolean }) => (
    <div data-testid="track-modal" data-open={String(open)} />
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

describe("LandingNav", () => {
  it("renders the brand logo without navigation corridor badge clutter", async () => {
    root = createRoot(container)
    await act(async () => root?.render(<LandingNav />))

    const brand = container.querySelector('a[aria-label="TAC-XPRESS home"]')
    expect(brand).not.toBeNull()
    expect(brand?.textContent).toContain("TAC-XPRESS")
  })

  it("renders desktop action buttons for consignment booking and tracking", async () => {
    root = createRoot(container)
    await act(async () => root?.render(<LandingNav />))

    const bookBtn = container.querySelector('a[href="#contact"]')
    expect(bookBtn).not.toBeNull()
    expect(bookBtn?.textContent).toContain("Book Consignment")

    const trackBtn = container.querySelector("button")
    expect(trackBtn).not.toBeNull()
  })

  it("renders the MorphicNavbar with zero bounce and all corridor links", async () => {
    root = createRoot(container)
    await act(async () =>
      root?.render(
        <MorphicNavbar
          items={{
            "#features": { name: "Features" },
            "#services": { name: "Services" },
            "#method": { name: "Method" },
          }}
          defaultPath="#features"
        />
      )
    )

    const nav = container.querySelector('nav[aria-label="Corridor navigation"]')
    expect(nav).not.toBeNull()

    const links = container.querySelectorAll("nav a")
    expect(links.length).toBe(3)
    expect(links[0]?.getAttribute("href")).toBe("#features")
    expect(links[0]?.getAttribute("aria-current")).toBe("location")
  })
})
