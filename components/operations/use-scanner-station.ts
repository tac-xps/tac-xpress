"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { getScannedShipmentDetails } from "@/app/actions/scanner-actions"
import { useScannerContext } from "@/components/scanner/scanner-provider"
type LookupResult = Awaited<ReturnType<typeof getScannedShipmentDetails>>
export function useScannerStation(initialAwb: string) {
  const [query, setQuery] = useState(initialAwb)
  const [result, setResult] = useState<LookupResult | null>(null)
  const [loading, setLoading] = useState(Boolean(initialAwb))
  const request = useRef(0)
  const { setOverrideHandler } = useScannerContext()
  const commit = useCallback((value: LookupResult, version: number) => {
    if (version !== request.current) return false
    setResult(value)
    setLoading(false)
    return value.success
  }, [])
  const search = useCallback(
    async (code: string) => {
      const normalized = code.trim().toUpperCase().slice(0, 64)
      const version = ++request.current
      setQuery(normalized)
      setLoading(true)
      setResult(null)
      try {
        return commit(await getScannedShipmentDetails(normalized), version)
      } catch {
        return commit(
          {
            success: false,
            error: "Unable to retrieve this shipment. Try again.",
          },
          version
        )
      }
    },
    [commit]
  )
  useEffect(() => {
    const version = ++request.current
    if (initialAwb)
      getScannedShipmentDetails(initialAwb)
        .then((value) => commit(value, version))
        .catch(() =>
          commit(
            {
              success: false,
              error: "Unable to retrieve this shipment. Try again.",
            },
            version
          )
        )
    return () => {
      request.current++
    }
  }, [initialAwb, commit])
  useEffect(() => {
    setOverrideHandler(search)
    return () => setOverrideHandler(null)
  }, [search, setOverrideHandler])
  return {
    query,
    setQuery,
    loading,
    result,
    search,
    clear: () => {
      request.current++
      setQuery("")
      setResult(null)
      setLoading(false)
    },
  }
}
