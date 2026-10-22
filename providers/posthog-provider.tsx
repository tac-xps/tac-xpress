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
    if (
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      if (
        typeof window !== "undefined" &&
        !(posthog as unknown as { __loaded?: boolean }).__loaded
      ) {
        const isDev = process.env.NODE_ENV === "development"
        const apiHost = isDev
          ? process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"
          : "/ingest"

        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: apiHost,
          ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
          person_profiles: "identified_only",
          capture_pageview: false,
          capture_pageleave: true,
          autocapture: !isDev,
          disable_session_recording: isDev,
          advanced_disable_decide: isDev && process.env.NEXT_PUBLIC_POSTHOG_DEV !== "true",
          bootstrap: bootstrappedFeatureFlags
            ? {
                featureFlags: bootstrappedFeatureFlags,
              }
            : undefined,
        })

        posthog.onSessionId((sessionId) => {
          Sentry.setTag("posthog_session_id", sessionId)
        })
      }
    }
  }, [bootstrappedFeatureFlags])

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
