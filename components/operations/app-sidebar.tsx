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
                  {group.items.map(({ title, href, icon: Icon }) => (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={title}
                        isActive={isWorkspaceRouteActive(pathname, href)}
                        className="h-9 font-normal data-[active=true]:font-medium"
                      >
                        <Link
                          href={href}
                          aria-current={
                            isWorkspaceRouteActive(pathname, href)
                              ? "page"
                              : undefined
                          }
                          onClick={() => setOpenMobile(false)}
                        >
                          <Icon />
                          <span>{title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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
