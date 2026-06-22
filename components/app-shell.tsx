"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import { AppSidebar } from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar"
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SystemBanner } from "@/components/system-banner"

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  userRole?: any
}

export function AppShell({
  children,
  className,
  userRole,
  ...props
}: AppShellProps) {
  return (
    <SidebarProvider>
      <div
        className={cn(
          "flex h-screen w-full overflow-hidden bg-app-canvas",
          className
        )}
        {...props}
      >
        <AppSidebar userRole={userRole} />
        <div className="flex w-full flex-1 flex-col overflow-hidden">
          <SystemBanner />
          <SiteHeader />
          <main
            id="tour-main-content"
            className="relative flex-1 overflow-y-auto p-4 sm:p-6 md:p-8"
          >
            <div className="relative mx-auto w-full max-w-[1600px] space-y-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
