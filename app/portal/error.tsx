"use client"
import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error, { tags: { area: "portal" } }) }, [error])
  return <section role="alert" className="mx-auto max-w-lg space-y-4 py-16">
    <h1 className="text-2xl font-semibold">We couldn’t load your workspace.</h1>
    <p className="text-muted-foreground">Your records haven’t changed. Try loading this page again.</p>
    <Button onClick={reset}>Try again</Button>
  </section>
}
