"use client"

import { format } from "date-fns"
import Barcode from "@/components/barcode"
import { PlaneTakeoff } from "lucide-react"

interface ShippingLabelPreviewProps {
  shipment: {
    awbNumber: string
    serviceType: string
    pieces: number | null
    consigneeName: string | null
    consigneeAddress: string | null
    consigneePinCode: string | null
    consigneePhone: string | null
    consignorName: string | null
    consignorAddress: string | null
    consignorPinCode: string | null
    consignorPhone: string | null
    weightKg: number
    chargedWeightKg: number | null
    bookingDate: Date | string
  }
}

export function ShippingLabelPreview({ shipment }: ShippingLabelPreviewProps) {
  return (
    <div className="mx-auto box-border flex h-[6in] w-[4in] shrink-0 flex-col overflow-hidden border-2 border-black bg-background p-4 font-sans shadow-xl">
      {/* Header - Brand & Service */}
      <div className="mb-2 flex items-center justify-between border-b-2 border-black pb-2">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="h-6 w-6 text-black" />
          <div>
            <h1 className="text-sm leading-none font-black tracking-tighter uppercase">
              TAC-XPRESS
            </h1>
            <span className="text-[10px] font-bold">Standard Cargo</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black">{shipment.pieces || 1} PCS</div>
          <div className="text-sm font-bold uppercase">
            {shipment.serviceType.replace(/_/g, " ")}
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="mb-2 flex flex-grow flex-col gap-2">
        {/* Destination (Huge for routing) */}
        <div className="border-b-2 border-black pb-2">
          <div className="mb-1 text-xs font-bold uppercase">To:</div>
          <div className="line-clamp-1 text-lg leading-tight font-black uppercase">
            {shipment.consigneeName || "N/A"}
          </div>
          <div className="mt-1 line-clamp-2 text-sm leading-tight font-medium">
            {shipment.consigneeAddress || "N/A"}
          </div>
          <div className="mt-1 text-2xl font-black">
            PIN: {shipment.consigneePinCode || "N/A"}
          </div>
          <div className="mt-1 text-xs">
            Ph: {shipment.consigneePhone || "N/A"}
          </div>
        </div>

        {/* Origin (Small) */}
        <div className="border-b-2 border-black pb-2">
          <div className="text-[10px] font-bold uppercase">From:</div>
          <div className="text-xs font-bold uppercase">
            {shipment.consignorName || "N/A"}
          </div>
          <div className="line-clamp-2 text-[10px] leading-tight">
            {shipment.consignorAddress || "N/A"}
          </div>
          <div className="mt-1 text-[10px] font-bold">
            PIN: {shipment.consignorPinCode || "N/A"} | Ph:{" "}
            {shipment.consignorPhone || "N/A"}
          </div>
        </div>
      </div>

      {/* Shipment Specs */}
      <div className="mb-2 grid grid-cols-3 gap-2 border-b-2 border-black pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase">Act. Wt</span>
          <span className="text-sm font-black">{shipment.weightKg} kg</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase">Chg. Wt</span>
          <span className="text-sm font-black">
            {shipment.chargedWeightKg || shipment.weightKg} kg
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase">Date</span>
          <span className="text-sm font-black">
            {format(new Date(shipment.bookingDate), "dd/MM/yy")}
          </span>
        </div>
      </div>

      {/* Barcode Section (Bottom) */}
      <div className="mt-auto flex flex-col items-center justify-center pt-2">
        <Barcode
          value={shipment.awbNumber}
          width={1.8}
          height={50}
          displayValue={true}
          fontSize={14}
          margin={0}
          font="monospace"
        />
      </div>
    </div>
  )
}
