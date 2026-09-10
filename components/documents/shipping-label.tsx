"use client"
import Barcode from "@/components/barcode"
import { QRCode } from "@/components/documents/document-qr"
import { format } from "date-fns"

export interface LabelShipment {
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
interface ShippingLabelProps {
  shipment: LabelShipment
}

/** A single 4 × 6 inch thermal document, shared by preview and print. */
export function ShippingLabel({ shipment }: ShippingLabelProps) {
  return (
    <article
      data-shipping-label
      className="box-border flex h-[6in] w-[4in] shrink-0 flex-col gap-3 border-2 border-black bg-white p-4 font-sans text-black [print-color-adjust:exact]"
      aria-label={`Shipping label ${shipment.awbNumber}`}
    >
      <header className="flex items-start justify-between gap-3 border-b-2 border-black pb-2">
        <div>
          <p className="text-xl font-bold tracking-tight">TAC-XPRESS</p>
          <p className="text-xs uppercase">
            {shipment.serviceType === "express_air"
              ? "Air cargo"
              : shipment.serviceType === "standard_ocean"
                ? "Ocean cargo"
                : "Surface cargo"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">{shipment.pieces ?? 1} PCS</p>
          <p className="text-xs">
            {format(new Date(shipment.bookingDate), "dd MMM yyyy")}
          </p>
        </div>
      </header>
      <section className="flex flex-col gap-1 border-b border-black pb-3">
        <h2 className="text-xs font-bold uppercase">Deliver to</h2>
        <p className="text-base font-bold break-words">
          {shipment.consigneeName || "Recipient not recorded"}
        </p>
        <p className="text-xs leading-snug break-words">
          {shipment.consigneeAddress || "Address not recorded"}
        </p>
        <p className="text-xl font-bold">
          {shipment.consigneePinCode || "PIN not recorded"}
        </p>
        <p className="text-xs">
          {shipment.consigneePhone || "Phone not recorded"}
        </p>
      </section>
      <section className="flex gap-3">
        <div className="min-w-0 flex-1 text-xs leading-snug">
          <h2 className="mb-1 font-bold uppercase">From</h2>
          <p className="font-bold">
            {shipment.consignorName || "Sender not recorded"}
          </p>
          <p className="break-words">
            {shipment.consignorAddress || "Address not recorded"}
          </p>
          <p>{shipment.consignorPinCode}</p>
          <p>{shipment.consignorPhone}</p>
        </div>
        <QRCode data={shipment.awbNumber} className="size-20 shrink-0" />
      </section>
      <dl className="grid grid-cols-2 border-y border-black py-2 text-xs">
        <div>
          <dt>Actual weight</dt>
          <dd className="font-bold">{shipment.weightKg} kg</dd>
        </div>
        <div>
          <dt>Chargeable weight</dt>
          <dd className="font-bold">
            {shipment.chargedWeightKg ?? shipment.weightKg} kg
          </dd>
        </div>
      </dl>
      <footer className="mt-auto flex flex-col items-center gap-1">
        <div className="w-full [&_svg]:h-auto [&_svg]:max-w-full">
          <Barcode
            value={shipment.awbNumber}
            format="CODE128"
            width={2}
            height={55}
            displayValue={false}
            margin={12}
            background="#ffffff"
            lineColor="#000000"
          />
        </div>
        <p className="font-mono text-sm font-bold">{shipment.awbNumber}</p>
      </footer>
    </article>
  )
}
