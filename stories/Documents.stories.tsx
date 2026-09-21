import type { Meta, StoryObj } from "@storybook/nextjs"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { InvoiceDocument } from "@/components/invoice-document"
import { ShippingLabel } from "@/components/documents/shipping-label"

// Isolated print fixtures matching Delhi -> Singjamei route
const shipment: Shipment = {
  id: "22222222-2222-4222-8222-222222222222",
  awbNumber: "TAC-948210-IMF",
  customerId: null,
  status: "in-transit",
  serviceType: "express_air",
  pieces: 2,
  consignorName: "Rajesh Sharma",
  consignorCompany: "Delhi Electronics Traders",
  consignorAddress: "Shop 14, Main Market, Lajpat Nagar, New Delhi",
  consignorPinCode: "110024",
  consignorPhone: "+91 98100 54321",
  consignorAltPhone: null,
  consignorEmail: "rajesh.delhi@example.test",
  consignorIdType: "pan",
  consignorIdNumber: "AAMFR1234D",
  consigneeName: "Thoiba Meitei",
  consigneeAddress: "Near Singjamei Supermarket Complex, Indo-Myanmar Road, Singjamei Top Leikai",
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
  contentDescription: "Commercial electronics & spare components",
  natureOfGoods: "electronics",
  itemCondition: "new",
  declaredValue: 45000,
  deletedAt: null,
  createdAt: new Date("2026-09-13T09:00:00Z"),
  updatedAt: new Date("2026-09-13T09:00:00Z"),
}

const invoice: Invoice = {
  id: "11111111-1111-4111-8111-111111111111",
  shipmentId: shipment.id,
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

const meta = {
  title: "Operations/Documents",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AmazonTaxInvoiceA4: Story = {
  name: "Amazon-Style Tax Invoice (A4)",
  render: () => (
    <div className="bg-neutral-100 py-8">
      <InvoiceDocument invoice={invoice} shipment={shipment} appOrigin="https://tacservice.in" />
    </div>
  ),
}

export const AmazonThermalLabelAir: Story = {
  name: "Amazon-Style Barcode Label (4x6 Air)",
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-8">
      <style>{"@media print { @page { size: 4in 6in; margin: 0; } }"}</style>
      <ShippingLabel shipment={shipment} />
    </div>
  ),
}

export const AmazonThermalLabelCOD: Story = {
  name: "Amazon-Style Barcode Label (4x6 COD)",
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-8">
      <ShippingLabel
        shipment={{
          ...shipment,
          paymentMode: "cod",
          totalAmount: 325000, // ₹3,250
        }}
      />
    </div>
  ),
}

export const LongAddressLabel: Story = {
  name: "Label with Extended Address",
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-8">
      <ShippingLabel
        shipment={{
          ...shipment,
          consigneeName: "Dr. K. Ibochouba Singh & Sons Medical Supplies",
          consigneeAddress:
            "Building 42, Floor 2, Opposite Community Health Center, Singjamei Top Leikai, Near Supermarket Junction, Imphal West District, Manipur - 795008. Deliver during clinic hours 10 AM to 5 PM.",
          consignorName: "M/S North India Surgical & Diagnostic Instruments Co.",
          consignorAddress:
            "Warehouse 8B, DSIIDC Industrial Complex, Khasra 382, Near Gate 4, Wazir Nagar Extension, Kotla Mubarakpur, New Delhi - 110003.",
        }}
      />
    </div>
  ),
}
