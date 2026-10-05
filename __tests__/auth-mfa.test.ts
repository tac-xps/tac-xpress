import { describe, it, expect, vi } from "vitest"

vi.mock("server-only", () => ({}))
import {
  encryptMfaSecret,
  decryptMfaSecret,
} from "@/lib/auth/mfa/encryption"
import {
  generateTotpSetup,
  verifyTotpToken,
  generateBackupCodes,
  verifyAndBurnBackupCode,
} from "@/lib/auth/mfa/totp"
import {
  createMfaChallengeToken,
  verifyMfaChallengeToken,
  createMfaVerifiedToken,
  verifyMfaVerifiedToken,
  createRegistrationChallengeToken,
  verifyRegistrationChallengeToken,
} from "@/lib/auth/mfa/challenge-token"
import {
  createPasskeyRegistrationOptions,
  createPasskeyAuthOptions,
  getWebAuthnConfig,
} from "@/lib/auth/mfa/webauthn"
import * as OTPAuth from "otpauth"

describe("MFA AES-256-GCM Cryptographic Engine", () => {
  it("encrypts and decrypts secret correctly with AES-256-GCM", () => {
    const rawSecret = "JBSWY3DPEHPK3PXP"
    const encrypted = encryptMfaSecret(rawSecret)

    expect(encrypted).toBeDefined()
    expect(encrypted).not.toEqual(rawSecret)

    const decrypted = decryptMfaSecret(encrypted)
    expect(decrypted).toEqual(rawSecret)
  })

  it("fails to decrypt tampered ciphertext", () => {
    const rawSecret = "MYTESTSECRET1234"
    const encrypted = encryptMfaSecret(rawSecret)

    const buffer = Buffer.from(encrypted, "base64")
    // Tamper with the last byte of ciphertext
    buffer[buffer.length - 1] ^= 0xff
    const tampered = buffer.toString("base64")

    expect(() => decryptMfaSecret(tampered)).toThrow()
  })

  it("throws error for payloads shorter than IV + Tag length", () => {
    const tooShort = Buffer.from("tiny").toString("base64")
    expect(() => decryptMfaSecret(tooShort)).toThrow("Invalid encrypted payload length")
  })
})

describe("RFC 6238 TOTP Engine", () => {
  it("generates a valid TOTP setup with base32 secret and otpauth URI", () => {
    const email = "ops@tacexpress.app"
    const setup = generateTotpSetup(email)

    expect(setup.secret).toBeDefined()
    expect(setup.secret.length).toBeGreaterThanOrEqual(16)
    expect(setup.uri).toContain("otpauth://totp/Tac-Xpress:ops%40tacexpress.app")
    expect(setup.uri).toContain("issuer=Tac-Xpress")
    expect(setup.encryptedSecret).toBeDefined()

    // Encrypted secret can be decrypted to match plaintext secret
    const decrypted = decryptMfaSecret(setup.encryptedSecret)
    expect(decrypted).toEqual(setup.secret)
  })

  it("validates current 6-digit TOTP code correctly", () => {
    const setup = generateTotpSetup("staff@tacexpress.app")

    // Generate valid TOTP code using the secret
    const totp = new OTPAuth.TOTP({
      issuer: "Tac-Xpress",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(setup.secret),
    })

    const validCode = totp.generate()
    expect(validCode).toHaveLength(6)

    // Verify using encrypted secret
    const isValidEncrypted = verifyTotpToken(setup.encryptedSecret, validCode, true)
    expect(isValidEncrypted).toBe(true)

    // Verify using plaintext secret
    const isValidPlaintext = verifyTotpToken(setup.secret, validCode, false)
    expect(isValidPlaintext).toBe(true)
  })

  it("accepts codes within +-1 step (30 seconds) clock drift window", () => {
    const setup = generateTotpSetup("drift@tacexpress.app")
    const totp = new OTPAuth.TOTP({
      issuer: "Tac-Xpress",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(setup.secret),
    })

    const now = Math.floor(Date.now() / 1000)

    // -30 seconds code (previous period)
    const pastCode = totp.generate({ timestamp: (now - 30) * 1000 })
    expect(verifyTotpToken(setup.secret, pastCode, false)).toBe(true)

    // +30 seconds code (next period)
    const futureCode = totp.generate({ timestamp: (now + 30) * 1000 })
    expect(verifyTotpToken(setup.secret, futureCode, false)).toBe(true)

    // Far future code (+120 seconds) must fail
    const farFutureCode = totp.generate({ timestamp: (now + 120) * 1000 })
    expect(verifyTotpToken(setup.secret, farFutureCode, false)).toBe(false)
  })

  it("rejects invalid or malformed codes", () => {
    const setup = generateTotpSetup("badcode@tacexpress.app")
    expect(verifyTotpToken(setup.secret, "000000", false)).toBe(false)
    expect(verifyTotpToken(setup.secret, "12345", false)).toBe(false)
    expect(verifyTotpToken(setup.secret, "abcdef", false)).toBe(false)
  })
})

