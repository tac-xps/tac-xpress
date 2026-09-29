import { asc, desc, type AnyColumn } from "drizzle-orm"
import { DEFAULT_PAGE_SIZE, parsePage } from "@/components/ui/page-navigation"

export type RecordSearchParams = {
  page?: string | string[]
  per_page?: string | string[]
  q?: string | string[]
  status?: string | string[]
  sort?: string | string[]
  order?: string | string[]
  [key: string]: string | string[] | undefined
}

export function firstParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? ""
}

export function parsePerPage(
  value: string | string[] | undefined,
  defaultSize = DEFAULT_PAGE_SIZE,
  max = 100
): number {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isSafeInteger(parsed) && parsed > 0 && parsed <= max
    ? parsed
    : defaultSize
}

export function parseRecordQuery(
  params: RecordSearchParams,
  allowedSorts: readonly string[],
  fallback = "createdAt"
) {
  const requested = firstParam(params.sort)
  let sortCol = requested
  let sortDir = firstParam(params.order)

  if (requested.includes(".")) {
    const [col, dir] = requested.split(".")
    sortCol = col
    sortDir = dir
  }

  const sort = allowedSorts.includes(sortCol) ? sortCol : fallback
  const order = sortDir === "asc" ? ("asc" as const) : ("desc" as const)
  const page = parsePage(params.page)
  const pageSize = parsePerPage(params.per_page)

  return {
    page,
    pageSize,
    q: firstParam(params.q).trim().slice(0, 100),
    status: firstParam(params.status) || "all",
    sort,
    order,
  }
}

export function containsPattern(value: string) {
  return `%${value.replace(/[\\%_]/g, "\\$&")}%`
}

export function recordOrder(column: AnyColumn, order: "asc" | "desc") {
  return order === "asc" ? asc(column) : desc(column)
}
