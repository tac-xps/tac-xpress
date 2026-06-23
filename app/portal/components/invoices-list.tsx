"use client"

import { useState } from "react"
import { downloadInvoice } from "@/app/actions/portal-invoices"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileText, Loader2, Package } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type Invoice = {
  id: string
  amount: number
  status: string
  pdf_url?: string | null
  created_at: string
  updated_at: string
  payment_mode?: string | null
  balance_due?: number | null
  subtotal?: number | null
  shipment_id?: string | null
  shipment?: {
    awb_number: string
    origin: string
    destination: string
    status: string
  } | null
}

const STATUS_STYLES: Record<string, string> = {
  unpaid: "bg-destructive/10 text-destructive border-destructive",
  paid: "border-primary/20 bg-primary/10 text-status-delivered",
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  async function handleDownload() {
    setDownloading(true)
    setDownloadError(null)
    try {
      const result = await downloadInvoice(invoice.id)
      if (result.success && result.data && result.data.url) {
        window.open(result.data.url, "_blank", "noopener,noreferrer")
      } else {
        setDownloadError("Invoice PDF not available yet. Contact support.")
      }
    } catch {
      setDownloadError("Failed to download invoice. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  const shipment = Array.isArray(invoice.shipment)
    ? invoice.shipment[0]
    : invoice.shipment

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Invoice #{invoice.id.slice(0, 8).toUpperCase()}
              </p>
              {shipment && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Package className="h-3 w-3" />
                  {shipment.awb_number} · {shipment.origin} →{" "}
                  {shipment.destination}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Issued {format(new Date(invoice.created_at), "dd MMM yyyy")}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
            <div className="text-right">
              <p className="text-lg font-bold">
                ₹
                {(invoice.amount ?? 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
              {invoice.balance_due != null && invoice.balance_due > 0 && (
                <p className="text-xs text-destructive">
                  ₹{invoice.balance_due.toLocaleString("en-IN")} due
                </p>
              )}
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                STATUS_STYLES[invoice.status] ??
                  "border-border bg-muted text-muted-foreground"
              )}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {invoice.payment_mode && (
            <p className="text-xs text-muted-foreground capitalize">
              Payment: {invoice.payment_mode.replace(/_/g, " ")}
            </p>
          )}
          <div className="ml-auto space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {downloading ? "Generating..." : "Download PDF"}
            </Button>
            {downloadError && (
              <p className="text-right text-xs text-destructive">
                {downloadError}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function InvoicesList({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/20 py-16 text-center">
        <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="font-medium">No invoices yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoices are generated once your shipments are delivered and billed.
        </p>
      </div>
    )
  }

  const unpaid = invoices.filter((i) => i.status === "unpaid")
  const paid = invoices.filter((i) => i.status === "paid")

  return (
    <div className="space-y-8">
      {unpaid.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            Outstanding ({unpaid.length})
          </h2>
          <div className="space-y-3">
            {unpaid.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        </section>
      )}

      {paid.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            Paid ({paid.length})
          </h2>
          <div className="space-y-3">
            {paid.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
