import type { ReactNode } from "react"
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
} from "@/components/icons/sidebar-icons"
import { SettingsIcon } from "lucide-react"

export type SidebarNavItem = {
  title: string
  path?: string
  icon?: ReactNode
  isActive?: boolean
  subItems?: SidebarNavItem[]
}

export type SidebarNavGroup = {
  label: string
  items: SidebarNavItem[]
}

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Operations",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: (
          <DashboardIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Analytics",
        path: "/dashboard/analytics",
        icon: (
          <AnalyticsIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "SLA Metrics",
        path: "/dashboard/metrics",
        icon: (
          <MetricsIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Shipments",
        path: "/dashboard/shipments",
        icon: (
          <ShipmentsIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Dispatch",
        path: "/dashboard/dispatch",
        icon: (
          <DispatchIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Manifests",
        path: "/dashboard/manifests",
        icon: (
          <ManifestsIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Fleet",
        path: "/dashboard/fleet",
        icon: (
          <FleetIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Tracking",
        path: "/dashboard/tracking",
        icon: (
          <TrackingIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Onboarding",
        path: "/onboarding",
        icon: (
          <SettingsIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
    ],
  },
  {
    label: "Accounting",
    items: [
      {
        title: "Invoices",
        path: "/dashboard/invoices",
        icon: (
          <InvoicesIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Customers",
        path: "/dashboard/customers",
        icon: (
          <CustomersIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
      {
        title: "Pricing",
        path: "/dashboard/pricing",
        icon: (
          <PricingIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
    ],
  },
  {
    label: "Configure",
    items: [
      {
        title: "Integrations",
        path: "/dashboard/integrations",
        icon: (
          <SettingsIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
        ),
      },
    ],
  },
]

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
]
