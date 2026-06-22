import { CustomerSegmentMix } from "@/components/cargo/customer-segment-mix"
import { DeliveryPerformance } from "@/components/cargo/delivery-performance"
import { ActiveShipments } from "@/components/cargo/active-shipments"
import { TopRoutes } from "@/components/cargo/top-routes"
import { RecentShipments } from "@/components/cargo/recent-shipments"
import { TopCustomers } from "@/components/cargo/top-customers"
import { RevenueByService } from "@/components/cargo/revenue-by-service"
import { ShipmentVolumeChart } from "@/components/cargo/shipment-volume-chart"
import { BusinessKPIs } from "@/components/cargo/business-kpis"

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
      <ShipmentVolumeChart />
      <ActiveShipments />
      <RecentShipments />
      <TopRoutes />
      <RevenueByService />
      <CustomerSegmentMix />
      <DeliveryPerformance />
      <TopCustomers />
      <BusinessKPIs />
    </div>
  )
}
