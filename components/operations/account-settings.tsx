"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { StaffDirectory } from "./staff-directory"
import { useAccountSettings } from "./use-account-settings"
export function AccountSettings({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const account = useAccountSettings(() => onOpenChange(false))
  const profile = account.profile
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Account & preferences</DialogTitle>
          <DialogDescription>
            Manage your staff profile and workspace appearance.
          </DialogDescription>
        </DialogHeader>
        {account.error && (
          <Alert variant="destructive">
            <AlertDescription>{account.error}</AlertDescription>
          </Alert>
        )}
        {!profile && !account.error && (
          <p role="status" className="py-6 text-sm text-muted-foreground">
            Loading your profile…
          </p>
        )}
        {profile && (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              account.save()
            }}
            className="flex flex-col gap-5"
          >
            <div className="grid gap-2">
              <Label htmlFor="staff-name">Full name</Label>
              <Input
                id="staff-name"
                value={profile.fullName}
                maxLength={100}
                required
                onChange={(event) =>
                  account.setProfile({
                    ...profile,
                    fullName: event.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="staff-email">Work email</Label>
              <Input id="staff-email" value={profile.email ?? ""} readOnly />
              <p className="text-xs text-muted-foreground">
                Email and access changes are managed by your administrator.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="staff-avatar">Profile photo</Label>
              <Input
                id="staff-avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={account.pending}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) account.upload(file)
                }}
              />
              <p className="text-xs text-muted-foreground">
                JPEG, PNG or WebP, up to 2 MB. Your photo remains private to
                your staff session.
              </p>
            </div>
            <Button type="submit" disabled={account.pending}>
              {account.pending ? "Saving…" : "Save profile"}
            </Button>
          </form>
        )}
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm">Workspace appearance</span>
          <ThemeSwitcher />
        </div>
        <Button
          variant="outline"
          disabled={account.pending}
          onClick={account.restart}
        >
          Restart workspace tour
        </Button>
        {profile?.role === "admin" && (
          <>
            <Separator />
            <StaffDirectory />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
