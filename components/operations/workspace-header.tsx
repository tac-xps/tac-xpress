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
export function WorkspaceHeader({ children }: { children: ReactNode }) {
  const title = workspacePageTitle(usePathname())
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs px-4 sm:gap-3 sm:px-6 transition-colors">
      <a href="#tour-main-content" className="sr-only focus:not-sr-only">
        Skip to workspace
      </a>
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5!" />
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
