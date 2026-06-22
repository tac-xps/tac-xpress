"use client"

import { SessionProvider } from "next-auth/react"
import { type Session } from "next-auth"
import * as Sentry from "@sentry/nextjs"
import posthog from "posthog-js"
import { useEffect } from "react"

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  useEffect(() => {
    if (session?.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email ?? undefined,
      })
      posthog.identify(session.user.id, {
        email: session.user.email ?? undefined,
      })
    } else {
      Sentry.setUser(null)
      posthog.reset()
    }
  }, [session])

  return <SessionProvider session={session}>{children}</SessionProvider>
}
