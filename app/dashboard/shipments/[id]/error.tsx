"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"

export default function ShipmentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          Could not load this shipment
        </h2>
        <p className="text-sm text-muted-foreground">
          The shipment details failed to load. This is usually temporary.
        </p>
      </div>
      <Button variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
