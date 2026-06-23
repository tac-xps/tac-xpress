"use client"

// Client Component wrapper so that `ssr: false` dynamic import is legal.
// Server Component layouts cannot use dynamic() with ssr:false directly —
// moving it here resolves the Next.js 16 Turbopack constraint.
import dynamic from "next/dynamic"

const NotificationProvider = dynamic(
  () =>
    import("@/components/providers/notification-provider").then(
      (m) => m.NotificationProvider
    ),
  { ssr: false }
)

export function NotificationWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <NotificationProvider>{children}</NotificationProvider>
}
