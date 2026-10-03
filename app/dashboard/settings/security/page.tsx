import { requireStaffPage } from "@/lib/auth/page-access"
import { PageHeader } from "@/components/operations/page-header"
import { MfaSecuritySettings } from "@/components/operations/mfa-security-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Account Security & MFA | TAC-XPRESS",
  description: "Configure Windows Hello biometrics and Authenticator app two-factor verification.",
}

export default async function SecuritySettingsPage() {
  await requireStaffPage()

  return (
    <div className="flex min-w-0 flex-col gap-6 md:gap-8">
      <PageHeader
        title="Security & Authentication"
        description="Protect your staff workspace account with hardware-grade biometrics and one-time passcodes."
      />

      <div className="max-w-3xl">
        <Card className="border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="size-5" />
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
            </div>
            <CardDescription>
              Enforce multi-factor verification on every sign-in. TAC-XPRESS supports Windows Hello (WebAuthn/FIDO2) and RFC 6238 Authenticator apps (Google Authenticator, Microsoft Authenticator) without third-party SMS or fees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MfaSecuritySettings />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
