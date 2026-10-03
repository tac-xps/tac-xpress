"use server"

import { auth, signIn } from "@/auth"
import { db } from "@/lib/db"
import { userMfa, userPasskeys, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { headers } from "next/headers"
import {
  generateTotpSetup,
  verifyTotpToken,
  generateBackupCodes,
  verifyAndBurnBackupCode,
} from "@/lib/auth/mfa/totp"
import {
  createPasskeyRegistrationOptions,
  verifyPasskeyRegistration,
  createPasskeyAuthOptions,
  verifyPasskeyAuth,
} from "@/lib/auth/mfa/webauthn"
import {
  createMfaChallengeToken,
  verifyMfaChallengeToken,
  createMfaVerifiedToken,
  createRegistrationChallengeToken,
  verifyRegistrationChallengeToken,
} from "@/lib/auth/mfa/challenge-token"
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server"

// --- Staff User MFA Management Actions ---

export async function getMfaSettingsAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized access." }
  }

  const mfa = await db.query.userMfa.findFirst({
    where: eq(userMfa.userId, session.user.id),
  })

  const passkeys = await db
    .select()
    .from(userPasskeys)
    .where(eq(userPasskeys.userId, session.user.id))

  return {
    totpEnabled: Boolean(mfa?.totpEnabled),
    hasBackupCodes: Boolean(mfa?.backupCodesHash),
    passkeys: passkeys.map((p) => ({
      id: p.id,
      name: p.name,
      deviceType: p.deviceType,
      createdAt: p.createdAt.toISOString(),
      lastUsedAt: p.lastUsedAt ? p.lastUsedAt.toISOString() : null,
    })),
  }
}

// --- Rate Limiting & Attempt Counter for MFA ---
interface AttemptRecord {
  failedAttempts: number
  lockedUntil?: number
}

const loginAttemptStore = new Map<string, AttemptRecord>()
const MAX_MFA_ATTEMPTS = 5
const MFA_LOCKOUT_MS = 5 * 60 * 1000 // 5 minutes

function checkMfaLockout(key: string): { locked: boolean; remainingSeconds?: number } {
  const record = loginAttemptStore.get(key)
  if (!record) return { locked: false }
  if (record.lockedUntil) {
    const now = Date.now()
    if (now < record.lockedUntil) {
      return {
        locked: true,
        remainingSeconds: Math.ceil((record.lockedUntil - now) / 1000),
      }
    }
    loginAttemptStore.delete(key)
  }
  return { locked: false }
}

function recordMfaFailure(key: string): { locked: boolean } {
  const now = Date.now()
  const record = loginAttemptStore.get(key) || { failedAttempts: 0 }
  record.failedAttempts += 1
  if (record.failedAttempts >= MAX_MFA_ATTEMPTS) {
    record.lockedUntil = now + MFA_LOCKOUT_MS
    loginAttemptStore.set(key, record)
    return { locked: true }
  }
  loginAttemptStore.set(key, record)
  return { locked: false }
}

function clearMfaAttempts(key: string) {
  loginAttemptStore.delete(key)
}

export async function startTotpSetupAction() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return { error: "Unauthorized access." }
  }

  const setup = generateTotpSetup(session.user.email)

  await db
    .insert(userMfa)
    .values({
      userId: session.user.id,
      totpPendingSecretEncrypted: setup.encryptedSecret,
      totpEnabled: false,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userMfa.userId,
      set: {
        totpPendingSecretEncrypted: setup.encryptedSecret,
        updatedAt: new Date(),
      },
    })

  return {
    uri: setup.uri,
    secret: setup.secret,
  }
}

