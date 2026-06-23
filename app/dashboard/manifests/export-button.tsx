"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"

export function ExportManifestButton() {
  const handleExport = () => {
    toast.success("Manifests exported successfully!")
  }

  return (
    <Button
      variant="outline"
      className="border-border/50 bg-background"
      onClick={handleExport}
    >
      <Download className="mr-2 size-4" />
      Export
    </Button>
  )
}
