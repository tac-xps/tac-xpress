import type { Metadata } from "next"
import { ShipmentRegister } from "@/components/operations/shipment-register"
import type { RecordSearchParams } from "@/lib/table-query"

export const metadata: Metadata = {
  title: "Shipments Directory | TAC-XPRESS",
  description: "Comprehensive shipment register, tracking numbers, and cargo status.",
}

export default function Page({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  return <ShipmentRegister searchParams={searchParams} mode="all" />
}
