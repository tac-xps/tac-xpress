"use client"

import React from "react"
import {
  DashboardIcon,
  AnalyticsIcon,
  MetricsIcon,
  ShipmentsIcon,
  DispatchIcon,
  ManifestsIcon,
  FleetIcon,
  TrackingIcon,
  InvoicesIcon,
  CustomersIcon,
  PricingIcon,
  SupportIcon,
} from "@/components/icons/sidebar-icons"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain, type NavItem } from "./nav-main"
import { Logo } from "@/assets/logo/logo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, Plane, Truck } from "lucide-react"

const NAV_ITEMS: NavItem[] = [
  {
    title: "Operations",
    url: "#",
    isActive: true,
    items: [
      { title: "Dashboard", url: "/dashboard", icon: DashboardIcon },
      { title: "Analytics", url: "/dashboard/analytics", icon: AnalyticsIcon },
      { title: "SLA Metrics", url: "/dashboard/metrics", icon: MetricsIcon },
      { title: "Shipments", url: "/dashboard/shipments", icon: ShipmentsIcon },
      { title: "Dispatch", url: "/dashboard/dispatch", icon: DispatchIcon },
      { title: "Manifests", url: "/dashboard/manifests", icon: ManifestsIcon },
      { title: "Fleet", url: "/dashboard/fleet", icon: FleetIcon },
      { title: "Warehouse", url: "/dashboard/warehouse", icon: Package as any },
      { title: "Tracking", url: "/dashboard/tracking", icon: TrackingIcon },
      { title: "Air Cargo", url: "/dashboard/operations/air-cargo", icon: Plane },
      { title: "Surface Cargo", url: "/dashboard/operations/surface-cargo", icon: Truck },
      {
        title: "Support Tickets",
        url: "/dashboard/messages",
        icon: SupportIcon,
      },
    ],
  },
  {
    title: "Accounting",
    url: "#",
    items: [
      { title: "Invoices", url: "/dashboard/invoices", icon: InvoicesIcon },
      { title: "Customers", url: "/dashboard/customers", icon: CustomersIcon },
      { title: "Pricing", url: "/dashboard/pricing", icon: PricingIcon },
    ],
  },
]

function getNavItemsForRole(userRole?: string): NavItem[] {
  if (userRole === "admin" || userRole === "staff") return NAV_ITEMS

  return [
    {
      title: "Operations",
      url: "#",
      isActive: true,
      items: [
        { title: "Tracking", url: "/dashboard/tracking", icon: TrackingIcon },
      ],
    },
  ]
}

export function AppSidebar({
  userRole,
  ...props
}: React.ComponentProps<typeof Sidebar> & { userRole?: string }) {
  const navItems = getNavItemsForRole(userRole)

  return (
    <Sidebar
      id="tour-sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar/90 shadow-sm backdrop-blur-2xl"
      {...props}
    >
      <SidebarHeader className="flex w-full items-center justify-center border-b border-sidebar-border/70 px-2 py-5">
        <Logo />
      </SidebarHeader>
      <ScrollArea className="mt-4 flex-1 overflow-hidden">
        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>
      </ScrollArea>
      <SidebarRail />
    </Sidebar>
  )
}
