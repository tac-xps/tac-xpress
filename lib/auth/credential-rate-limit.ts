import "server-only"
import arcjet, { slidingWindow } from "@arcjet/next"
import * as Sentry from "@sentry/nextjs"
import { CredentialsSignin } from "next-auth"

class CredentialRateLimitError extends CredentialsSignin {
  code = "rate_limited"
}

class CredentialProtectionError extends CredentialsSignin {
  code = "protection_unavailable"
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
