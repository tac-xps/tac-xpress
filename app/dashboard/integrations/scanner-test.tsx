"use client"
import { useState } from "react"
import Link from "next/link"
import { useBarcodeScanner } from "./use-barcode-scanner"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
function Scanner() {
  const { scanResult, scannerError } = useBarcodeScanner("reader-integration")
  return <div className="grid gap-4"><div id="reader-integration" className="w-full overflow-hidden rounded-none border" />{scannerError && <Alert variant="destructive"><AlertDescription>{scannerError}</AlertDescription></Alert>}{scanResult && <div className="grid gap-3"><p className="break-all text-sm">Scanned reference: {scanResult}</p><Button asChild><Link href={`/dashboard/tracking?awb=${encodeURIComponent(scanResult)}`}>Look up shipment</Link></Button></div>}</div>
}
export function ScannerTest() {
  const [active, setActive] = useState(false)
  return <div className="grid gap-4"><Button variant="outline" onClick={() => setActive((value) => !value)}>{active ? "Stop camera" : "Test camera scanner"}</Button>{active && <Scanner />}</div>
}

