import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type VerifiedRegistrationResponse,
  type VerifiedAuthenticationResponse,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from "@simplewebauthn/server"
import type { UserPasskey } from "@/lib/db/schema"
import { getAppUrl } from "@/lib/config/app-url"

const RP_NAME = "Tac-Xpress Logistics"

export function getWebAuthnConfig(hostHeader?: string | null) {
  const isDev = process.env.NODE_ENV !== "production"
  let originStr: string

  if (hostHeader) {
    const protocol = isDev ? "http" : "https"
    originStr = `${protocol}://${hostHeader}`
  } else {
    try {
      originStr = getAppUrl(process.env.NEXT_PUBLIC_APP_URL, process.env.NODE_ENV)
    } catch {
      originStr = isDev ? "http://localhost:3000" : "https://tacservice.in"
    }
  }

  const url = new URL(originStr)

  // In development, bind to localhost or the actual host domain
  const rpID = isDev && (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    ? "localhost"
    : url.hostname

  return {
    rpName: RP_NAME,
    rpID,
    origin: url.origin,
  }
}

/**
 * Generates registration options (challenge) for Windows Hello / Passkeys.
 */
export async function createPasskeyRegistrationOptions(
  user: { id: string; email: string },
  existingPasskeys: UserPasskey[] = [],
  hostHeader?: string | null
) {
  const { rpName, rpID } = getWebAuthnConfig(hostHeader)

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.email,
    userID: new TextEncoder().encode(user.id),
    userDisplayName: user.email,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred", // Prompts Windows Hello PIN / Biometrics
    },
    excludeCredentials: existingPasskeys.map((pk) => ({
      id: pk.id,
      transports: (pk.transports as any) || undefined,
    })),
  })

  return options
}

/**
 * Verifies the client's WebAuthn registration response.
 */
export async function verifyPasskeyRegistration(
  response: RegistrationResponseJSON,
  expectedChallenge: string,
  hostHeader?: string | null
): Promise<VerifiedRegistrationResponse> {
  const { rpID, origin } = getWebAuthnConfig(hostHeader)

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  })

  return verification
}

/**
 * Generates authentication options (challenge) for Windows Hello / Passkeys.
 */
export async function createPasskeyAuthOptions(
  allowedPasskeys?: UserPasskey[],
  hostHeader?: string | null
) {
  const { rpID } = getWebAuthnConfig(hostHeader)

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
    allowCredentials: allowedPasskeys?.map((pk) => ({
      id: pk.id,
      transports: (pk.transports as any) || undefined,
    })),
  })

  return options
}

/**
 * Verifies the client's WebAuthn authentication response.
 */
export async function verifyPasskeyAuth(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  passkey: UserPasskey,
  hostHeader?: string | null
): Promise<VerifiedAuthenticationResponse> {
  const { rpID, origin } = getWebAuthnConfig(hostHeader)

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: passkey.id,
      publicKey: Buffer.from(passkey.publicKey, "base64url"),
      counter: passkey.counter,
      transports: (passkey.transports as any) || undefined,
    },
    requireUserVerification: true,
  })

  return verification
}
