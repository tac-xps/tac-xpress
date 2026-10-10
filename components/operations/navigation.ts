import {
  Warehouse,
  Plane,
  Truck,
  Building2,
  PackageCheck,
  UserCog,
  MessageCircle,
  Radio,
  History,
  Plug,
  ServerCog,
  ShieldCheck,
} from "lucide-react"
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

export const workspaceNavigation = [
  {
    label: "Daily operations",
    items: [
      { title: "Overview", href: "/dashboard", icon: DashboardIcon },
      { title: "Shipments", href: "/dashboard/shipments", icon: ShipmentsIcon },
      { title: "Dispatch", href: "/dashboard/dispatch", icon: DispatchIcon },
      { title: "Manifests", href: "/dashboard/manifests", icon: ManifestsIcon },
      { title: "Warehouse", href: "/dashboard/warehouse", icon: Warehouse },
      { title: "Delivery", href: "/driver/delivery", icon: PackageCheck },
      { title: "Tracking", href: "/dashboard/tracking", icon: TrackingIcon },
    ],
  },
  {
    label: "Network",
    items: [
      { title: "Fleet", href: "/dashboard/fleet", icon: FleetIcon },
      { title: "Hubs", href: "/dashboard/hubs", icon: Building2 },
      {
        title: "Air cargo",
        href: "/dashboard/operations/air-cargo",
        icon: Plane,
      },
      {
        title: "Surface cargo",
        href: "/dashboard/operations/surface-cargo",
        icon: Truck,
      },
    ],
  },
  {
    label: "Business & service",
    items: [
      { title: "Invoices", href: "/dashboard/invoices", icon: InvoicesIcon },
      { title: "Customers", href: "/dashboard/customers", icon: CustomersIcon },
      { title: "Staff", href: "/dashboard/staff", icon: UserCog },
      { title: "Pricing", href: "/dashboard/pricing", icon: PricingIcon },
      { title: "Support", href: "/dashboard/messages", icon: SupportIcon },
      { title: "Feedback", href: "/dashboard/feedback", icon: MessageCircle },
      { title: "Communications", href: "/dashboard/communications", icon: Radio },
    ],
  },
  {
    label: "Reporting & administration",
    items: [
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: AnalyticsIcon,
      },
      { title: "Service levels", href: "/dashboard/metrics", icon: MetricsIcon },
      {
        title: "Warehouse audit",
        href: "/dashboard/warehouse/audit",
        icon: History,
      },
      { title: "Integrations", href: "/dashboard/integrations", icon: Plug },
      { title: "Jobs & DLQ", href: "/dashboard/jobs", icon: ServerCog },
      {
        title: "Security & MFA",
        href: "/dashboard/settings/security",
        icon: ShieldCheck,
      },
    ],
  },
]
export function isWorkspaceRouteActive(pathname: string, href: string) {
  const match = workspaceNavigation
    .flatMap((group) => group.items)
    .filter(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    )
    .sort((a, b) => b.href.length - a.href.length)[0]
  return match?.href === href
}
export function workspacePageTitle(pathname: string) {
  return (
    workspaceNavigation
      .flatMap((group) => group.items)
      .find((item) => isWorkspaceRouteActive(pathname, item.href))?.title ??
    "Workspace"
  )
}
