import { z } from "zod"
import * as Sentry from "@sentry/nextjs"

/**
 * safeParse wrapper with Sentry logging.
 * Use this in ALL server actions instead of Schema.parse() or Schema.safeParse().
 *
 * @example
 * const data = safeParse(CreateShipmentSchema, input)
 */
export function safeParse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const schemaName =
      (schema as any)._def?.typeName ??
      schema.constructor.name ??
      "UnknownSchema"

    Sentry.captureException(result.error, {
      extra: {
        schema: schemaName,
        rawData: data,
        issues: result.error.issues,
      },
      tags: {
        area: "validation",
        type: "zod",
        schema: schemaName,
      },
    })

    // Re-throw a human-readable error for UI display
    const firstIssue = result.error.issues[0]
    const message = firstIssue
      ? `${firstIssue.path.join(".")} — ${firstIssue.message}`
      : "Validation failed"

    throw new Error(message)
  }

  return result.data
}

/**
 * Safe version that returns a result object instead of throwing.
 * Use this when you want to handle validation errors without try/catch.
 */
export function safeParseResult<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = safeParse(schema, data)
    return { success: true, data: parsed }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Validation failed",
    }
  }
}
