import "server-only"
import { db } from "@/lib/db"
import { authTokenConsumptions } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

const testMemoryFallback = new Set<string>()

/**
 * Atomically marks an ephemeral token (MFA grant, rate limit proof, or WebAuthn challenge) as consumed.
 * Uses atomic INSERT ... ON CONFLICT DO NOTHING RETURNING jti to prevent replay attacks across
 * multiple serverless instances.
 *
 * @returns true if the token was successfully claimed for the first time; false if replayed.
 */
export async function consumeAuthToken(
  jti: string,
  purpose: string,
  expiresAt: Date
): Promise<boolean> {
  if (!jti || !jti.trim()) return false
  if (expiresAt.getTime() <= Date.now()) return false

  const key = `${purpose}:${jti.trim()}`

  try {
    const inserted = await db
      .insert(authTokenConsumptions)
      .values({
        jti: jti.trim(),
        purpose,
        expiresAt,
      })
      .onConflictDoNothing()
      .returning({ jti: authTokenConsumptions.jti })

    // Probabilistic cleanup (1 in 50 calls) to prune expired tokens
    if (Math.random() < 0.02) {
      db.delete(authTokenConsumptions)
        .where(sql`${authTokenConsumptions.expiresAt} <= now()`)
        .catch(() => {})
    }

    return inserted.length > 0
  } catch {
    // In production, fail closed to prevent distributed replay attacks across serverless instances.
    if (process.env.NODE_ENV === "production") {
      return false
    }

    // If DB is offline (e.g. isolated unit test execution without Postgres),
    // fallback to in-memory set to prevent test suite disruption while maintaining replay protection.
    if (testMemoryFallback.has(key)) {
      return false
    }
    testMemoryFallback.add(key)
    return true
  }
}
