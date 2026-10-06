import { ScannerProvider } from "@/components/scanner/scanner-provider"
import { ReactNode } from "react"

export default function InvoiceLayout({ children }: { children: ReactNode }) {
  return <ScannerProvider>{children}</ScannerProvider>
}
