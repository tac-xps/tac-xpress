"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export type NavItem = {
  title: string
  url: string
  icon?: React.ElementType
  isActive?: boolean
  items?: {
    title: string
    url: string
    icon?: React.ElementType
  }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <>
      {items.map((group) => (
        <SidebarGroup
          key={group.title}
          className="py-2 group-data-[collapsible=icon]:py-0"
        >
          <SidebarGroupLabel className="flex items-center px-4 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase opacity-80 group-data-[collapsible=icon]:hidden">
            {group.title}
          </SidebarGroupLabel>
          <SidebarMenu className="mt-2 space-y-1 px-2 group-data-[collapsible=icon]:px-0">
            {group.items?.map((subItem) => {
              const isActive =
                pathname === subItem.url ||
                (subItem.url !== "/dashboard" &&
                  pathname.startsWith(`${subItem.url}/`))
              return (
                <SidebarMenuItem key={subItem.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={subItem.title}
                    className="h-10 hover:bg-transparent hover:text-foreground"
                  >
                    <Link
                      href={subItem.url}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group/navItem flex w-full items-center gap-3 rounded-none px-2 py-1.5 transition-all",
                        "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-10 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-0",
                        isActive
                          ? "border-l-2 border-primary bg-primary/8 pl-[calc(0.5rem-2px)] text-primary"
                          : "border-l-2 border-transparent hover:bg-muted/30"
                      )}
                    >
                      {subItem.icon && (
                        <div
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-none border transition-all duration-300",
                            isActive
                              ? "border-primary/30 bg-primary/15 text-primary shadow-[0_0_12px_oklch(0.91_0.14_192/0.25)]"
                              : "border-transparent group-hover/navItem:scale-110 group-hover/navItem:border-primary/20 group-hover/navItem:bg-primary/10 group-hover/navItem:text-primary"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 shrink-0 transition-colors" />
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-sm font-medium tracking-tight transition-colors group-data-[collapsible=icon]:hidden",
                          isActive
                            ? "text-foreground"
                            : "text-foreground/80 group-hover/navItem:text-foreground"
                        )}
                      >
                        {subItem.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
