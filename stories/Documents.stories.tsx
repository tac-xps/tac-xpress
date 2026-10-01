import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { InvoiceDocument } from "@/components/invoice-document"
import { ShippingLabel } from "@/components/documents/shipping-label"
import { InvoicePreviewDialog } from "@/app/dashboard/invoices/invoice-preview-dialog"
import { Button } from "@/components/ui/button"

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

export const MinimalistThermalLabelAir: Story = {
  name: "Minimalist Barcode Label (4x3 Air • 4:3 Aspect Ratio)",
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-8">
      <style>{"@media print { @page { size: 4in 3in; margin: 0; } }"}</style>
      <ShippingLabel shipment={shipment} />
    </div>
  ),
}

export const MinimalistThermalLabelCOD: Story = {
  name: "Minimalist Barcode Label (4x3 COD • 4:3 Aspect Ratio)",
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

export const InvoicePreviewDialogDemo: Story = {
  name: "Invoice & 4:3 Label Pop-up Dialog",
  render: () => {
    const [open, setOpen] = useState(true)
    const [tab, setTab] = useState<"invoice" | "label">("invoice")
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-neutral-100">
        <div className="flex gap-4">
          <Button onClick={() => { setTab("invoice"); setOpen(true); }}>
            View Invoice (Pop-up Dialog)
          </Button>
          <Button onClick={() => { setTab("label"); setOpen(true); }}>
            View Shipping Label (Pop-up Dialog)
          </Button>
        </div>
        <InvoicePreviewDialog
          invoiceId={invoice.id}
          shipmentId={shipment.id}
          initialTab={tab}
          open={open}
          onOpenChange={setOpen}
          initialData={{
            ...invoice,
            shipment,
          }}
        />
      </div>
    )
  },
}
