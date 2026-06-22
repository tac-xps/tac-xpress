const DEV_FALLBACK_AUTH_SECRET =
  "fallback_secret_for_vercel_production_please_set_env"

export function getConfiguredAuthSecret() {
  return (
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    null
  )
}

export function resolveAuthSecret() {
  const secret = getConfiguredAuthSecret()
  if (secret) {
    return secret
  }

  // NextAuth runs on the server. If this code is evaluated in the browser
  // (e.g., via Storybook bundling shared libs), do not throw.
  if (
    (typeof window !== "undefined" && !process.env.VITEST) ||
    process.env.STORYBOOK === "true" ||
    process.env.STORYBOOK === "1"
  ) {
    return DEV_FALLBACK_AUTH_SECRET
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing AUTH_SECRET in production. NEXTAUTH_SECRET is only supported as a compatibility alias."
    )
  }

  return DEV_FALLBACK_AUTH_SECRET
}
