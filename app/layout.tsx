import { Metadata } from "next"
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/providers/query-provider"
import { PostHogProvider } from "@/providers/posthog-provider"
import { Toaster } from "sonner"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const tacSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tac-sans",
  display: "swap",
})

const tacMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tac-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://tac-xpress.com"),
  title: "TAC-XPRESS | Air and surface cargo",
  description:
    "Air and surface cargo between Northeast India and New Delhi. Explore services, prepare your shipment and track with your AWB.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn("font-sans", tacSans.variable, tacMono.variable)}
    >
      <body
        className={cn("font-sans", tacSans.variable, tacMono.variable)}
      >
        <PostHogProvider>
          <QueryProvider>
            <ThemeProvider>
              <NuqsAdapter>
                <TooltipProvider>{children}</TooltipProvider>
              </NuqsAdapter>
              <Toaster position="top-right" richColors />
            </ThemeProvider>
          </QueryProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}

