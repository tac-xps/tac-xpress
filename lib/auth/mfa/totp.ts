import * as OTPAuth from "otpauth"
import crypto from "crypto"
import { encryptMfaSecret, decryptMfaSecret } from "./encryption"

const ISSUER = "Tac-Xpress"

export interface TotpSetupResult {
  secret: string // Base32 plaintext secret (for manual entry)
  uri: string // otpauth:// URI for QR code generation
  encryptedSecret: string // AES-256-GCM encrypted string for DB
}

export interface BackupCodesResult {
  plaintextCodes: string[]
  hashedCodesJson: string
}

/**
 * Generates a new RFC 6238 TOTP configuration.
 */
export function generateTotpSetup(email: string): TotpSetupResult {
  const secret = new OTPAuth.Secret({ size: 20 })
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret,
  })

  return {
    secret: secret.base32,
    uri: totp.toString(),
    encryptedSecret: encryptMfaSecret(secret.base32),
  }
}

/**
 * Validates a 6-digit TOTP token against an encrypted or plaintext secret.
 * Supports a window of +-1 step (30 seconds drift).
 */
export function verifyTotpToken(
  secretOrEncrypted: string,
  token: string,
  isEncrypted = true
): boolean {
  try {
    const rawSecret = isEncrypted
      ? decryptMfaSecret(secretOrEncrypted)
      : secretOrEncrypted

    const totp = new OTPAuth.TOTP({
      issuer: ISSUER,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(rawSecret),
    })

    const delta = totp.validate({
      token: token.trim(),
      window: 1, // Allow 1 step before and after (30s tolerance)
    })

    return delta !== null
  } catch {
    return false
  }
}

function hashBackupCode(code: string, salt: string): string {
  return crypto
    .scryptSync(code.trim().toUpperCase(), salt, 32, { N: 1024, r: 8, p: 1 })
    .toString("hex")
}

/**
 * Generates 10 single-use recovery codes in "XXXX-XXXX-XXXX-XXXX" format (64-bit entropy).
 */
export function generateBackupCodes(count = 10): BackupCodesResult {
  const plaintextCodes: string[] = []
  const hashedCodes: string[] = []

  for (let i = 0; i < count; i++) {
    const p1 = crypto.randomBytes(2).toString("hex").toUpperCase()
    const p2 = crypto.randomBytes(2).toString("hex").toUpperCase()
    const p3 = crypto.randomBytes(2).toString("hex").toUpperCase()
    const p4 = crypto.randomBytes(2).toString("hex").toUpperCase()
    const code = `${p1}-${p2}-${p3}-${p4}`
    plaintextCodes.push(code)

    const salt = crypto.randomBytes(16).toString("hex")
    const hash = hashBackupCode(code, salt)
    hashedCodes.push(`${salt}:${hash}`)
  }

  return {
    plaintextCodes,
    hashedCodesJson: JSON.stringify(hashedCodes),
  }
}

/**
 * Validates a recovery code and burns it if valid.
 */
export function verifyAndBurnBackupCode(
  enteredCode: string,
  hashedCodesJson?: string | null
): { valid: boolean; remainingHashedCodesJson?: string } {
  if (!hashedCodesJson) return { valid: false }

  try {
    const hashedCodes: string[] = JSON.parse(hashedCodesJson)
    const normalizedInput = enteredCode.trim().toUpperCase()

    let matchedIndex = -1
    for (let i = 0; i < hashedCodes.length; i++) {
      const entry = hashedCodes[i]
      const [salt, expectedHash] = entry.split(":")
      if (!salt || !expectedHash) {
        // Fallback for legacy SHA-256 entries if any
        const legacyHash = crypto
          .createHash("sha256")
          .update(normalizedInput + "tac-backup-salt")
          .digest("hex")
        if (entry === legacyHash) {
          matchedIndex = i
          break
        }
        continue
      }

      const computed = hashBackupCode(normalizedInput, salt)
      if (crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(expectedHash))) {
        matchedIndex = i
        break
      }
    }

    if (matchedIndex === -1) {
      return { valid: false }
    }

    // Burn the used code
    hashedCodes.splice(matchedIndex, 1)
    return {
      valid: true,
      remainingHashedCodesJson: JSON.stringify(hashedCodes),
    }
  } catch {
    return { valid: false }
  }
}
