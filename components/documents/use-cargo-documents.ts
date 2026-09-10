"use client"
import { useCallback, useEffect, useState } from "react"
import { z } from "zod"
const documents = z.array(
  z.object({
    name: z.string(),
    path: z.string(),
    size: z.number(),
    createdAt: z.string(),
  })
)
export function useCargoDocuments(
  entity: "shipments" | "manifests",
  id: string
) {
  const [files, setFiles] = useState<z.infer<typeof documents>>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const endpoint = `/api/cargo-documents/${entity}/${id}`
  const load = useCallback(
    (signal?: AbortSignal) =>
      fetch(endpoint, { signal, cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) throw new Error()
          return documents.parse(await response.json())
        })
        .then((result) => {
          if (!signal?.aborted) {
            setFiles(result)
            setError("")
          }
        })
        .catch(() => {
          if (!signal?.aborted)
            setError("Documents could not be loaded. Try again.")
        })
        .finally(() => {
          if (!signal?.aborted) setLoading(false)
        }),
    [endpoint]
  )
  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load])
  async function upload(file: File) {
    if (
      !file.size ||
      file.size > 5 * 1024 * 1024 ||
      !["application/pdf", "image/jpeg", "image/png"].includes(file.type)
    ) {
      setError("Choose a PDF, JPEG or PNG under 5 MB.")
      return false
    }
    setUploading(true)
    setError("")
    try {
      const response = await fetch(
        endpoint + "?filename=" + encodeURIComponent(file.name),
        { method: "POST", headers: { "Content-Type": file.type }, body: file }
      )
      const result = await response.json()
      if (!response.ok)
        throw new Error(
          typeof result.error === "string" ? result.error : "Upload failed"
        )
      await load()
      if (typeof result.warning === "string") setError(result.warning)
      return true
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to upload document."
      )
      return false
    } finally {
      setUploading(false)
    }
  }
  return {
    files,
    error,
    loading,
    uploading,
    upload,
    retry: () => {
      setLoading(true)
      void load()
    },
  }
}
