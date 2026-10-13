import type { Metadata } from "next"
import { ShipmentRegister } from "@/components/operations/shipment-register"
import type { RecordSearchParams } from "@/lib/table-query"

export const metadata: Metadata = {
  title: "Warehouse Operations | TAC-XPRESS",
  description: "Warehouse floor intake, inventory staging, sorting, and reconciliation.",
}

export default function Page({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  return <ShipmentRegister searchParams={searchParams} mode="warehouse" />
}
