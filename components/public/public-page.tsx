import type { ReactNode } from "react"
import { SiteNavigation } from "./site-navigation"
import { SiteFooter } from "./site-footer"
export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div className="cargo-public min-h-svh w-full max-w-full overflow-x-clip bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-none focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>
      <SiteNavigation />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  )
}
