export function logManifestClientTiming(
  requestId: string,
  phase: "submit" | "response" | "committed-ui" | "interrupted" | "refresh",
  started: number
) {
  if (process.env.NEXT_PUBLIC_MANIFEST_TIMING !== "true") return
  console.info(JSON.stringify({
    event: "manifest-client",
    requestId,
    phase,
    elapsedMs: Math.round(performance.now() - started),
  }))
}
