import { AsyncLocalStorage } from "node:async_hooks"
import { sql, type SQL } from "drizzle-orm"

type LookupTiming = {
  id: string
  durations: Record<string, number>
}

export const customerLookupTiming = new AsyncLocalStorage<LookupTiming>()
export const customerLookupTimingEnabled =
  process.env.CUSTOMER_LOOKUP_TIMING === "true"

const pending = new Map<string, { dispatchedAt?: number }>()

export function markCustomerQueryDispatched(_connection: number, statement: string) {
  const key = /\/\* lookup:([a-f\d-]{36}) \*\//.exec(statement)?.[1]
  const query = key ? pending.get(key) : undefined
  if (query) query.dispatchedAt = performance.now()
}

export async function timeCustomerQuery<T>(
  query: (annotate: (predicate: SQL | undefined) => SQL | undefined) => PromiseLike<T>
): Promise<T> {
  const timing = customerLookupTiming.getStore()
  if (!timing) return await query((predicate) => predicate)

  const started = performance.now()
  const key = timing.id
  const sample: { dispatchedAt?: number } = {}
  pending.set(key, sample)
  try {
    return await query((predicate) => sql`${predicate} ${sql.raw(`/* lookup:${key} */`)}`)
  } finally {
    const finished = performance.now()
    pending.delete(key)
    timing.durations.authorizedLookup = finished - started
    if (sample.dispatchedAt !== undefined) {
      timing.durations.pool = sample.dispatchedAt - started
      timing.durations.sqlRoundTrip = finished - sample.dispatchedAt
    }
  }
}