export async function confirmTotpSetupAction({ code }: { code: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized access." }
  }

  const mfa = await db.query.userMfa.findFirst({
    where: eq(userMfa.userId, session.user.id),
  })

  const pendingSecret =
    mfa?.totpPendingSecretEncrypted ||
    (!mfa?.totpEnabled ? mfa?.totpSecretEncrypted : null)

  if (!pendingSecret) {
    return { error: "No pending authenticator setup found. Please start setup again." }
  }

  const isValid = verifyTotpToken(pendingSecret, code, true)
  if (!isValid) {
    return { error: "Invalid code. Verify the 6 digits in your authenticator app and try again." }
  }

  const backupCodes = generateBackupCodes(10)

  await db
    .update(userMfa)
    .set({
      totpSecretEncrypted: pendingSecret,
      totpPendingSecretEncrypted: null,
      totpEnabled: true,
      backupCodesHash: backupCodes.hashedCodesJson,
      updatedAt: new Date(),
    })
    .where(eq(userMfa.userId, session.user.id))

  return {
    success: true,
    backupCodes: backupCodes.plaintextCodes,
  }
}

export async function disableTotpAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized access." }
  }

  await db
    .update(userMfa)
    .set({
      totpEnabled: false,
      totpSecretEncrypted: null,
      totpPendingSecretEncrypted: null,
      backupCodesHash: null,
      updatedAt: new Date(),
    })
    .where(eq(userMfa.userId, session.user.id))

  return { success: true }
}

export async function startPasskeyRegistrationAction(name?: string) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return { error: "Unauthorized access." }
  }

  const headerList = await headers()
  const hostHeader = headerList.get("host")

  const existingPasskeys = await db
    .select()
    .from(userPasskeys)
    .where(eq(userPasskeys.userId, session.user.id))

  const options = await createPasskeyRegistrationOptions(
    { id: session.user.id, email: session.user.email },
    existingPasskeys,
    hostHeader
  )

  const registrationToken = await createRegistrationChallengeToken({
    userId: session.user.id,
    expectedChallenge: options.challenge,
  })

  return { options, registrationToken }
}

export async function finishPasskeyRegistrationAction({
  registrationToken,
  response,
  name,
}: {
  registrationToken: string
  response: RegistrationResponseJSON
  name?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized access." }
  }

  const tokenPayload = await verifyRegistrationChallengeToken(registrationToken)
  if (!tokenPayload || tokenPayload.userId !== session.user.id) {
    return { error: "Registration session expired. Please try again." }
  }

  const headerList = await headers()
  const hostHeader = headerList.get("host")

  try {
    const verification = await verifyPasskeyRegistration(
      response,
      tokenPayload.expectedChallenge,
      hostHeader
    )

    if (!verification.verified || !verification.registrationInfo) {
      return { error: "Biometric registration failed. Authenticator response rejected." }
    }

    const { id, publicKey, counter, transports } =
      verification.registrationInfo.credential

    await db.insert(userPasskeys).values({
      id,
      userId: session.user.id,
      publicKey: Buffer.from(publicKey).toString("base64url"),
      counter,
      deviceType: "platform",
      transports: transports || (response.response.transports as any) || ["internal"],
      name: name?.trim() || "Windows Hello",
      createdAt: new Date(),
    })

    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Failed to complete passkey registration." }
  }
}

export async function deletePasskeyAction({ passkeyId }: { passkeyId: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized access." }
  }

  await db
    .delete(userPasskeys)
    .where(and(eq(userPasskeys.id, passkeyId), eq(userPasskeys.userId, session.user.id)))

  return { success: true }
}

// --- MFA Sign-In Challenge Actions ---

export async function getPasskeyAuthOptionsAction({
  challengeToken,
}: {
  challengeToken: string
}) {
  const challenge = await verifyMfaChallengeToken(challengeToken)
  if (!challenge) {
    return { error: "Challenge session expired. Please sign in again." }
  }

  const headerList = await headers()
  const hostHeader = headerList.get("host")

  const allowedPasskeys = await db
    .select()
    .from(userPasskeys)
    .where(eq(userPasskeys.userId, challenge.userId))

  if (allowedPasskeys.length === 0) {
    return { error: "No passkeys registered for this account." }
  }

  const options = await createPasskeyAuthOptions(allowedPasskeys, hostHeader)

  const updatedChallengeToken = await createMfaChallengeToken({
    ...challenge,
    expectedChallenge: options.challenge,
  })

  return {
    options,
    challengeToken: updatedChallengeToken,
  }
}

