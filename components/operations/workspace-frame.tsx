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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>
        <AppSidebar userRole={userRole} />
        <div className="flex min-w-0 flex-1 flex-col transition-colors duration-300">
          {banner}
          {header}
          <main
            id="main-content"
            tabIndex={-1}
            className="isolate relative min-w-0 flex-1 p-5 sm:p-6 lg:p-8 xl:p-10"
          >
            <div className="relative mx-auto flex w-full max-w-[1536px] min-w-0 flex-col gap-6 md:gap-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
