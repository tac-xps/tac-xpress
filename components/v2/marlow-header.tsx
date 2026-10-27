"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MarlowCommandDialog } from "./marlow-command-dialog"
import { MorphicNavbar, type NavItem } from "@/components/kokonutui/morphic-navbar"
import { Sparkles, Radio } from "lucide-react"

const V2_NAV_ITEMS: Record<string, NavItem> = {
  "/v2": { name: "Overview" },
  "/v2#telemetry": { name: "Telemetry" },
  "/v2#features": { name: "Features" },
  "/v2#pricing": { name: "Pricing" },
  "/v2#fieldnotes": { name: "Fieldnotes" },
  "/v2/work": { name: "Work" },
  "/v2/about": { name: "About" },
  "/v2/contact": { name: "Contact" },
}

export function MarlowHeader() {
  const pathname = usePathname()
  const [commandOpen, setCommandOpen] = React.useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F4F1E9]/90 border-b border-[rgba(20,20,19,0.06)] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/v2"
              className="group flex items-center gap-2.5 text-[#141413] hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 bg-[#141413] text-[#FAFAF8] flex items-center justify-center font-serif text-xs font-semibold tracking-tighter shadow-xs">
                M
              </div>
              <span className="font-medium text-sm tracking-tight font-serif text-[#141413]">
                Marlow
              </span>
            </Link>

            <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 bg-[#1F9A55]/10 text-[#1F9A55] text-[10px] font-mono font-medium">
              <span className="w-1.5 h-1.5 bg-[#1F9A55] animate-pulse" />
              <span>DEL ⇄ IMF Active</span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center max-w-xl">
            <MorphicNavbar
              items={V2_NAV_ITEMS}
              defaultPath={pathname}
              compact={true}
              className="scale-90 lg:scale-95 origin-center shadow-none border-[rgba(20,20,19,0.08)] bg-[#FAFAF8]/90"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[rgba(20,20,19,0.12)] bg-[#FAFAF8] hover:bg-white text-[#141413]/70 hover:text-[#141413] text-[11px] font-mono transition-all shadow-xs"
              title="Track consignment or search commands (⌘K)"
              aria-label="Search and AWB Tracking"
            >
              <span>Track / ⌘K</span>
              <kbd className="px-1 py-0.2 rounded-none bg-[rgba(20,20,19,0.06)] text-[10px] text-[#141413]/60 hidden sm:inline">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="p-1.5 hover:bg-[rgba(20,20,19,0.06)] text-[#141413]/60 hover:text-[#141413] transition-colors"
              title="Quick actions & AWB shortcuts"
              aria-label="Quick actions"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <MarlowCommandDialog open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  )
}
