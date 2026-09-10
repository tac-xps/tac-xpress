import {
  LayoutDashboard,
  Package,
  Truck,
  ClipboardList,
  Warehouse,
  MapPin,
  Plane,
  Route,
  ReceiptText,
  Users,
  SlidersHorizontal,
  MessageSquare,
  ChartNoAxesCombined,
  Timer,
  Plug,
  History,
  Building2,
  PackageCheck,
  UserCog,
  MessageCircle,
} from "lucide-react"
export const workspaceNavigation = [
  {
    label: "Daily operations",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "Shipments", href: "/dashboard/shipments", icon: Package },
      { title: "Dispatch", href: "/dashboard/dispatch", icon: Route },
      { title: "Manifests", href: "/dashboard/manifests", icon: ClipboardList },
      { title: "Warehouse", href: "/dashboard/warehouse", icon: Warehouse },
      { title: "Delivery", href: "/driver/delivery", icon: PackageCheck },
      { title: "Tracking", href: "/dashboard/tracking", icon: MapPin },
    ],
  },
  {
    label: "Network",
    items: [
      { title: "Fleet", href: "/dashboard/fleet", icon: Truck },
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
      { title: "Invoices", href: "/dashboard/invoices", icon: ReceiptText },
      { title: "Customers", href: "/dashboard/customers", icon: Users },
      { title: "Staff", href: "/dashboard/staff", icon: UserCog },
      { title: "Pricing", href: "/dashboard/pricing", icon: SlidersHorizontal },
      { title: "Support", href: "/dashboard/messages", icon: MessageSquare },
      { title: "Feedback", href: "/dashboard/feedback", icon: MessageCircle },
      { title: "Communications", href: "/dashboard/communications", icon: MessageSquare },
    ],
  },
  {
    label: "Reporting & administration",
    items: [
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: ChartNoAxesCombined,
      },
      { title: "Service levels", href: "/dashboard/metrics", icon: Timer },
      {
        title: "Warehouse audit",
        href: "/dashboard/warehouse/audit",
        icon: History,
      },
      { title: "Integrations", href: "/dashboard/integrations", icon: Plug },
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
