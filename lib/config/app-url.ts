/** A configured, trusted origin for emails and internal document requests. */
export function getAppUrl(
  value = process.env.NEXT_PUBLIC_APP_URL,
  environment = process.env.NODE_ENV
) {
  const raw =
    value?.trim() ||
    (environment === "production" ? "" : "http://localhost:3000")
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error(
      "NEXT_PUBLIC_APP_URL must be an absolute application origin."
    )
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/" ||
    !["http:", "https:"].includes(url.protocol) ||
    (environment === "production" && (url.protocol !== "https:" || local)) ||
    url.hostname === "mcp.supabase.com" ||
    url.hostname.endsWith(".supabase.co")
  ) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL must be the HTTPS website origin in production, not a Supabase or MCP URL."
    )
  }
  return url.origin
}
