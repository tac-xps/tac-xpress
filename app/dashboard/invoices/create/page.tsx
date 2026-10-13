import type { Metadata } from "next"
import { WizardForm } from "./wizard-form"

export const metadata: Metadata = {
  title: "Create Invoice | TAC-XPRESS",
  description: "Generate freight and tax invoices with GST and volumetric rate calculation.",
}

export default function CreateInvoicePage() {
  return (
    <div className="w-full flex-1 bg-background">
      <WizardForm />
    </div>
  )
}
