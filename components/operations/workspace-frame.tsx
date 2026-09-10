"use client"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export function WorkspaceFrame({
  children,
  header,
  banner,
  userRole,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  header: ReactNode
  banner?: ReactNode
  userRole?: string
}) {
  return (
    <SidebarProvider>
      <div
        className={cn("flex min-h-svh w-full bg-background", className)}
        {...props}
      >
        <AppSidebar userRole={userRole} />
        <div className="flex min-w-0 flex-1 flex-col transition-colors duration-300">
          {banner}
          {header}
          <main
            id="tour-main-content"
            tabIndex={-1}
            className="relative min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
          >
            <div className="relative mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
