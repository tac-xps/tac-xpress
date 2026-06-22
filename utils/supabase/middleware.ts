import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
      global: {
        fetch: async (url, options) => {
          // Add a 3-second timeout to prevent middleware from hanging the app
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)
          try {
            return await fetch(url, { ...options, signal: controller.signal })
          } catch (error: any) {
            // Next.js Edge runtime throws a raw DOMException on abort which can crash the process
            if (error.name === "AbortError") {
              return new Response(
                JSON.stringify({ error: "Supabase timeout" }),
                { status: 504, headers: { "x-supabase-timeout": "1" } }
              )
            }
            throw error
          } finally {
            clearTimeout(timeoutId)
          }
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  let user = null
  let isTimeout = false
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      if (
        error.status === 504 ||
        error.message?.includes("Supabase timeout") ||
        error.name === "AuthRetryableFetchError" ||
        (error as any).code === "ECONNRESET" ||
        (error as any).cause?.code === "ECONNRESET" ||
        error.message?.includes("fetch failed")
      ) {
        console.warn(
          "Supabase auth timeout/network error in middleware, skipping redirect"
        )
        isTimeout = true
      } else if (error.status === 400 || error.status === 401) {
        console.warn("Supabase auth error in middleware:", error.message)
      } else {
        console.error("Supabase API error in middleware:", error)
      }
    }

    user = data.user
  } catch (error: any) {
    // Fallback catch for unexpected throws (though Supabase SDK usually returns error object)
    if (
      error?.code === "ECONNRESET" ||
      error?.cause?.code === "ECONNRESET" ||
      error?.message?.includes("fetch failed")
    ) {
      console.error(
        "Supabase network error in middleware (ECONNRESET/fetch failed):",
        error
      )
      isTimeout = true
    } else if (error?.message?.includes("Supabase timeout")) {
      console.warn("Supabase auth timed out in middleware, skipping redirect")
      isTimeout = true
    } else if (error?.status === 400 || error?.status === 401) {
      console.warn("Supabase auth error in middleware:", error.message)
    } else {
      console.error("Supabase API error in middleware:", error)
    }
  }

  // Don't redirect to login on timeout — it's a transient infra issue, not unauthenticated
  if (
    !user &&
    !isTimeout &&
    request.nextUrl.pathname.startsWith("/dashboard") &&
    !request.nextUrl.pathname.startsWith("/dashboard/login")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
