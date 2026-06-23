import { supabaseAdmin } from "@/lib/supabase/clients"

/**
 * Enqueue a failed operation to the Dead Letter Queue
 */
export async function enqueueDeadLetter(
  action: string,
  payload: any,
  error: any,
  retryCount: number = 0
) {
  const errorMessage =
    error instanceof Error ? error.message : JSON.stringify(error)

  const { error: dbError } = await supabaseAdmin
    .from("dead_letter_queue")
    .insert({
      action,
      payload,
      error: errorMessage,
      retry_count: retryCount,
    })

  if (dbError) {
    console.error(
      "[DLQ] Failed to write to dead letter queue:",
      dbError,
      "Original error:",
      errorMessage
    )
  }
}

/**
 * Execute a promise-returning function with exponential backoff retries.
 * If it fails after maxRetries, the error is written to the DLQ and the function resolves to null.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  action: string,
  payload: any,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T | null> {
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      return await fn()
    } catch (error: any) {
      attempt++

      console.warn(
        `[Retry ${attempt}/${maxRetries}] Action '${action}' failed:`,
        error?.message || error
      )

      if (attempt >= maxRetries) {
        console.error(
          `[Retry] Action '${action}' exhausted all retries. Sending to DLQ.`
        )
        await enqueueDeadLetter(action, payload, error, attempt)
        return null
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return null
}
