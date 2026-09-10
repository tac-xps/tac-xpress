import * as Sentry from "@sentry/nextjs"

export async function capturePostHogEvent(
  event: string,
  distinctId: string,
  properties: Record<string, unknown>
) {
  const apiKey = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) {
    return
  }

  const host =
    process.env.POSTHOG_HOST ||
    process.env.NEXT_PUBLIC_POSTHOG_HOST ||
    "https://us.i.posthog.com"

  try {
    const response = await fetch(`${host.replace(/\/$/, "")}/capture/`, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        event,
        distinct_id: distinctId,
        properties,
      }),
    })

    if (!response.ok) {
      Sentry.captureMessage("PostHog capture failed", {
        level: "warning",
        extra: { event, status: response.status },
      })
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "posthog_capture", event },
    })
  }
}
