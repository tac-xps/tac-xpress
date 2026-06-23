import { DM_Sans, Lora, IBM_Plex_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/providers/auth-provider"
import { auth } from "@/auth"
import { QueryProvider } from "@/providers/query-provider"
import { PostHogProvider } from "@/providers/posthog-provider"
import { Toaster } from "sonner"
import * as Sentry from "@sentry/nextjs"
import PostHogClient from "@/lib/posthog"

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  preload: false,
})

const fontMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  preload: false,
})

export const metadata = {
  title: "TAC-XPRESS | Tactical Air Cargo Express",
  description:
    "Enterprise-grade logistics and cargo operations across Northeast India and New Delhi.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  
  let bootstrappedFeatureFlags: Record<string, string | boolean> | undefined = undefined

  if (session?.user) {
    Sentry.setUser({
      id: session.user.id,
      email: session.user.email ?? undefined,
    })

    const posthog = PostHogClient()
    if (posthog && session.user.id) {
      try {
        bootstrappedFeatureFlags = await posthog.getAllFlags(session.user.id)
      } catch (e) {
        // Fallback silently if posthog fails
      }
    }
  }


  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        fontSerif.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body>
        <PostHogProvider bootstrappedFeatureFlags={bootstrappedFeatureFlags}>
          <QueryProvider>
            <AuthProvider session={session}>
              <ThemeProvider>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster position="top-right" richColors />
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
