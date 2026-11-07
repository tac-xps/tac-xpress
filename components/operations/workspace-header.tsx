"use client"
import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { workspacePageTitle } from "./navigation"
import { LogoMark } from "@/components/logo"
export function WorkspaceHeader({ children }: { children: ReactNode }) {
  const title = workspacePageTitle(usePathname())
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs px-4 sm:gap-3 sm:px-6 transition-colors">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5!" />
      <Link href="/dashboard" aria-label="TAC-XPRESS operations" className="md:hidden flex items-center shrink-0">
        <div className="flex size-9 shrink-0 items-center justify-center border border-border/80 bg-muted/40 text-primary">
          <LogoMark className="size-6.5! text-primary" />
        </div>
      </Link>
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem className="hidden lg:block">
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Workspace</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden lg:block" />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </header>
  )
}
