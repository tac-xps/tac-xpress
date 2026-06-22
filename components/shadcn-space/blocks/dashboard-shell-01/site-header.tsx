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
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/78 px-4 shadow-2xs backdrop-blur-2xl md:px-6">
      <SidebarTrigger className="-ml-2 md:h-10 md:w-10" />
      <div className="flex flex-1 items-center gap-4">
        <form className="hidden w-full max-w-sm md:block" id="tour-search">
          <div className="relative">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search AWBs, Routes, or Dispatchers..."
              className="w-full border-border/70 bg-card/75 pl-9 shadow-none md:w-[300px] lg:w-[400px]"
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
