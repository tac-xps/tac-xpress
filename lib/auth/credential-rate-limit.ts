import "server-only"
import crypto from "node:crypto"
import arcjet, { slidingWindow } from "@arcjet/next"
import * as Sentry from "@sentry/nextjs"
import { CredentialsSignin } from "next-auth"
import { resolveAuthSecret } from "@/lib/auth/secret"

class CredentialRateLimitError extends CredentialsSignin {
  code = "rate_limited"
}

class CredentialProtectionError extends CredentialsSignin {
  code = "protection_unavailable"
}

const consumedProofs = new Set<string>()

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

export function verifyRateLimitProof(proof: unknown, email: string): boolean {
  if (typeof proof !== "string") return false
  const [timestampStr, signature] = proof.split(".")
  if (!timestampStr || !signature) return false
  const timestamp = Number(timestampStr)
  if (!Number.isFinite(timestamp)) return false

  const now = Date.now()
  if (Math.abs(now - timestamp) > 60_000) return false
  if (consumedProofs.has(signature)) return false

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

  consumedProofs.add(signature)
  if (consumedProofs.size > 1000) {
    consumedProofs.clear()
  }
  return true
}

const limiter = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
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
    Sentry.captureException(error, { tags: { area: "credential_rate_limit" } })
    throw new CredentialProtectionError()
  }

  if (
    decision.isErrored() ||
    decision.results.some((result) => result.conclusion === "ERROR")
  ) {
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
