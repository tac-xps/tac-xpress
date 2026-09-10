"use client"

import React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationDropdown } from "./notification-dropdown"
import { UserDropdown } from "./user-dropdown"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center gap-3 border-b bg-card px-4 md:px-6">
      <a href="#tour-main-content" className="sr-only focus:not-sr-only">Skip to workspace</a>
      <SidebarTrigger className="-ml-2 md:h-10 md:w-10" />
      <div className="flex flex-1 items-center gap-4">
        <form action="/dashboard/tracking" method="get" className="hidden w-full max-w-sm md:block" id="tour-search">
          <div className="relative">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              name="awb"
              aria-label="Find a shipment by AWB"
              placeholder="Find a shipment by AWB…"
              maxLength={40}
              className="w-full pl-9"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeSwitcher />
        <NotificationDropdown />
        <div id="tour-user-menu">
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
