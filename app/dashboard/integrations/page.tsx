"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ScanBarcodeIcon,
  MessageCircleIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react"
import { useBarcodeScanner } from "./use-barcode-scanner"

function BarcodeScanner() {
  const { scanResult, scannerError } = useBarcodeScanner("reader-integration")

  if (scannerError) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-2 text-destructive">
        <AlertCircleIcon className="h-5 w-5" />
        <span>{scannerError}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        id="reader-integration"
        className="w-full max-w-sm overflow-hidden rounded-lg border"
      ></div>
      {scanResult && (
        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/50 px-4 py-2 text-foreground">
          <CheckCircle2Icon className="h-5 w-5 text-foreground" />
          <span>
            Scanned AWB: <strong>{scanResult}</strong>
          </span>
        </div>
      )}
    </div>
  )
}

export default function IntegrationsPage() {
  const [scannerActive, setScannerActive] = useState(false)

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Configure external services and hardware connections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/50 bg-muted/50 text-foreground">
              <MessageCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>WhatsApp API (Lumin AI)</CardTitle>
              <CardDescription>Automated invoice delivery</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Connected to Lumin AI / WPBox. Active and ready to send PDF
              invoices to customers automatically.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2Icon className="h-4 w-4" />
              Connected
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/50 bg-muted/50 text-foreground">
              <ScanBarcodeIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Barcode Scanner</CardTitle>
              <CardDescription>
                Hardware & Web Camera integration
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Use your device camera to scan AWB barcodes and instantly update
              tracking events.
            </p>
            {!scannerActive ? (
              <Button onClick={() => setScannerActive(true)}>
                Activate Camera Scanner
              </Button>
            ) : (
              <BarcodeScanner />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
