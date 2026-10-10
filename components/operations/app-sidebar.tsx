"use client"
// Adapted from official @shadcn/sidebar-07; actual TAC-XPRESS route groups.
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, Package } from "lucide-react"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { workspaceNavigation, isWorkspaceRouteActive } from "./navigation"

export function AppSidebar({
  userRole,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userRole?: string }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  return (
    <Sidebar
      id="tour-sidebar"
      collapsible="icon"
      className="sticky top-0 h-svh border-r"
      {...props}
    >
      <SidebarHeader className="border-b p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="TAC-XPRESS operations"
            >
              <Link href="/dashboard" onClick={() => setOpenMobile(false)}>
                <Package className="size-5 shrink-0" />
                <div className="grid gap-1 group-data-[collapsible=icon]:hidden">
                  <Logo className="h-5 w-fit" />
                  <span className="text-xs text-muted-foreground">
                    Operations workspace
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-1">
        {(userRole === "admin" || userRole === "staff") &&
          workspaceNavigation.map((group) => (
            <SidebarGroup key={group.label} className="px-3 py-2">
              <SidebarGroupLabel className="text-xs font-normal">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(({ title, href, icon: Icon }) => {
                    const isActive = isWorkspaceRouteActive(pathname, href)
                    return (
                      <SidebarMenuItem key={href} className="relative">
                        <SidebarMenuButton
                          asChild
                          tooltip={title}
                          isActive={isActive}
                          className="relative h-9 font-normal transition-colors duration-150 data-[active=true]:bg-sidebar-primary/10 data-[active=true]:text-sidebar-primary data-[active=true]:font-medium data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:rounded-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-hidden"
                        >
                          <Link
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => setOpenMobile(false)}
                            className="group/item flex items-center gap-2"
                          >
                            <Icon
                              aria-hidden="true"
                              className="size-4 shrink-0 transition-transform duration-150 group-hover/item:scale-110 group-hover/item:translate-x-0.5"
                            />
                            <span>{title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Public website">
              <Link href="/">
                <ExternalLink />
                <span>Public website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="px-2 pb-1 text-xs text-muted-foreground capitalize group-data-[collapsible=icon]:hidden">
          {userRole ?? "Staff"} workspace
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
