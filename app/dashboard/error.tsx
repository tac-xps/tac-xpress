"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { usePostHog } from "posthog-js/react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const posthog = usePostHog()

  useEffect(() => {
    Sentry.captureException(error)
    posthog?.captureException(error, { digest: error.digest })
  }, [error, posthog])

  return (
    <div className="flex h-96 w-full flex-col items-center justify-center gap-4 rounded-none border border-dashed border-border bg-muted/20 text-center">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground">
          We encountered an error loading this section.
        </p>
      </div>
      <Button variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
