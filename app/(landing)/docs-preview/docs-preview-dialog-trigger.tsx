"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { InvoicePreviewDialog } from "@/app/dashboard/invoices/invoice-preview-dialog"
import { Eye, Tag } from "lucide-react"
import type { Invoice, Shipment } from "@/lib/db/schema"

export function DocsPreviewDialogTrigger({
  invoice,
  shipment,
}: {
  invoice: Invoice
  shipment: Shipment
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"invoice" | "label">("invoice")

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs bg-white shadow-sm"
          onClick={() => {
            setTab("invoice")
            setOpen(true)
          }}
        >
          <Eye className="size-3.5" />
          <span>View Invoice (Pop-up Dialog)</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs bg-white shadow-sm"
          onClick={() => {
            setTab("label")
            setOpen(true)
          }}
        >
          <Tag className="size-3.5" />
          <span>View Label (Pop-up Dialog)</span>
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
    </>
  )
}
