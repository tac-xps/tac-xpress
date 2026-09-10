import { ShipmentRegister } from "@/components/operations/shipment-register"
import type { RecordSearchParams } from "@/lib/table-query"

export default function Page({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  return <ShipmentRegister searchParams={searchParams} mode="all" />
}
