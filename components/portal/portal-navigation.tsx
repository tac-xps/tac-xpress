"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, MapPin, ReceiptText, MessagesSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/portal/track", label: "Tracking", icon: MapPin },
  { href: "/portal/shipments", label: "Shipments", icon: Package },
  { href: "/portal/invoices", label: "Invoices", icon: ReceiptText },
  { href: "/portal/tickets", label: "Support", icon: MessagesSquare },
]

export function PortalNavigation() {
  const pathname = usePathname()
  return <nav aria-label="Customer portal" className="flex w-full gap-1 overflow-x-auto border-t py-2">
    {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={cn("flex min-h-11 shrink-0 items-center gap-2 rounded-none px-3 text-sm font-medium transition-colors hover:bg-accent", pathname === href ? "bg-accent text-accent-foreground" : "text-muted-foreground")}><Icon className="size-4" aria-hidden="true" />{label}</Link>)}
  </nav>
}
