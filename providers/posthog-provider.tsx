"use client"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()

  useEffect(() => {
    if (pathname && ph) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) url += "?" + search
      ph.capture("$pageview", { $current_url: url })
    }
  }, [pathname, searchParams, ph])

  return null
}

import * as Sentry from "@sentry/nextjs"

export function PostHogProvider({
  children,
  bootstrappedFeatureFlags,
}: {
  children: React.ReactNode
  bootstrappedFeatureFlags?: Record<string, string | boolean>
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        bootstrap: bootstrappedFeatureFlags ? {
          featureFlags: bootstrappedFeatureFlags,
        } : undefined,
      })

      posthog.onSessionId((sessionId) => {
        Sentry.setTag("posthog_session_id", sessionId)
      })
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