export async function verifyPasskeyLoginAction({
  challengeToken,
  response,
}: {
  challengeToken: string
  response: AuthenticationResponseJSON
}) {
  const challenge = await verifyMfaChallengeToken(challengeToken)
  if (!challenge || !challenge.expectedChallenge) {
    return { error: "Authentication challenge expired. Please retry sign in." }
  }

  const headerList = await headers()
  const hostHeader = headerList.get("host")

  const passkeys = await db
    .select()
    .from(userPasskeys)
    .where(
      and(
        eq(userPasskeys.id, response.id),
        eq(userPasskeys.userId, challenge.userId)
      )
    )

  const passkey = passkeys[0]
  if (!passkey) {
    return { error: "Unrecognized security credential." }
  }

  try {
    const verification = await verifyPasskeyAuth(
      response,
      challenge.expectedChallenge,
      passkey,
      hostHeader
    )

    if (!verification.verified) {
      return { error: "Biometric authentication failed. Credential signature invalid." }
    }

    await db
      .update(userPasskeys)
      .set({
        counter: verification.authenticationInfo.newCounter,
        lastUsedAt: new Date(),
      })
      .where(eq(userPasskeys.id, passkey.id))

    const mfaVerifiedToken = await createMfaVerifiedToken({
      userId: challenge.userId,
      email: challenge.email,
      role: challenge.role,
    })

    return {
      success: true,
      mfaVerifiedToken,
    }
  } catch (error: any) {
    return { error: error.message || "Failed to verify biometric passkey." }
  }
}

export async function verifyTotpLoginAction({
  challengeToken,
  code,
}: {
  challengeToken: string
  code: string
}) {
  const challenge = await verifyMfaChallengeToken(challengeToken)
  if (!challenge) {
    return { error: "Verification challenge expired. Please sign in again." }
  }

  const lockout = checkMfaLockout(challenge.userId)
  if (lockout.locked) {
    return {
      error: `Too many failed attempts. Account temporarily locked for ${Math.ceil(
        (lockout.remainingSeconds || 300) / 60
      )} minutes.`,
    }
  }

  const mfa = await db.query.userMfa.findFirst({
    where: eq(userMfa.userId, challenge.userId),
  })

  if (!mfa?.totpEnabled || !mfa.totpSecretEncrypted) {
    return { error: "Authenticator app is not configured for this account." }
  }

  const isValid = verifyTotpToken(mfa.totpSecretEncrypted, code, true)
  if (!isValid) {
    const nowLocked = recordMfaFailure(challenge.userId)
    if (nowLocked.locked) {
      return {
        error: "Too many failed attempts. Account temporarily locked for 5 minutes.",
      }
    }
    return { error: "Invalid authenticator code. Check the 6 digits and try again." }
  }

  clearMfaAttempts(challenge.userId)

  const mfaVerifiedToken = await createMfaVerifiedToken({
    userId: challenge.userId,
    email: challenge.email,
    role: challenge.role,
  })

  return {
    success: true,
    mfaVerifiedToken,
  }
}

