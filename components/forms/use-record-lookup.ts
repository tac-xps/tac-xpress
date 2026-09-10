import { useEffect, useState } from "react"
import type { ZodType } from "zod"
export function useRecordLookup<T>(
  endpoint: string,
  schema: ZodType<T>,
  selectedId?: string
) {
  const [query, setQuery] = useState("")
  const [records, setRecords] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => {
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
        if (!response.ok) throw new Error()
        const parsed = schema.array().parse(await response.json())
        if (!controller.signal.aborted) setRecords(parsed)
      } catch {
        if (!controller.signal.aborted) {
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
  }, [endpoint, schema, query, selectedId])
  return { records, loading, error, setQuery }
}
