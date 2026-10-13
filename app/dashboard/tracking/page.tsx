import type { Metadata } from "next"
import { requireStaffPage } from "@/lib/auth/page-access"
import { ScannerStation } from "@/components/operations/scanner-station"
import { firstParam } from "@/lib/table-query"

export const metadata: Metadata = {
  title: "Tracking & Scanner Station | TAC-XPRESS",
  description: "Live barcode and AWB scanning station, shipment verification, and status updates.",
}
export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ awb?: string | string[] }>
}) {
  await requireStaffPage()
  const awb = firstParam((await searchParams).awb)
    .trim()
    .toUpperCase()
    .slice(0, 64)
  return <ScannerStation key={awb} initialAwb={awb} />
}
