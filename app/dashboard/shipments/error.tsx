"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import posthog from "posthog-js"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function ShipmentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { area: "dashboard_shipments" } })
    posthog.captureException(error, { digest: error.digest })
  }, [error])

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-none border border-dashed border-border bg-muted/20 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-none bg-destructive/10 text-destructive">
        <AlertCircle className="size-6" />
      </div>
      <div className="flex flex-col gap-1 max-w-md">
        <h2 className="text-lg font-semibold text-foreground">
          Shipments register could not be loaded
        </h2>
        <p className="text-sm text-muted-foreground">
          An error occurred while loading shipment records. This has been reported to engineering.
        </p>
      </div>
      <Button variant="outline" onClick={() => reset()} className="gap-2 cursor-pointer">
        <RefreshCw className="size-4" />
        Retry loading
      </Button>
    </div>
  )
}
