import { SignJWT, jwtVerify } from "jose"
import { resolveAuthSecret } from "@/lib/auth/secret"

const CHALLENGE_EXPIRY = "5m"

export interface MfaChallengePayload {
  userId: string
  email: string
  role: string
  methods: ("totp" | "passkey")[]
  expectedChallenge?: string
}

function getJwtSecret(): Uint8Array {
  const secret = resolveAuthSecret()
  return new TextEncoder().encode(secret)
}

/**
 * Creates an ephemeral, tamper-proof MFA challenge token valid for 5 minutes.
 */
export async function createMfaChallengeToken(
  payload: MfaChallengePayload
): Promise<string> {
  const secret = getJwtSecret()
  return await new SignJWT({ ...payload, sub: payload.userId, purpose: "mfa-challenge" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(CHALLENGE_EXPIRY)
    .sign(secret)
}

/**
 * Validates and decodes the MFA challenge token.
 */
export async function verifyMfaChallengeToken(
  token: string
): Promise<MfaChallengePayload | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    })

    if (payload.purpose !== "mfa-challenge" || !payload.sub) {
      return null
    }

    return {
      userId: payload.sub,
      email: payload.email as string,
      role: payload.role as string,
      methods: (payload.methods as ("totp" | "passkey")[]) || [],
      expectedChallenge: payload.expectedChallenge as string | undefined,
    }
  } catch {
    return null
  }
}

import { consumeAuthToken } from "@/lib/auth/token-consumption"

export interface MfaVerifiedPayload {
  userId: string
  email: string
  role: string
}

/**
 * Creates an ephemeral, single-use verified MFA grant token valid for 60 seconds.
 */
export async function createMfaVerifiedToken(
  payload: MfaVerifiedPayload
): Promise<string> {
  const secret = getJwtSecret()
  const jti = crypto.randomUUID()
  return await new SignJWT({
    sub: payload.userId,
    email: payload.email,
    role: payload.role,
    purpose: "mfa-verified",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime("60s")
    .sign(secret)
}

/**
 * Validates the short-lived verified MFA grant token and atomically consumes its JTI.
 */
export async function verifyMfaVerifiedToken(
  token: string
): Promise<MfaVerifiedPayload | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    })

    if (payload.purpose !== "mfa-verified" || !payload.sub || !payload.jti) {
      return null
    }

    const claimed = await consumeAuthToken(
      payload.jti as string,
      "mfa_verified_grant",
      new Date(Date.now() + 65_000)
    )
    if (!claimed) {
      return null // Token replay rejected across serverless instances
    }

    return {
      userId: payload.sub,
      email: payload.email as string,
      role: payload.role as string,
    }
  } catch {
    return null
  }
}

export interface RegistrationChallengePayload {
  userId: string
  expectedChallenge: string
}

/**
 * Creates a short-lived token for WebAuthn passkey registration valid for 5 minutes.
 */
export async function createRegistrationChallengeToken(
  payload: RegistrationChallengePayload
): Promise<string> {
  const secret = getJwtSecret()
  return await new SignJWT({
    sub: payload.userId,
    expectedChallenge: payload.expectedChallenge,
    purpose: "webauthn-registration",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(CHALLENGE_EXPIRY)
    .sign(secret)
}

/**
 * Validates the passkey registration challenge token.
 */
export async function verifyRegistrationChallengeToken(
  token: string
): Promise<RegistrationChallengePayload | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    })

    if (payload.purpose !== "webauthn-registration" || !payload.sub) {
      return null
    }

    return {
      userId: payload.sub,
      expectedChallenge: payload.expectedChallenge as string,
    }
  } catch {
    return null
  }
}
