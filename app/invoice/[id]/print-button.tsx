"use client"

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-full bg-[#0F1B3A] px-4 py-2 text-xs font-medium text-primary-foreground shadow-lg transition hover:bg-[#0F1B3A]/90"
    >
      <Printer className="h-4 w-4" />
      Print / Save PDF
    </button>
  )
}
