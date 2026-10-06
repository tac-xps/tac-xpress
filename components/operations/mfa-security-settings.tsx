"use client"

import { useState, useEffect, useTransition } from "react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import { startRegistration } from "@simplewebauthn/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Fingerprint,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Copy,
  Check,
  Plus,
  Loader2,
  KeyRound,
  Download,
} from "lucide-react"
import {
  getMfaSettingsAction,
  startTotpSetupAction,
  confirmTotpSetupAction,
  disableTotpAction,
  startPasskeyRegistrationAction,
  finishPasskeyRegistrationAction,
  deletePasskeyAction,
} from "@/app/actions/mfa-actions"

interface PasskeyItem {
  id: string
  name: string
  deviceType: string
  createdAt: string
  lastUsedAt: string | null
}

export function MfaSecuritySettings() {
  const [totpEnabled, setTotpEnabled] = useState(false)
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // TOTP setup state
  const [setupData, setSetupData] = useState<{ uri: string; secret: string } | null>(null)
  const [totpCode, setTotpCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false)

  // Passkey setup state
  const [deviceName, setDeviceName] = useState("Windows Hello (This PC)")

  // Feedback states
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function init() {
      const res = await getMfaSettingsAction()
      if (!isMounted) return
      if ("error" in res && res.error) {
        setError(res.error)
      } else {
        if ("totpEnabled" in res && typeof res.totpEnabled === "boolean") {
          setTotpEnabled(res.totpEnabled)
        }
        if ("passkeys" in res && Array.isArray(res.passkeys)) {
          setPasskeys(res.passkeys)
        }
      }
      setIsLoading(false)
    }
    init()
    return () => {
      isMounted = false
    }
  }, [])

  async function loadSettings() {
    setIsLoading(true)
    setError(null)
    const res = await getMfaSettingsAction()
    if ("error" in res && res.error) {
      setError(res.error)
    } else {
      if ("totpEnabled" in res && typeof res.totpEnabled === "boolean") {
        setTotpEnabled(res.totpEnabled)
      }
      if ("passkeys" in res && Array.isArray(res.passkeys)) {
        setPasskeys(res.passkeys)
      }
    }
    setIsLoading(false)
  }

  // 1. Authenticator App Setup
  function handleStartTotpSetup() {
    setError(null)
    setSuccessMessage(null)
    startTransition(async () => {
      const res = await startTotpSetupAction()
      if ("error" in res && res.error) {
        setError(res.error)
        return
      }
      if (
        "uri" in res &&
        typeof res.uri === "string" &&
        "secret" in res &&
        typeof res.secret === "string"
      ) {
        setSetupData({ uri: res.uri, secret: res.secret })
        setTotpCode("")
      }
    })
  }

  function handleConfirmTotp() {
    if (totpCode.length !== 6) {
      setError("Please enter the 6-digit code from your authenticator app.")
      return
    }

    setError(null)
    startTransition(async () => {
      const res = await confirmTotpSetupAction({ code: totpCode })
      if ("error" in res && res.error) {
        setError(res.error)
        return
      }
      if ("backupCodes" in res && res.backupCodes) {
        setBackupCodes(res.backupCodes)
        setTotpEnabled(true)
        setSetupData(null)
        setSuccessMessage("Authenticator app enabled successfully.")
      }
    })
  }

  function handleDisableTotp() {
    setError(null)
    setSuccessMessage(null)
    startTransition(async () => {
      const res = await disableTotpAction()
      if ("error" in res && res.error) {
        setError(res.error)
        return
      }
      setTotpEnabled(false)
      setSetupData(null)
      setBackupCodes(null)
      setSuccessMessage("Authenticator app disabled.")
    })
  }

  // 2. Windows Hello / Passkey Registration
  function handleRegisterPasskey() {
    setError(null)
    setSuccessMessage(null)
    startTransition(async () => {
      try {
        const regRes = await startPasskeyRegistrationAction(deviceName)
        if ("error" in regRes && regRes.error) {
          setError(regRes.error)
          return
        }

        if (!("options" in regRes) || !regRes.options) {
          setError("Failed to create registration options.")
          return
        }

        // Native Windows Hello biometrics prompt
        const response = await startRegistration({
          optionsJSON: regRes.options,
        })

        const finishRes = await finishPasskeyRegistrationAction({
          registrationToken: regRes.registrationToken,
          response,
          name: deviceName,
        })

        if ("error" in finishRes && finishRes.error) {
          setError(finishRes.error)
          return
        }

        setSuccessMessage("Windows Hello registered successfully.")
        await loadSettings()
      } catch (err: any) {
        if (err.name === "NotAllowedError") {
          setError("Windows Hello registration was cancelled.")
        } else {
          setError(err.message || "Failed to register Windows Hello.")
        }
      }
    })
  }

  function handleDeletePasskey(passkeyId: string) {
    setError(null)
    startTransition(async () => {
      const res = await deletePasskeyAction({ passkeyId })
      if ("error" in res && res.error) {
        setError(res.error)
        return
      }
      setSuccessMessage("Security key removed.")
      await loadSettings()
    })
  }

  function copyToClipboard(text: string, isSecret = true) {
    navigator.clipboard.writeText(text)
    if (isSecret) {
      setCopiedSecret(true)
      toast.success("Authenticator secret copied to clipboard")
      setTimeout(() => setCopiedSecret(false), 2000)
    } else {
      setCopiedBackupCodes(true)
      toast.success("Recovery codes copied to clipboard")
      setTimeout(() => setCopiedBackupCodes(false), 2000)
    }
  }

  function downloadBackupCodes() {
    if (!backupCodes) return
    const content = [
      "TAC-XPRESS STAFF ACCOUNT RECOVERY CODES",
      "Created: " + new Date().toISOString(),
      "",
      "Keep these backup codes in a safe place. Each code is single-use only.",
      "",
      ...backupCodes.map((code, idx) => `${idx + 1}. ${code}`),
    ].join("\n")

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tac-xpress-recovery-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Recovery codes saved to tac-xpress-recovery-codes.txt")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <h3 className="text-lg font-medium">Multi-Factor Authentication (MFA)</h3>
        <p className="text-xs text-muted-foreground">
          Protect your staff workspace account with hardware biometrics and one-time codes.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Action failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <ShieldCheck className="size-4 text-success" />
          <AlertTitle>Security updated</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Section 1: Windows Hello / Passkeys */}
      <div className="flex flex-col gap-4 rounded-none border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-none bg-primary/10 text-primary">
              <Fingerprint className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Windows Hello / Passkeys</h4>
              <p className="text-xs text-muted-foreground">
                Sign in using Windows Hello PIN, fingerprint, or facial recognition.
              </p>
            </div>
          </div>
          {passkeys.length > 0 ? (
            <Badge variant="success">
              {passkeys.length} Registered
            </Badge>
          ) : (
            <Badge variant="secondary">Not configured</Badge>
          )}
        </div>

        {/* List of registered passkeys */}
        {passkeys.length > 0 && (
          <div className="flex flex-col gap-2 divide-y rounded-none border bg-muted/20 px-3">
            {passkeys.map((pk) => (
              <div
                key={pk.id}
                className="flex items-center justify-between py-2 text-xs"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{pk.name}</span>
                  <span className="text-muted-foreground">
                    Added {new Date(pk.createdAt).toLocaleDateString()}
                    {pk.lastUsedAt &&
                      ` · Last used ${new Date(pk.lastUsedAt).toLocaleDateString()}`}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeletePasskey(pk.id)}
                  disabled={isPending}
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Remove device</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add passkey action */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Device name (e.g. Windows Hello PC)"
            className="h-9 text-xs"
            disabled={isPending}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRegisterPasskey}
            disabled={isPending}
            className="shrink-0"
          >
            {isPending ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <Plus className="mr-2 size-3.5" />
            )}
            Register Windows Hello
          </Button>
        </div>
      </div>

      {/* Section 2: Authenticator App (TOTP) */}
      <div className="flex flex-col gap-4 rounded-none border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-none bg-primary/10 text-primary">
              <Smartphone className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Authenticator App</h4>
              <p className="text-xs text-muted-foreground">
                Google Authenticator, Microsoft Authenticator, 1Password, or Bitwarden.
              </p>
            </div>
          </div>
          {totpEnabled ? (
            <Badge variant="success">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary">Not configured</Badge>
          )}
        </div>

        {/* TOTP Active state */}
        {totpEnabled && !setupData && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-muted-foreground">
              Authenticator app is verified and required for password sign-ins.
            </p>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDisableTotp}
              disabled={isPending}
            >
              Disable
            </Button>
          </div>
        )}

        {/* TOTP Not enabled state */}
        {!totpEnabled && !setupData && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-muted-foreground">
              Scan a QR code to generate 6-digit dynamic codes on your mobile phone.
            </p>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleStartTotpSetup}
              disabled={isPending}
            >
              Set up app
            </Button>
          </div>
        )}

        {/* TOTP Setup Wizard Modal / Step */}
        {setupData && (
          <div className="flex flex-col gap-4 rounded-none border bg-muted/20 p-4">
            <div className="text-xs">
              <span className="font-semibold">Step 1:</span> Scan this QR code with your authenticator app.
            </div>

            <div className="flex flex-col items-center justify-center gap-3 rounded-none bg-background p-4 shadow-sm sm:flex-row">
              <div className="rounded bg-card p-2">
                <QRCodeSVG value={setupData.uri} size={150} level="M" />
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <span className="text-muted-foreground">Cannot scan the code? Enter this secret manually:</span>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs font-bold text-foreground">
                    {setupData.secret}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => copyToClipboard(setupData.secret, true)}
                  >
                    {copiedSecret ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-xs">
              <span className="font-semibold">Step 2:</span> Enter the 6-digit code shown in your app to confirm.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <InputOTP
                maxLength={6}
                value={totpCode}
                onChange={setTotpCode}
                disabled={isPending}
                autoFocus
                aria-label="6-digit verification code"
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

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmTotp}
                  disabled={isPending || totpCode.length !== 6}
                >
                  {isPending ? <Loader2 className="mr-2 size-3.5 animate-spin" /> : null}
                  Verify & Enable
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSetupData(null)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Backup Codes Display (Shown immediately after enabling) */}
        {backupCodes && (
          <div className="flex flex-col gap-3 rounded-none border border-warning/30 bg-warning/10 p-4">
            <div className="flex items-center gap-2 text-warning">
              <KeyRound className="size-4" />
              <h5 className="text-xs font-semibold">Store your emergency recovery codes</h5>
            </div>
            <p className="text-xs text-muted-foreground">
              If you lose your device or security key, these single-use codes are the only way to recover account access.
            </p>

            <div className="grid grid-cols-2 gap-2 rounded bg-background p-3 font-mono text-xs font-medium">
              {backupCodes.map((code, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-muted-foreground select-none">{idx + 1}.</span>
                  <span>{code}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(backupCodes.join("\n"), false)}
                className="h-8 text-xs"
              >
                {copiedBackupCodes ? <Check className="mr-1.5 size-3.5 text-success" /> : <Copy className="mr-1.5 size-3.5" />}
                Copy all codes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadBackupCodes}
                className="h-8 text-xs"
              >
                <Download className="mr-1.5 size-3.5" />
                Download (.txt)
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setBackupCodes(null)}
                className="ml-auto h-8 text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
