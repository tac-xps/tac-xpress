/**
 * Jev client — TypeSafe System One model singleton.
 *
 * `jevClient` is `null` when `TYPESAFE_API_KEY` is not set. All callers must
 * check `isJevEnabled` (or null-guard `jevClient`) before using it.
 * This allows the project to run without a TypeSafe key, falling back to the
 * OpenAI triage path.
 */
import "server-only"
import { TypeSafeClient } from "@typesafe-ai/sdk"

/** True when a TypeSafe API key is configured in the environment. */
export const isJevEnabled = Boolean(process.env.TYPESAFE_API_KEY?.trim())

/**
 * Singleton Jev client, or `null` when TYPESAFE_API_KEY is not set.
 * Always check `isJevEnabled` before calling methods on this client.
 */
export const jevClient: TypeSafeClient | null = isJevEnabled
  ? new TypeSafeClient({ apiKey: process.env.TYPESAFE_API_KEY })
  : null
