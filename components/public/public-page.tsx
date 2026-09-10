import type { ReactNode } from "react"
import { SiteNavigation } from "./site-navigation"
import { SiteFooter } from "./site-footer"
export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div className="cargo-public min-h-svh bg-background text-foreground">
      <SiteNavigation />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  )
}
