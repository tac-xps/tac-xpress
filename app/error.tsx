"use client"
import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error) }, [error])
  return <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-6 px-6 py-16">
    <h1 className="text-3xl font-semibold">We couldn’t load this page.</h1>
    <p className="text-muted-foreground">Try loading it again. If you were submitting a request, check its status before trying to submit it again.</p>
    <div className="flex flex-wrap gap-3"><Button onClick={reset}>Try again</Button><Button asChild variant="outline"><Link href="/">Back to home</Link></Button></div>
  </main>
}
