import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"
import withBundleAnalyzer from "@next/bundle-analyzer"

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
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
      "framer-motion",
      "mapbox-gl",
      "@aliimam/icons",
      "@aliimam/logos",
    ],
  },
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
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
    const contentSecurityPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")

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
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },

  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all" as const,
          },
        },
      }
    }
    return config
  },
  turbopack: {},
}

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const finalConfig = analyzer(nextConfig)

// Wrap config with bundle analyzer, then Sentry (only in production to prevent Turbopack hangs)
export default process.env.NODE_ENV === "development"
  ? finalConfig
  : withSentryConfig(finalConfig, {
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
