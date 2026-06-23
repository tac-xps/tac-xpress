import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"

function getRequiredEnv(
  name:
    | "NEXT_PUBLIC_SUPABASE_URL"
    | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    | "SUPABASE_SERVICE_ROLE_KEY"
) {
  let value: string | undefined
  if (name === "NEXT_PUBLIC_SUPABASE_URL")
    value = process.env.NEXT_PUBLIC_SUPABASE_URL
  else if (name === "NEXT_PUBLIC_SUPABASE_ANON_KEY")
    value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  else if (name === "SUPABASE_SERVICE_ROLE_KEY")
    value = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (value) return value

  // Dummy values to allow Next.js build and non-production environments to pass typechecks/imports
  if (name === "NEXT_PUBLIC_SUPABASE_URL") {
    return "https://dummy.supabase.co"
  }

  if (name === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
    return "dummy_anon_key"
  }

  return "dummy_service_role_key"
}

type SupabaseClientInstance = SupabaseClient<any, "public", any>
type BrowserSupabaseClientInstance = SupabaseClient<any, "public", any>

function createServerOnlyClient<T extends object>(
  factory: () => T,
  label: string
): T {
  if (typeof window !== "undefined") {
    return new Proxy(Object.create(null) as T, {
      get(): never {
        throw new Error(`${label} is only available on the server`)
      },
    })
  }

  return factory()
}

// Factory to create a client that throws ON USE (not on import) if variables are missing in production.
function createLazyClient(
  urlKey: "NEXT_PUBLIC_SUPABASE_URL",
  authKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_ROLE_KEY"
): SupabaseClientInstance {
  const isMissingVars =
    process.env.NODE_ENV === "production" &&
    (!process.env[urlKey] || !process.env[authKey])

  if (isMissingVars) {
    return new Proxy({} as SupabaseClientInstance, {
      get(): never {
        throw new Error(
          `Missing required Supabase environment variables for production: ${urlKey} or ${authKey}`
        )
      },
    })
  }

  return createClient(getRequiredEnv(urlKey), getRequiredEnv(authKey), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Public client for landing page (no auth required)
export const supabasePublic = createServerOnlyClient(
  () =>
    createLazyClient(
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ),
  "supabasePublic"
)

let browserClient: BrowserSupabaseClientInstance | undefined

// Browser client for dashboard (with auth)
export const supabaseBrowser = () => {
  if (browserClient) return browserClient

  const isMissingVars =
    process.env.NODE_ENV === "production" &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (isMissingVars) {
    throw new Error(
      "Missing required Supabase environment variables for production: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
  }

  browserClient = createBrowserClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  )
  return browserClient
}

// Admin client for server-side operations (service role)
export const supabaseAdmin = createServerOnlyClient(
  () =>
    createLazyClient("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"),
  "supabaseAdmin"
)
