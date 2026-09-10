"use client"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toCsv } from "@/lib/csv"
export function ExportPage({
  filename,
  rows,
}: {
  filename: string
  rows: (string | number | null)[][]
}) {
  return (
    <Button
      variant="outline"
      disabled={rows.length < 2}
      onClick={() => {
        const url = URL.createObjectURL(
          new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" })
        )
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = filename + ".csv"
        anchor.click()
        URL.revokeObjectURL(url)
      }}
    >
      <Download />
      Export page
    </Button>
  )
}
