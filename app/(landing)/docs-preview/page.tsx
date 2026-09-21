import React from "react"
import { ShippingLabel, type LabelShipment } from "@/components/documents/shipping-label"
import { InvoiceDocument } from "@/components/invoice-document"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { DELHI_HUB_ADDRESS, SINGJAMEI_HUB_ADDRESS } from "@/lib/documents/address-constants"

export const metadata = {
  title: "Documents Preview | TAC-XPRESS Amazon-Style Invoice & Barcode Label",
  description: "Live visual testbed for 4x6 thermal shipping label and A4 GST Tax invoice.",
}

const mockShipment: Shipment = {
  id: "22222222-2222-4222-8222-222222222222",
  awbNumber: "TAC-948210-IMF",
  customerId: null,
  status: "in-transit",
  serviceType: "express_air",
  pieces: 2,
  consignorName: "Rajesh Sharma",
  consignorCompany: "Delhi Electronics Traders",
  consignorAddress: "1498, Wazir Nagar, Gali No 3, Kotla Mubarakpur",
  consignorPinCode: "110003",
  consignorPhone: "+91 98100 54321",
  consignorAltPhone: null,
  consignorEmail: "rajesh.delhi@example.test",
  consignorIdType: "pan",
  consignorIdNumber: "AAMFR1234D",
  consigneeName: "Thoiba Meitei",
  consigneeAddress: "Singjamei Top Leikai, Near Supermarket Complex, Indo-Myanmar Road",
  consigneePinCode: "795008",
  consigneePhone: "+91 98620 98765",
  consigneeAltPhone: null,
  consigneeEmail: "thoiba.imphal@example.test",
  origin: "New Delhi",
  destination: "Imphal",
  weightKg: 14.5,
  chargedWeightKg: 15.0,
  dimensionsL: 40,
  dimensionsW: 30,
  dimensionsH: 25,
  packagingType: "corrugated_box",
  isFragile: false,
  insuranceOptIn: true,
  slaAtRisk: false,
  slaAtRiskAlertedAt: null,
  slaRiskAcknowledged: false,
  slaRiskAcknowledgedBy: null,
  slaRiskAcknowledgedAt: null,
  edd: new Date("2026-09-16T12:00:00Z"),
  bookingDate: new Date("2026-09-13T09:00:00Z"),
  contentDescription: "Commercial Electronics & Precision Components",
  natureOfGoods: "electronics",
  itemCondition: "new",
  declaredValue: 45000,
  deletedAt: null,
  createdAt: new Date("2026-09-13T09:00:00Z"),
  updatedAt: new Date("2026-09-13T09:00:00Z"),
}

const mockInvoice: Invoice = {
  id: "11111111-1111-4111-8111-111111111111",
  shipmentId: mockShipment.id,
  customerId: null,
  amount: 247800, // ₹2,478.00 in paise
  status: "paid",
  pdfUrl: null,
  dueDate: null,
  freightCharge: 180000, // ₹1,800.00
  pickupCharge: 15000,   // ₹150.00
  packingCharge: 5000,   // ₹50.00
  docketCharge: 5000,    // ₹50.00
  insuranceCharge: 5000, // ₹50.00
  otherCharges: 0,
  subtotal: 210000,      // ₹2,100.00 taxable
  gstRate: 18,
  hsnCode: "996512",     // Express Air
  cgst: 0,
  sgst: 0,
  igst: 37800,          // ₹378.00 (18% on ₹2,100)
  paymentMode: "upi",
  advancePaid: 247800,
  balanceDue: 0,
  remarks: "Delivered to Singjamei delivery station",
  termsAccepted: true,
  prohibitedAccepted: true,
  signatureUrl: null,
  whatsappStatus: "sent",
  createdAt: new Date("2026-09-13T09:00:00Z"),
  updatedAt: new Date("2026-09-13T09:00:00Z"),
}

const labelShipment: LabelShipment = {
  awbNumber: mockShipment.awbNumber,
  serviceType: mockShipment.serviceType,
  pieces: mockShipment.pieces,
  consignorName: mockShipment.consignorName,
  consignorAddress: "1498, Wazir Nagar, Gali No 3, Kotla Mubarakpur, Delhi-110003",
  consignorPinCode: "110003",
  consignorPhone: mockShipment.consignorPhone,
  consigneeName: mockShipment.consigneeName,
  consigneeAddress: "Singjamei Top Leikai, Near Supermarket Complex, Indo-Myanmar Road",
  consigneePinCode: "795008",
  consigneePhone: mockShipment.consigneePhone,
  weightKg: mockShipment.weightKg,
  chargedWeightKg: mockShipment.chargedWeightKg,
  bookingDate: mockShipment.bookingDate,
  paymentMode: "prepaid",
  totalAmount: mockInvoice.amount,
  contentDescription: mockShipment.contentDescription,
}

export default function DocsPreviewPage() {
  return (
    <main className="min-h-screen bg-neutral-100/90 py-10 px-4 text-neutral-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b border-neutral-300 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                TAC-XPRESS Document Design Studio
              </h1>
              <p className="text-sm text-neutral-600">
                Amazon ATS / Easy Ship styled 4&quot; × 6&quot; Thermal Shipping Label and A4 GST Tax Invoice
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="rounded bg-black px-2.5 py-1 text-white font-bold">
                DELHI HUB: 110003 (Origin)
              </span>
              <span>&#8594;</span>
              <span className="rounded bg-neutral-800 px-2.5 py-1 text-white font-bold">
                SINGJAMEI HUB: 795008 (Destination)
              </span>
            </div>
          </div>
        </header>

        {/* Studio Grid: Label on Left, Invoice on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4x6 Thermal Label */}
          <section className="lg:col-span-4 flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
                1. Thermal Shipping Label (4&quot; × 6&quot;)
              </h2>
              <span className="text-[11px] font-mono text-neutral-500">203/300 DPI</span>
            </div>

            <div className="rounded-lg border border-neutral-300 bg-white p-4 shadow-md">
              <ShippingLabel shipment={labelShipment} />
            </div>
          </section>

          {/* Right Column: A4 GST Tax Invoice */}
          <section className="lg:col-span-8 flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
                2. Tax Invoice (A4 GST Triplicate)
              </h2>
              <span className="text-[11px] font-mono text-neutral-500">210mm × 297mm</span>
            </div>

            <div className="w-full overflow-x-auto rounded-lg border border-neutral-300 bg-white p-4 shadow-md">
              <InvoiceDocument
                invoice={mockInvoice}
                shipment={mockShipment}
                appOrigin="http://localhost:3000"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
