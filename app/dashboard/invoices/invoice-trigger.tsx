"use client"

import { useState } from "react"
import { InvoiceSheet } from "./invoice-sheet"

export function InvoiceTrigger({
  shipmentId,
  awbNumber,
}: {
  shipmentId: string
  awbNumber: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        className="inline-block w-max cursor-pointer rounded border border-border bg-muted/50 px-2 py-1 text-xs transition-colors hover:bg-muted/80 hover:text-primary"
      >
        {awbNumber}
      </span>
      <InvoiceSheet
        shipmentId={shipmentId}
        awbNumber={awbNumber}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
