import type { NextConfig } from "next"
import { EventEmitter } from "events"
import withBundleAnalyzer from "@next/bundle-analyzer"

if (EventEmitter.defaultMaxListeners < 50) {
  EventEmitter.defaultMaxListeners = 50
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/signin",
        permanent: true,
      },
      {
        source: "/term",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/dashboard/onboarding",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/onboarding",
        destination: "/dashboard",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ]
  },
  experimental: {
    serverComponentsHmrCache: true,
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "motion",
      "motion/react",
      "date-fns",
      "@tiptap/core",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "maplibre-gl",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-label",
      "radix-ui",
      "sonner",
      "vaul",
      "@base-ui/react",
    ],
  },
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/documents/download": ["./node_modules/@sparticuz/chromium/bin/**/*", "./node_modules/.pnpm/@sparticuz+chromium@*/node_modules/@sparticuz/chromium/bin/**/*"],
    "/api/public/invoice-pdf": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
      "./node_modules/.pnpm/@sparticuz+chromium@*/node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "www.thiings.co" },
      {
        protocol: "https",
        hostname: (
          process.env.NEXT_PUBLIC_VERCEL_BLOB_HOSTNAME ??
          "your-project.public.blob.vercel-storage.com"
        ),
      },
    ],
  },

  async headers() {
    const isDev = process.env.NODE_ENV === "development"
    const contentSecurityPolicy = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https:`,
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "media-src 'self' blob: https:",
      "connect-src 'self' https: wss:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")

    const invoiceContentSecurityPolicy = contentSecurityPolicy.replace(
      "frame-ancestors 'none'",
      "frame-ancestors 'self'"
    )

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(), geolocation=(self), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/invoice/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: invoiceContentSecurityPolicy,
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  turbopack: {},
}

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const finalConfig = analyzer(nextConfig)

export default async function config() {
  const shouldEnableSentry =
    process.env.NODE_ENV !== "development" &&
    Boolean(process.env.SENTRY_AUTH_TOKEN)

  if (shouldEnableSentry) {
    const { withSentryConfig } = await import("@sentry/nextjs/config")
    return withSentryConfig(finalConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute:
        process.env.NODE_ENV === "production" ? "/monitoring" : undefined,
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
      webpack: {
        automaticVercelMonitors: true,
        reactComponentAnnotation: {
          enabled: true,
        },
      },
    })
  }

  return finalConfig
}
