"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { IndianRupee, FileText, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

interface ModalFinancialsProps {
  shipmentId: string
  invoice?: {
    id?: string | null
    amount: number
    balanceDue?: number | null
    advancePaid?: number | null
    status: string
    paymentMode?: string | null
    pdfUrl?: string | null
  } | null
}

export function ModalFinancials({ shipmentId, invoice }: ModalFinancialsProps) {
  const formatCurrency = (amountInPaise: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amountInPaise / 100)
  }

  if (!invoice) {
    return (
      <Card className="rounded-none border-border shadow-xs flex flex-col">
        <CardHeader className="border-b bg-muted/40 py-3.5 px-4 sm:px-5">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase">
            <IndianRupee className="size-4 text-primary shrink-0" />
            Invoice & Financials
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-2">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <FileText className="size-5" />
          </div>
          <p className="text-sm font-medium text-foreground">No Invoice Generated</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Financial records have not been attached to this shipment manifest.
          </p>
        </CardContent>
      </Card>
    )
  }

  const isPaid = invoice.status === "paid"
  const balanceDue = invoice.balanceDue

  return (
    <Card className="rounded-none border-border shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b bg-muted/40 py-3.5 px-4 sm:px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase">
              <IndianRupee className="size-4 text-primary shrink-0" />
              Invoice & Financials
            </CardTitle>
            <Badge
              variant={isPaid ? "default" : "destructive"}
              className="rounded-none uppercase font-mono text-[10px] tracking-wider font-semibold"
            >
              {isPaid ? (
                <CheckCircle2 className="size-3 mr-1" />
              ) : (
                <AlertCircle className="size-3 mr-1" />
              )}
              {invoice.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Total & Balance Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border/80 bg-muted/20 p-3 space-y-1">
              <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Total Amount
              </span>
              <p className="font-mono text-lg font-bold text-foreground truncate">
                {formatCurrency(invoice.amount)}
              </p>
            </div>

            <div
              className={`border p-3 space-y-1 ${
                isPaid
                  ? "border-status-delivered/30 bg-status-delivered-wash text-status-delivered"
                  : "border-destructive/30 bg-destructive/5 text-destructive"
              }`}
            >
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase opacity-80">
                Balance Due
              </span>
              <p className="font-mono text-lg font-bold truncate">
                {balanceDue != null ? formatCurrency(balanceDue) : "—"}
              </p>
            </div>
          </div>

          {/* Payment Terms Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Payment Mode
              </span>
              <p className="font-semibold text-foreground capitalize">
                {invoice.paymentMode ? invoice.paymentMode.replace(/_/g, " ") : "Unspecified"}
              </p>
            </div>

            {invoice.advancePaid != null && invoice.advancePaid > 0 && (
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Advance Paid
                </span>
                <p className="font-mono font-medium text-foreground">
                  {formatCurrency(invoice.advancePaid)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <Separator className="mb-3" />
        <div className="flex items-center justify-between gap-2">
          {invoice.pdfUrl ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none text-xs w-full justify-center"
            >
              <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="size-3.5 mr-1.5" />
                Download PDF
              </a>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none text-xs w-full justify-center"
            >
              <Link href={`/dashboard/shipments/${shipmentId}`}>
                <ExternalLink className="size-3.5 mr-1.5" />
                View Full Dossier
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
