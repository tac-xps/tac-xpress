"use client"

import * as Sentry from "@sentry/nextjs"
import posthog from "posthog-js"
import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
    posthog.captureException(error, { digest: error.digest })
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-svh bg-background text-foreground antialiased font-sans">
        <main className="mx-auto flex min-h-svh max-w-xl flex-col items-start justify-center gap-6 px-6 py-16">
          <p className="font-mono text-sm text-destructive">500 · Application Error</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Something unexpected occurred.
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Our engineering team has been notified automatically via Sentry. You can try refreshing the action or return to safety.
          </p>
          {error.digest && (
            <div className="rounded-none border border-border bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
              Error Digest: {error.digest}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-9 items-center justify-center rounded-none bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex h-9 items-center justify-center rounded-none border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
