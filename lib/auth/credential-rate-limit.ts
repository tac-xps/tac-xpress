import "server-only"
import crypto from "node:crypto"
import arcjet, { createRemoteClient, slidingWindow } from "@arcjet/next"
import * as Sentry from "@sentry/nextjs"
import { CredentialsSignin } from "next-auth"
import { resolveAuthSecret } from "@/lib/auth/secret"

import { consumeAuthToken } from "@/lib/auth/token-consumption"

class CredentialRateLimitError extends CredentialsSignin {
  code = "rate_limited"
}

class CredentialProtectionError extends CredentialsSignin {
  code = "protection_unavailable"
}

export function createRateLimitProof(email: string): string {
  const secret = resolveAuthSecret()
  const timestamp = Date.now()
  const payload = `${email.toLowerCase()}:${timestamp}`
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
  return `${timestamp}.${signature}`
}

export async function verifyRateLimitProof(proof: unknown, email: string): Promise<boolean> {
  if (typeof proof !== "string") return false
  const [timestampStr, signature] = proof.split(".")
  if (!timestampStr || !signature) return false
  const timestamp = Number(timestampStr)
  if (!Number.isFinite(timestamp)) return false

  const now = Date.now()
  if (Math.abs(now - timestamp) > 60_000) return false

  const secret = resolveAuthSecret()
  const payload = `${email.toLowerCase()}:${timestamp}`
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")

  try {
    const sigBuf = Buffer.from(signature, "hex")
    const expBuf = Buffer.from(expectedSignature, "hex")
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return false
    }
  } catch {
    return false
  }

  return await consumeAuthToken(
    signature,
    "credential_rate_limit_proof",
    new Date(timestamp + 60_000)
  )
}

const limiter = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  client:
    typeof createRemoteClient === "function"
      ? createRemoteClient({ timeout: 2500 })
      : undefined,
  // `email` is reserved by Arcjet's email-validation rule and is not a
  // custom fingerprint characteristic. Use a separate account identifier.
  characteristics: ["credentialKey"],
  rules: [slidingWindow({ mode: "LIVE", interval: "15m", max: 10 })],
})

export async function allowCredentialAttempt(request: Request, email: string) {
  if (
    process.env.NODE_ENV === "development" &&
    (!process.env.ARCJET_KEY || process.env.ARCJET_KEY === "ajkey_placeholder")
  )
    return true
  let decision
  try {
    decision = await limiter.protect(request, { credentialKey: email })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    const isTransientTimeout =
      errorMsg.includes("deadline_exceeded") ||
      errorMsg.includes("timed out") ||
      errorMsg.includes("timeout")

    if (isTransientTimeout) {
      Sentry.captureMessage("Credential rate-limit network timed out; failing open", {
        level: "warning",
        tags: { area: "credential_rate_limit" },
        extra: { error: errorMsg },
      })
      return true
    }

    Sentry.captureException(error, { tags: { area: "credential_rate_limit" } })
    throw new CredentialProtectionError()
  }

  if (
    decision.isErrored() ||
    decision.results.some((result) => result.conclusion === "ERROR")
  ) {
    const reasonMessage =
      decision.reason && typeof decision.reason === "object" && "message" in decision.reason
        ? String((decision.reason as { message?: unknown }).message ?? "")
        : ""
    const isTransientTimeout =
      reasonMessage.includes("deadline_exceeded") ||
      reasonMessage.includes("timed out") ||
      reasonMessage.includes("timeout")

    if (isTransientTimeout) {
      Sentry.captureMessage("Credential rate-limit check timed out; failing open", {
        level: "warning",
        tags: { area: "credential_rate_limit" },
        extra: { decisionId: decision.id, reason: reasonMessage },
      })
      return true
    }

    Sentry.captureMessage("Credential rate-limit check failed", {
      level: "error",
      tags: { area: "credential_rate_limit" },
      extra: { decisionId: decision.id },
    })
    throw new CredentialProtectionError()
  }
  if (decision.isDenied()) throw new CredentialRateLimitError()
  if (!decision.isAllowed()) throw new CredentialProtectionError()
  return true
}