export async function verifyBackupCodeLoginAction({
  challengeToken,
  code,
}: {
  challengeToken: string
  code: string
}) {
  const challenge = await verifyMfaChallengeToken(challengeToken)
  if (!challenge) {
    return { error: "Verification challenge expired. Please sign in again." }
  }

  const lockout = checkMfaLockout(challenge.userId)
  if (lockout.locked) {
    return {
      error: `Too many failed attempts. Account temporarily locked for ${Math.ceil(
        (lockout.remainingSeconds || 300) / 60
      )} minutes.`,
    }
  }

  const mfa = await db.query.userMfa.findFirst({
    where: eq(userMfa.userId, challenge.userId),
  })

  if (!mfa?.backupCodesHash) {
    return { error: "No recovery codes available for this account." }
  }

  const result = verifyAndBurnBackupCode(code, mfa.backupCodesHash)
  if (!result.valid) {
    const nowLocked = recordMfaFailure(challenge.userId)
    if (nowLocked.locked) {
      return {
        error: "Too many failed attempts. Account temporarily locked for 5 minutes.",
      }
    }
    return { error: "Invalid recovery code. Each code is single-use only." }
  }

  // Atomic conditional update to prevent concurrent code reuse race condition
  const updatedRows = await db
    .update(userMfa)
    .set({
      backupCodesHash: result.remainingHashedCodesJson,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userMfa.userId, challenge.userId),
        eq(userMfa.backupCodesHash, mfa.backupCodesHash)
      )
    )
    .returning({ userId: userMfa.userId })

  if (updatedRows.length === 0) {
    return {
      error:
        "Recovery code could not be processed due to a concurrent update. Please try again.",
    }
  }

  clearMfaAttempts(challenge.userId)

  const mfaVerifiedToken = await createMfaVerifiedToken({
    userId: challenge.userId,
    email: challenge.email,
    role: challenge.role,
  })

  return {
    success: true,
    mfaVerifiedToken,
  }
}

export async function completeMfaSignInAction({
  mfaVerifiedToken,
}: {
  mfaVerifiedToken: string
}) {
  try {
    await signIn("credentials", {
      mfaToken: mfaVerifiedToken,
      redirectTo: "/dashboard",
    })
    return { success: true }
  } catch (error: any) {
    // Next.js redirect throws an error, which must be rethrown
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    return { error: error.message || "Failed to complete sign in." }
  }
}

// --- Passwordless Windows Hello Login Actions ---

export async function startPasswordlessPasskeyAction() {
  const headerList = await headers()
  const hostHeader = headerList.get("host")

  const options = await createPasskeyAuthOptions(undefined, hostHeader)

  const challengeToken = await createMfaChallengeToken({
    userId: "anonymous",
    email: "",
    role: "",
    methods: ["passkey"],
    expectedChallenge: options.challenge,
  })

  return {
    options,
    challengeToken,
  }
}

export async function finishPasswordlessPasskeyAction({
  challengeToken,
  response,
}: {
  challengeToken: string
  response: AuthenticationResponseJSON
}) {
  const challenge = await verifyMfaChallengeToken(challengeToken)
  if (!challenge || !challenge.expectedChallenge) {
    return { error: "Biometric session expired. Please try again." }
  }

  const headerList = await headers()
  const hostHeader = headerList.get("host")

  const passkey = await db.query.userPasskeys.findFirst({
    where: eq(userPasskeys.id, response.id),
  })

  if (!passkey) {
    return { error: "Security key or Windows Hello device not recognized." }
  }

  try {
    const verification = await verifyPasskeyAuth(
      response,
      challenge.expectedChallenge,
      passkey,
      hostHeader
    )

    if (!verification.verified) {
      return { error: "Biometric verification failed. Security key rejected." }
    }

    await db
      .update(userPasskeys)
      .set({
        counter: verification.authenticationInfo.newCounter,
        lastUsedAt: new Date(),
      })
      .where(eq(userPasskeys.id, passkey.id))

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, passkey.userId),
    })

    if (!dbUser || dbUser.deletedAt) {
      return { error: "Staff account not found or deactivated." }
    }

    const mfaVerifiedToken = await createMfaVerifiedToken({
      userId: dbUser.id,
      email: dbUser.email || "",
      role: dbUser.role || "staff",
    })

    await signIn("credentials", {
      mfaToken: mfaVerifiedToken,
      redirectTo: "/dashboard",
    })

    return { success: true }
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    return { error: error.message || "Failed to verify Windows Hello." }
  }
}
