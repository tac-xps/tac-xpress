import { AsyncLocalStorage } from "node:async_hooks"
import { sql, type SQL } from "drizzle-orm"

type LookupPhase = "role" | "lookup"

type LookupTiming = {
  id: string
  durations: Record<string, number>
}

export const customerLookupTiming = new AsyncLocalStorage<LookupTiming>()
export const customerLookupTimingEnabled =
  process.env.CUSTOMER_LOOKUP_TIMING === "true"

const pending = new Map<string, { dispatchedAt?: number }>()

export function markCustomerQueryDispatched(_connection: number, statement: string) {
  const key = /\/\* lookup:([a-f\d-]{36}:(?:role|lookup)) \*\//.exec(statement)?.[1]
  const query = key ? pending.get(key) : undefined
  if (query) query.dispatchedAt = performance.now()
}

export async function timeCustomerQuery<T>(
  phase: LookupPhase,
  query: (annotate: (predicate: SQL | undefined) => SQL | undefined) => PromiseLike<T>
): Promise<T> {
  const timing = customerLookupTiming.getStore()
  if (!timing) return await query((predicate) => predicate)

  const started = performance.now()
  const key = `${timing.id}:${phase}`
  const sample: { dispatchedAt?: number } = {}
  pending.set(key, sample)
  try {
    return await query((predicate) => sql`${predicate} ${sql.raw(`/* lookup:${key} */`)}`)
  } finally {
    const finished = performance.now()
    pending.delete(key)
    timing.durations[phase] = finished - started
    if (sample.dispatchedAt !== undefined) {
      timing.durations[`${phase}Pool`] = sample.dispatchedAt - started
      timing.durations[`${phase}SqlRoundTrip`] = finished - sample.dispatchedAt
    }
  }
}
