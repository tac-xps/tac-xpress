import { useEffect, useState } from "react"
import * as Sentry from "@sentry/nextjs"
import posthog from "posthog-js"
import type { ZodType } from "zod"
class RecordLookupError extends Error {
  name = "RecordLookupError"
  constructor(endpoint: string, readonly status: number) {
    super(`Record lookup ${endpoint} returned ${status}`)
  }
}
export function useRecordLookup<T>(
  endpoint: string,
  schema: ZodType<T>,
  selectedId?: string,
  enabled: boolean = true
) {
  const [query, setQuery] = useState("")
  const [records, setRecords] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError("")
      try {
        const params = new URLSearchParams({ query })
        if (selectedId) params.set("id", selectedId)
        const response = await fetch(endpoint + "?" + params, {
          signal: controller.signal,
          cache: "no-store",
        })
        if (!response.ok) throw new RecordLookupError(endpoint, response.status)
        const parsed = schema.array().parse(await response.json())
        if (!controller.signal.aborted) setRecords(parsed)
      } catch (err) {
        if (!controller.signal.aborted) {
          const status =
            err instanceof RecordLookupError ? err.status : undefined
          if (status !== 401 && status !== 403) {
            Sentry.captureException(err, { tags: { record_lookup: endpoint } })
            posthog.captureException(err, {
              record_lookup_endpoint: endpoint,
              record_lookup_status: status,
            })
          }
          setRecords([])
          setError(
            "Unable to load records. Check your connection or sign in again."
          )
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [endpoint, schema, query, selectedId, enabled])
  return { records, loading, error, setQuery }
}
