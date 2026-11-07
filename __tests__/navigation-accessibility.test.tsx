// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, type ComponentProps } from "react"
import { createRoot, type Root } from "react-dom/client"
import { AppSidebar } from "@/components/operations/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

vi.mock("next/link", () => ({
  default: ({
    prefetch,
    ...props
  }: ComponentProps<"a"> & { prefetch?: boolean }) => (
    <a {...props} data-prefetch={String(prefetch)} />
  ),
}))
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/shipments",
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root

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

describe("staff sidebar capabilities", () => {
  it.each(["staff", "admin", "customer", ""])(
    "shows only permitted navigation for role %s",
    async (role) => {
      await act(async () =>
        root.render(
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar userRole={role} />
            </SidebarProvider>
          </TooltipProvider>
        )
      )
      const staff = container.querySelector('a[href="/dashboard/staff"]')
      const jobs = container.querySelector('a[href="/dashboard/jobs"]')
      expect(Boolean(staff)).toBe(role === "admin")
      expect(Boolean(jobs)).toBe(role === "admin")
      expect(
        Boolean(container.querySelector('a[href="/dashboard/shipments"]'))
      ).toBe(role === "admin" || role === "staff")
      const links = [...container.querySelectorAll("a[href]")]
      expect(links.length).toBeGreaterThan(0)
      expect(
        links.every((link) => link.getAttribute("data-prefetch") === "false")
      ).toBe(true)
    }
  )
})
