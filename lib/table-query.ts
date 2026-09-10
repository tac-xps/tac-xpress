import { asc, desc, type AnyColumn } from "drizzle-orm"
export type RecordSearchParams = { page?: string | string[]; q?: string | string[]; status?: string | string[]; sort?: string | string[]; order?: string | string[] }
export function firstParam(value: string | string[] | undefined) { return (Array.isArray(value) ? value[0] : value) ?? "" }
export function parseRecordQuery(params: RecordSearchParams, allowedSorts: readonly string[], fallback = "createdAt") {
  const requested = firstParam(params.sort)
  return { q: firstParam(params.q).trim().slice(0, 100), status: firstParam(params.status) || "all", sort: allowedSorts.includes(requested) ? requested : fallback, order: firstParam(params.order) === "asc" ? "asc" as const : "desc" as const }
}
export function containsPattern(value: string) { return `%${value.replace(/[\\%_]/g, "\\$&")}%` }
export function recordOrder(column: AnyColumn, order: "asc" | "desc") { return order === "asc" ? asc(column) : desc(column) }

