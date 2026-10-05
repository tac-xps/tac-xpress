"use client"

import { useState, useTransition } from "react"
import { startAuthentication } from "@simplewebauthn/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  ShieldCheck,
  Fingerprint,
  Smartphone,
  KeyRound,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import {
  getPasskeyAuthOptionsAction,
  verifyPasskeyLoginAction,
  verifyTotpLoginAction,
  verifyBackupCodeLoginAction,
  completeMfaSignInAction,
} from "@/app/actions/mfa-actions"

interface MfaChallengeProps {
  challengeToken: string
  methods: ("totp" | "passkey")[]
  onCancel: () => void
}

export function MfaChallenge({
  challengeToken: initialChallengeToken,
  methods,
  onCancel,
}: MfaChallengeProps) {
  const [activeMethod, setActiveMethod] = useState<"passkey" | "totp" | "backup">(
    methods.includes("passkey") ? "passkey" : "totp"
  )
  const [challengeToken, setChallengeToken] = useState(initialChallengeToken)
  const [totpCode, setTotpCode] = useState("")
  const [backupCode, setBackupCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // 1. Windows Hello / Passkey Verification
  function handleWindowsHelloAuth() {
    setError(null)
    startTransition(async () => {
      try {
        const authOptionsRes = await getPasskeyAuthOptionsAction({
          challengeToken,
        })

        if ("error" in authOptionsRes && authOptionsRes.error) {
          setError(authOptionsRes.error)
          return
        }

        if (!("options" in authOptionsRes) || !authOptionsRes.options) {
          setError("Failed to initialize Windows Hello authentication.")
          return
        }

        setChallengeToken(authOptionsRes.challengeToken)

        // Native Windows Hello biometrics prompt
        const authResponse = await startAuthentication({
          optionsJSON: authOptionsRes.options,
        })

        const verifyRes = await verifyPasskeyLoginAction({
          challengeToken: authOptionsRes.challengeToken,
          response: authResponse,
        })

        if ("error" in verifyRes && verifyRes.error) {
          setError(verifyRes.error)
          return
        }

        if ("mfaVerifiedToken" in verifyRes && verifyRes.mfaVerifiedToken) {
          await completeMfaSignInAction({
            mfaVerifiedToken: verifyRes.mfaVerifiedToken,
          })
        }
      } catch (err: any) {
        if (err.name === "NotAllowedError") {
          setError("Windows Hello prompt was cancelled or timed out.")
        } else {
          setError(err.message || "Windows Hello authentication failed.")
        }
      }
    })
  }

  // 2. TOTP Code Verification
  function handleTotpSubmit(codeToVerify?: string) {
    const code = (codeToVerify || totpCode).trim()
    if (code.length !== 6) {
      setError("Please enter all 6 digits from your authenticator app.")
      return
    }

    setError(null)
    startTransition(async () => {
      const verifyRes = await verifyTotpLoginAction({
        challengeToken,
        code,
      })

      if ("error" in verifyRes && verifyRes.error) {
        setError(verifyRes.error)
        return
      }

      if ("mfaVerifiedToken" in verifyRes && verifyRes.mfaVerifiedToken) {
        await completeMfaSignInAction({
          mfaVerifiedToken: verifyRes.mfaVerifiedToken,
        })
      }
    })
  }

  // 3. Backup Code Verification
  function handleBackupCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = backupCode.trim().toUpperCase()
    if (!code) {
      setError("Please enter a valid recovery code.")
      return
    }

    setError(null)
    startTransition(async () => {
      const verifyRes = await verifyBackupCodeLoginAction({
        challengeToken,
        code,
      })

      if ("error" in verifyRes && verifyRes.error) {
        setError(verifyRes.error)
        return
      }

      if ("mfaVerifiedToken" in verifyRes && verifyRes.mfaVerifiedToken) {
        await completeMfaSignInAction({
          mfaVerifiedToken: verifyRes.mfaVerifiedToken,
        })
      }
    })
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="mb-2 flex flex-col gap-3">
        <div className="flex size-10 items-center justify-center rounded-none bg-primary/10 text-primary">
          <ShieldCheck className="size-5" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight">Two-Factor Verification</h2>
        <p className="text-sm text-muted-foreground">
          Confirm your identity using a secondary security credential to open the workspace.
        </p>
      </div>

      {/* Method Switcher Buttons */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {methods.includes("passkey") && (
          <Button
            type="button"
            variant={activeMethod === "passkey" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveMethod("passkey")
              setError(null)
            }}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <Fingerprint className="size-4" />
            Windows Hello
          </Button>
        )}
        {methods.includes("totp") && (
          <Button
            type="button"
            variant={activeMethod === "totp" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveMethod("totp")
              setError(null)
            }}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <Smartphone className="size-4" />
            Authenticator App
          </Button>
        )}
        <Button
          type="button"
          variant={activeMethod === "backup" ? "default" : "ghost"}
          size="sm"
          onClick={() => {
            setActiveMethod("backup")
            setError(null)
          }}
          disabled={isPending}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <KeyRound className="size-4" />
          Recovery Code
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Method 1: Windows Hello Biometrics */}
      {activeMethod === "passkey" && (
        <div className="flex flex-col gap-4 rounded-none border bg-muted/20 p-5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-none bg-primary/10 text-primary">
            <Fingerprint className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-medium">Verify with Windows Hello</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Use your Windows Hello PIN, fingerprint, or facial recognition to complete sign-in.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleWindowsHelloAuth}
            disabled={isPending}
            className="mt-2 h-10 w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Prompting Windows Hello…
              </>
            ) : (
              <>
                <Fingerprint className="mr-2 size-4" />
                Verify with Windows Hello
              </>
            )}
          </Button>
        </div>
      )}

      {/* Method 2: Authenticator App (RFC 6238 TOTP) */}
      {activeMethod === "totp" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="totp-input" className="text-foreground/80">
              6-Digit Authenticator Code
            </Label>
            <p className="text-xs text-muted-foreground">
              Enter the dynamic code shown in Google Authenticator or Microsoft Authenticator.
            </p>
          </div>

          <div className="flex justify-center py-2">
            <InputOTP
              maxLength={6}
              value={totpCode}
              onChange={(val) => {
                setTotpCode(val)
                if (val.length === 6) {
                  handleTotpSubmit(val)
                }
              }}
              disabled={isPending}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="button"
            onClick={() => handleTotpSubmit()}
            disabled={isPending || totpCode.length !== 6}
            className="h-9 w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Verifying code…
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </div>
      )}

      {/* Method 3: Backup Recovery Code */}
      {activeMethod === "backup" && (
        <form onSubmit={handleBackupCodeSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="backup-code-input" className="text-foreground/80">
              Single-Use Recovery Code
            </Label>
            <p className="text-xs text-muted-foreground">
              Enter one of your 8-character recovery codes (e.g. A1B2-C3D4). The used code will be burned immediately.
            </p>
          </div>

          <Input
            id="backup-code-input"
            type="text"
            placeholder="XXXX-XXXX"
            value={backupCode}
            onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
            disabled={isPending}
            className="h-10 text-center font-mono tracking-widest uppercase"
            maxLength={9}
          />

          <Button
            type="submit"
            disabled={isPending || !backupCode.trim()}
            className="h-9 w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Verifying recovery code…
              </>
            ) : (
              "Verify & Sign In"
            )}
          </Button>
        </form>
      )}

      {/* Back button */}
      <div className="border-t pt-4 text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to email and password
        </Button>
      </div>
    </div>
  )
}