describe("Single-Use Recovery Codes Engine", () => {
  it("generates 10 single-use recovery codes in XXXX-XXXX-XXXX-XXXX format", () => {
    const result = generateBackupCodes(10)
    expect(result.plaintextCodes).toHaveLength(10)

    for (const code of result.plaintextCodes) {
      expect(code).toMatch(/^[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/)
    }

    const hashedArray = JSON.parse(result.hashedCodesJson)
    expect(hashedArray).toHaveLength(10)
  })

  it("verifies and burns a backup code on first use, rejecting reuse", () => {
    const result = generateBackupCodes(5)
    const codeToUse = result.plaintextCodes[2]

    // 1. First use should be valid
    const firstAttempt = verifyAndBurnBackupCode(codeToUse, result.hashedCodesJson)
    expect(firstAttempt.valid).toBe(true)
    expect(firstAttempt.remainingHashedCodesJson).toBeDefined()

    const remainingArray = JSON.parse(firstAttempt.remainingHashedCodesJson!)
    expect(remainingArray).toHaveLength(4)

    // 2. Second use of the same code must fail (burned)
    const secondAttempt = verifyAndBurnBackupCode(
      codeToUse,
      firstAttempt.remainingHashedCodesJson
    )
    expect(secondAttempt.valid).toBe(false)
  })

  it("rejects unknown backup codes", () => {
    const result = generateBackupCodes(5)
    const attempt = verifyAndBurnBackupCode("ZZZZ-9999", result.hashedCodesJson)
    expect(attempt.valid).toBe(false)
  })
})

describe("MFA Challenge & Grant JWT Tokens", () => {
  it("creates and verifies a 5-minute ephemeral MFA challenge token", async () => {
    const payload = {
      userId: "11111111-2222-3333-4444-555555555555",
      email: "staff@tacexpress.app",
      role: "staff",
      methods: ["totp", "passkey"] as ("totp" | "passkey")[],
      expectedChallenge: "mock-random-challenge-string",
    }

    const token = await createMfaChallengeToken(payload)
    expect(token).toBeDefined()

    const verified = await verifyMfaChallengeToken(token)
    expect(verified).not.toBeNull()
    expect(verified?.userId).toEqual(payload.userId)
    expect(verified?.email).toEqual(payload.email)
    expect(verified?.role).toEqual(payload.role)
    expect(verified?.methods).toEqual(["totp", "passkey"])
    expect(verified?.expectedChallenge).toEqual("mock-random-challenge-string")
  })

  it("creates and verifies a 60-second verified grant token", async () => {
    const grant = {
      userId: "22222222-3333-4444-5555-666666666666",
      email: "admin@tacexpress.app",
      role: "admin",
    }

    const token = await createMfaVerifiedToken(grant)
    expect(token).toBeDefined()

    const verified = await verifyMfaVerifiedToken(token)
    expect(verified).not.toBeNull()
    expect(verified?.userId).toEqual(grant.userId)
    expect(verified?.email).toEqual(grant.email)
    expect(verified?.role).toEqual("admin")
  })

  it("creates and verifies registration challenge tokens", async () => {
    const regPayload = {
      userId: "user-123",
      expectedChallenge: "challenge-abc",
    }

    const token = await createRegistrationChallengeToken(regPayload)
    const verified = await verifyRegistrationChallengeToken(token)

    expect(verified).not.toBeNull()
    expect(verified?.userId).toEqual("user-123")
    expect(verified?.expectedChallenge).toEqual("challenge-abc")
  })

  it("rejects tampered or malformed tokens", async () => {
    const verified = await verifyMfaChallengeToken("invalid.jwt.token")
    expect(verified).toBeNull()

    const verifiedGrant = await verifyMfaVerifiedToken("invalid.jwt.token")
    expect(verifiedGrant).toBeNull()
  })
})

describe("WebAuthn / Windows Hello Configuration & Options", () => {
  it("derives WebAuthn RP configuration accurately", () => {
    const config = getWebAuthnConfig("localhost:3000")
    expect(config.rpName).toBe("Tac-Xpress Logistics")
    expect(config.rpID).toBe("localhost")
    expect(config.origin).toContain("localhost")
  })

  it("generates registration options with required user verification for Windows Hello", async () => {
    const options = await createPasskeyRegistrationOptions(
      { id: "test-user-id", email: "test@tacexpress.app" },
      [],
      "localhost:3000"
    )

    expect(options).toBeDefined()
    expect(options.challenge).toBeDefined()
    expect(options.rp.name).toBe("Tac-Xpress Logistics")
    expect(options.rp.id).toBe("localhost")
    expect(options.user.name).toBe("test@tacexpress.app")
    expect(options.authenticatorSelection?.userVerification).toBe("required")
  })

  it("generates authentication options with challenge", async () => {
    const options = await createPasskeyAuthOptions([], "localhost:3000")

    expect(options).toBeDefined()
    expect(options.challenge).toBeDefined()
    expect(options.rpId).toBe("localhost")
    expect(options.userVerification).toBe("required")
  })
})
