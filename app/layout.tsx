import { Metadata } from "next"
import { IBM_Plex_Mono, Inter, Manrope } from "next/font/google"

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

const manropeHeading = Manrope({ subsets: ["latin"], variable: "--font-heading" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  preload: false,
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={cn("font-sans", inter.variable, manropeHeading.variable)}>
      <body
        className={cn(
          "antialiased font-sans",
          inter.variable,
          manropeHeading.variable,
          fontMono.variable,
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

