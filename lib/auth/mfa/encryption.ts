import crypto from "crypto"
import { resolveAuthSecret } from "@/lib/auth/secret"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12
const TAG_LENGTH = 16

/**
 * Derives a 32-byte key from the project AUTH_SECRET using HKDF-SHA256.
 */
function getEncryptionKey(): Buffer {
  const secret = resolveAuthSecret()
  const derived = crypto.hkdfSync(
    "sha256",
    Buffer.from(secret, "utf-8"),
    Buffer.from("tac-xpress-mfa-salt", "utf-8"),
    Buffer.from("mfa-secret-encryption", "utf-8"),
    32
  )
  return Buffer.from(derived)
}

/**
 * Encrypts a plaintext secret string using AES-256-GCM.
 * Output format: base64(iv + authTag + ciphertext)
 */
export function encryptMfaSecret(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: TAG_LENGTH,
  })

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf-8"),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  const combined = Buffer.concat([iv, tag, encrypted])
  return combined.toString("base64")
}

/**
 * Decrypts a base64-encoded AES-256-GCM encrypted secret.
 */
export function decryptMfaSecret(encryptedBase64: string): string {
  const key = getEncryptionKey()
  const combined = Buffer.from(encryptedBase64, "base64")

  if (combined.length < IV_LENGTH + TAG_LENGTH) {
    throw new Error("Invalid encrypted payload length")
  }

  const iv = combined.subarray(0, IV_LENGTH)
  const tag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
  const ciphertext = combined.subarray(IV_LENGTH + TAG_LENGTH)

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: TAG_LENGTH,
  })
  decipher.setAuthTag(tag)

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ])
  return decrypted.toString("utf-8")
}
