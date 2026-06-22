"use client"

import { useScannerContext } from "@/components/scanner/scanner-provider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScanBarcode, ShieldCheck } from "lucide-react"

export default function WarehouseAuditPage() {
  const { lastScannedCode } = useScannerContext()

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Warehouse Audit
        </h1>
        <p className="mt-2 text-muted-foreground">
          Continuous scanning mode active. Scan an AWB or QR Code using the
          Helett HT20 (or any hardware scanner).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 border-2 border-dashed md:col-span-2 lg:col-span-3">
          <CardHeader className="pb-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ScanBarcode className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black uppercase">
              Ready to Scan
            </CardTitle>
            <CardDescription>
              Scan a package label. The system will automatically pop up the
              shipment details and quick actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 text-center">
            {lastScannedCode ? (
              <div className="text-sm">
                Last Scanned:{" "}
                <span className="rounded bg-muted px-2 py-1 font-mono font-bold">
                  {lastScannedCode}
                </span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Waiting for scanner input...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
