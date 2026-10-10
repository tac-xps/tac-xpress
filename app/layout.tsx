import { Metadata } from "next"
import { DM_Sans, IBM_Plex_Mono, Manrope, Geist, Geist_Mono } from "next/font/google"

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
import { NuqsAdapter } from "nuqs/adapters/next/app"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const manropeHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://tac-xpress.com"),
  title: "TAC-XPRESS | Air and surface cargo",
  description:
    "Air and surface cargo between Northeast India and New Delhi. Explore services, prepare your shipment and track with your AWB.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (session?.user) {
    Sentry.setUser({
      id: session.user.id,
      email: session.user.email ?? undefined,
    })
  }

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "font-sans",
        dmSans.variable,
        ibmPlexMono.variable,
        manropeHeading.variable,
        geist.variable,
        geistMono.variable
      )}
    >
      <body
        className={cn(
          "antialiased font-sans",
          dmSans.variable,
          ibmPlexMono.variable,
          manropeHeading.variable,
          geist.variable,
          geistMono.variable
        )}
      >
        <PostHogProvider>
          <QueryProvider>
            <AuthProvider session={session}>
              <ThemeProvider>
                <NuqsAdapter>
                  <TooltipProvider>{children}</TooltipProvider>
                </NuqsAdapter>
                <Toaster position="top-right" richColors />
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}

