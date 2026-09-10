import { z } from "zod"
import { containsPattern } from "@/lib/table-query"
export class LookupInputError extends Error {}
export function lookupParams(request: Request) {
  const params = new URL(request.url).searchParams
  const id = params.get("id")
  if (id && !z.string().uuid().safeParse(id).success)
    throw new LookupInputError("Invalid selected record")
  return {
    id,
    pattern: containsPattern((params.get("query") ?? "").trim().slice(0, 100)),
  }
}
