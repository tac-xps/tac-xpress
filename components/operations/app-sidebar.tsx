"use client"
// Adapted from official @shadcn/sidebar-07; actual TAC-XPRESS route groups.
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { LogoMark } from "@/components/logo"
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
      <SidebarHeader className="border-b p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="TAC-XPRESS Freight Operations"
              className="h-13 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! hover:bg-sidebar-accent/60 transition-colors"
            >
              <Link
                href="/dashboard"
                prefetch={false}
                onClick={() => setOpenMobile(false)}
                className="flex items-center gap-3 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
              >
                <div className="flex size-10 shrink-0 items-center justify-center border border-sidebar-border/80 bg-sidebar-accent/50 text-sidebar-primary group-hover:border-sidebar-primary/50 group-hover:bg-sidebar-accent/80 transition-all shadow-xs group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent">
                  <LogoMark className="size-8! text-sidebar-primary group-data-[collapsible=icon]:size-6!" />
                </div>
                <div className="grid gap-0.5 group-data-[collapsible=icon]:hidden leading-none">
                  <div className="flex items-baseline">
                    <span className="font-heading font-black tracking-tight text-base text-sidebar-foreground">
                      TAC
                    </span>
                    <span className="inline-block w-[2px] h-[13px] bg-sidebar-primary mx-1.5 -skew-x-[14deg] select-none self-center" />
                    <span className="font-heading font-black tracking-wide text-base text-sidebar-primary">
                      XPRESS
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Freight Operations
                    </span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-1">
        {(userRole === "admin" || userRole === "staff") &&
          workspaceNavigation.map((group) => (
            <SidebarGroup
              key={group.label}
              className="px-3 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1.5"
            >
              <SidebarGroupLabel className="text-xs font-normal">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                  {group.items
                    .filter(
                      (item) =>
                        userRole === "admin" ||
                        !("adminOnly" in item && item.adminOnly)
                    )
                    .map(({ title, href, icon: Icon }) => {
                      const isActive = isWorkspaceRouteActive(pathname, href)
                      return (
                        <SidebarMenuItem
                          key={href}
                          className="relative group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                        >
                          <SidebarMenuButton
                            asChild
                            tooltip={title}
                            isActive={isActive}
                            className="relative h-9 font-normal transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-hidden data-[active=true]:bg-sidebar-primary/10 data-[active=true]:font-medium data-[active=true]:text-sidebar-primary data-[active=true]:before:absolute data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:left-0 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-none data-[active=true]:before:bg-sidebar-primary group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
                          >
                            <Link
                              href={href}
                              prefetch={false}
                              aria-current={isActive ? "page" : undefined}
                              onClick={() => setOpenMobile(false)}
                              className="group/item flex items-center gap-2 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                            >
                              <Icon
                                aria-hidden="true"
                                className="size-4 shrink-0 transition-transform duration-150 group-hover/item:scale-110"
                              />
                              <span className="group-data-[collapsible=icon]:hidden">
                                {title}
                              </span>
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
      <SidebarFooter className="border-t p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              asChild
              tooltip="Public website"
              className="group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
            >
              <Link
                href="/"
                prefetch={false}
                className="flex items-center gap-2 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
              >
                <ExternalLink className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Public website
                </span>
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
