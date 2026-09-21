"use client"

import React from "react"
import Barcode from "@/components/barcode"
import { QRCode } from "@/components/documents/document-qr"
import { format } from "date-fns"
import { DELHI_HUB_ADDRESS, SINGJAMEI_HUB_ADDRESS } from "@/lib/documents/address-constants"

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
  paymentMode?: string | null
  totalAmount?: number | null
  contentDescription?: string | null
}

interface ShippingLabelProps {
  shipment: LabelShipment
}

/**
 * Standard 4" × 6" Thermal Barcode Shipping Label.
 *
 * Inspired by Amazon Logistics (ATS / Easy Ship / FBA) design:
 * - Top Section: Central Delhi Dispatch Hub & Consignor origin details
 * - Center: High-density Code 128 routing barcode & package telemetry
 * - Bottom Section: Singjamei Delivery Station & Consignee delivery details with bold PIN callout
 */
export function ShippingLabel({ shipment }: ShippingLabelProps) {
  const isCOD = shipment.paymentMode === "cod" || shipment.paymentMode === "to_pay"
  const serviceLabel =
    shipment.serviceType === "express_air"
      ? "AIR CARGO"
      : shipment.serviceType === "standard_ocean"
        ? "OCEAN CARGO"
        : "SURFACE CARGO"

  const bookingDateFormatted = format(new Date(shipment.bookingDate), "dd MMM yyyy")

  return (
    <article
      data-shipping-label
      className="box-border flex h-[6in] w-[4in] shrink-0 flex-col border-2 border-black bg-white p-3 font-sans text-black select-none [print-color-adjust:exact]"
      aria-label={`Amazon-style shipping label ${shipment.awbNumber}`}
    >
      {/* ── ZONE 1: HEADER & ROUTING STATION IDENTIFIERS ── */}
      <header className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tighter">TAC-XPRESS</span>
            <span className="border border-black bg-black px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              {serviceLabel}
            </span>
          </div>
          <span className="text-[9px] font-semibold tracking-tight text-neutral-700">
            TAPAN ASSOCIATES CARGO SERVICE
          </span>
        </div>

        {/* Amazon-style Hub-to-Hub Routing Badge */}
        <div className="flex flex-col items-end">
          <div className="border border-black bg-black px-2 py-0.5 text-xs font-black tracking-widest text-white">
            DEL &#8594; SJM
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[9px] font-bold">
            <span>{shipment.pieces ?? 1} PCS</span>
            <span>&bull;</span>
            <span>{bookingDateFormatted}</span>
          </div>
        </div>
      </header>

      {/* ── ZONE 2: TOP SECTION — SHIP FROM / DISPATCH HUB (DELHI) ── */}
      <section className="border-b-2 border-black py-1.5 text-[10px] leading-tight">
        <div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-800">
          <span>SHIP FROM / ORIGIN HUB:</span>
          <span>GSTIN: {DELHI_HUB_ADDRESS.gstin}</span>
        </div>

        {/* Official Delhi Address */}
        <p className="mt-0.5 font-bold text-black">
          {DELHI_HUB_ADDRESS.name}
        </p>
        <p className="text-[9.5px] text-neutral-800">
          {DELHI_HUB_ADDRESS.addressLine1}, {DELHI_HUB_ADDRESS.addressLine2}, {DELHI_HUB_ADDRESS.city}-{DELHI_HUB_ADDRESS.pinCode}
        </p>

        {/* Consignor Sender Details */}
        <div className="mt-1 border-t border-neutral-300 pt-1 text-[9px]">
          <span className="font-semibold text-neutral-700">Consignor / Sender: </span>
          <span className="font-bold text-black">{shipment.consignorName || "Walk-in Consignor"}</span>
          {shipment.consignorPhone && (
            <span className="text-neutral-700"> &bull; Ph: {shipment.consignorPhone}</span>
          )}
          {shipment.consignorAddress && shipment.consignorAddress !== DELHI_HUB_ADDRESS.addressLine1 && (
            <p className="truncate text-neutral-600">{shipment.consignorAddress}</p>
          )}
        </div>
      </section>

      {/* ── ZONE 3: PRIMARY CODE 128 BARCODE ── */}
      <section className="flex flex-col items-center justify-center border-b-2 border-black py-2">
        <div className="w-full flex justify-center [&_svg]:h-[48px] [&_svg]:w-full [&_svg]:max-w-[3.6in]">
          <Barcode
            value={shipment.awbNumber}
            format="CODE128"
            width={2.2}
            height={48}
            displayValue={false}
            margin={0}
            background="#ffffff"
            lineColor="#000000"
          />
        </div>
        <p className="font-mono text-xs font-black tracking-widest text-black mt-0.5">
          AWB: {shipment.awbNumber}
        </p>
      </section>

      {/* ── ZONE 4: PACKAGE SPECS & PAYMENT MODE (AMAZON METRIC GRID) ── */}
      <section className="grid grid-cols-4 border-b-2 border-black text-center text-[9px] font-bold">
        <div className="border-r border-black py-1">
          <span className="block text-[8px] text-neutral-600 uppercase">Weight</span>
          <span>{shipment.weightKg} KG</span>
        </div>
        <div className="border-r border-black py-1">
          <span className="block text-[8px] text-neutral-600 uppercase">Chg Wt</span>
          <span>{shipment.chargedWeightKg ?? shipment.weightKg} KG</span>
        </div>
        <div className="border-r border-black py-1">
          <span className="block text-[8px] text-neutral-600 uppercase">Units</span>
          <span>{shipment.pieces ?? 1} PKG</span>
        </div>
        <div className="py-1 flex items-center justify-center">
          {isCOD ? (
            <span className="w-full bg-black py-0.5 text-[8.5px] font-black uppercase text-white tracking-tight">
              COD: &#8377;{((shipment.totalAmount ?? 0) / 100).toFixed(0)}
            </span>
          ) : (
            <span className="text-[9px] font-black uppercase text-black tracking-wider">
              PREPAID
            </span>
          )}
        </div>
      </section>

      {/* ── ZONE 5: BOTTOM SECTION — SHIP TO / DESTINATION HUB (SINGJAMEI) ── */}
      <section className="flex-1 py-2 text-[10px] leading-snug">
        <div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-800">
          <span>SHIP TO / RECIPIENT:</span>
          <span className="bg-neutral-200 px-1 py-0.5 text-[8px] font-bold">AIR/SURFACE LINEHAUL</span>
        </div>

        {/* Consignee Recipient Details */}
        <p className="mt-1 text-sm font-black uppercase text-black break-words">
          {shipment.consigneeName || "Recipient Not Recorded"}
        </p>
        <p className="text-[10px] font-medium text-neutral-900 break-words mt-0.5">
          {shipment.consigneeAddress || "Delivery Address On File"}
        </p>
        {shipment.consigneePhone && (
          <p className="font-mono text-[10px] font-bold text-neutral-900 mt-0.5">
            TEL: {shipment.consigneePhone}
          </p>
        )}

        {/* Destination Station: Singjamei Hub */}
        <div className="mt-2 border-t border-dashed border-black pt-1.5 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 text-[9px] leading-tight">
            <p className="font-bold uppercase tracking-tight text-neutral-900">
              DELIVERY STATION / DESTINATION HUB:
            </p>
            <p className="font-bold text-black">{SINGJAMEI_HUB_ADDRESS.name}</p>
            <p className="text-neutral-700">
              {SINGJAMEI_HUB_ADDRESS.addressLine1}, {SINGJAMEI_HUB_ADDRESS.city}, {SINGJAMEI_HUB_ADDRESS.state} {SINGJAMEI_HUB_ADDRESS.pinCode}
            </p>
            <p className="text-neutral-700">Ph: {SINGJAMEI_HUB_ADDRESS.phone}</p>
          </div>

          {/* Amazon-style High-Visibility Large Destination PIN Code Box */}
          <div className="flex flex-col items-center border-2 border-black bg-white px-2.5 py-1 text-center shrink-0">
            <span className="text-[7.5px] font-black uppercase tracking-wider text-neutral-700">
              DEST PIN
            </span>
            <span className="font-mono text-base font-black tracking-tight text-black leading-none mt-0.5">
              {shipment.consigneePinCode || SINGJAMEI_HUB_ADDRESS.pinCode}
            </span>
            <span className="text-[8px] font-extrabold uppercase text-neutral-800 tracking-wider">
              (SJM)
            </span>
          </div>
        </div>
      </section>

      {/* ── ZONE 6: FOOTER (QR CODE, SORT ROUTE & CARGO ICONS) ── */}
      <footer className="mt-auto border-t-2 border-black pt-2 flex items-center justify-between gap-2">
        {/* Delivery Agent Scan-to-Deliver QR */}
        <div className="flex items-center gap-2">
          <QRCode
            data={`https://tacservice.in/track?awb=${encodeURIComponent(shipment.awbNumber)}`}
            className="size-12 shrink-0 border border-black p-0.5"
          />
          <div className="flex flex-col text-[8px] font-semibold text-neutral-700 leading-tight">
            <span className="font-bold text-black">SCAN TO CONFIRM</span>
            <span>Real-time Manifest Verification</span>
            <span className="font-mono text-[7px] text-neutral-500">tacservice.in</span>
          </div>
        </div>

        {/* Cargo ISO Handling Icons & Sort Barcode Code */}
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1.5 text-xs font-bold text-black" title="Handling instructions">
            <span title="Keep Dry">&#9730;</span>
            <span title="Handle with Care">&#9825;</span>
            <span title="This Side Up">&#8593;&#8593;</span>
          </div>
          <p className="font-mono text-[8px] font-bold text-black uppercase tracking-wider mt-0.5">
            HUB SORT: DEL-SJM-LST
          </p>
        </div>
      </footer>
    </article>
  )
}
