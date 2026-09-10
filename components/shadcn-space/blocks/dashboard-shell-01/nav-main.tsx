"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import type { ElementType } from "react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
export type NavItem = { title: string; url: string; icon?: ElementType; isActive?: boolean; items?: { title: string; url: string; icon?: ElementType }[] }
interface NavMainProps { items: NavItem[] }
export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()
  return <nav aria-label="Workspace navigation">{items.map(group => <SidebarGroup key={group.title} className="py-3"><SidebarGroupLabel className="mb-2 px-3 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">{group.title}</SidebarGroupLabel><SidebarMenu className="gap-1">{group.items?.map(item => {
    const active = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url + "/"))
    return <SidebarMenuItem key={item.url}><SidebarMenuButton asChild isActive={active} tooltip={item.title} className="h-9 gap-2 rounded-none px-3"><Link href={item.url} aria-current={active ? "page" : undefined}>{item.icon && <item.icon className="size-4 shrink-0" />}<span>{item.title}</span></Link></SidebarMenuButton></SidebarMenuItem>
  })}</SidebarMenu></SidebarGroup>)}</nav>
}
