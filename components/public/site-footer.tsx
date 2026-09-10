// Adapted from @tailark-oss/veil-footer-1; see docs/UI-SOURCES.md.
import Link from "next/link"
import { Logo } from "@/components/logo"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
const groups = [
  {
    label: "Send with us",
    links: [
      ["Air cargo", "/services/air-cargo"],
      ["Surface cargo", "/services/surface-cargo"],
      ["Request a quote", "/contact"],
    ],
  },
  {
    label: "Useful information",
    links: [
      ["Shipping guide", "/shipping-guide"],
      ["Track a shipment", "/track"],
      ["Questions & answers", "/shipping-guide#faq-title"],
    ],
  },
  {
    label: "TAC-XPRESS",
    links: [
      ["About us", "/about"],
      ["Contact our team", "/contact"],
      ["Share feedback", "/feedback"],
    ],
  },
]
export function SiteFooter() {
  return (
    <footer className="cargo-inverse border-t bg-background py-12 lg:pt-20">
      <div className="cargo-container">
        <div className="mb-14 flex flex-col justify-between gap-6 border-b pb-12 md:flex-row md:items-end">
          <p className="cargo-heading max-w-2xl">
            Let’s move
            <br />
            something forward.
          </p>
          <Button asChild size="lg" className="w-fit px-4">
            <Link href="/contact">
              Start a conversation <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-full lg:col-span-2">
            <Link href="/" aria-label="TAC-XPRESS home">
              <Logo className="h-7 w-fit" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Connecting New Delhi and Northeast India through thoughtful air
              and surface cargo services.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              Your goods. Our shared responsibility.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-4 text-sm font-medium">{group.label}</h3>
              <ul className="flex flex-col gap-3">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TAC-XPRESS. All rights reserved.
          </p>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms & conditions
          </Link>
          <Link href="/signin" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
            Staff access
          </Link>
        </div>
      </div>
    </footer>
  )
}
