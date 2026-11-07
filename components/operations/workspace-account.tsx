"use client"

import { useState } from "react"
import { Settings, ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { logoutUser } from "@/app/actions/auth"
import ProfileDropdown, {
  type Account,
  type AccountTheme,
  type ProfileMenuItem,
} from "@/components/kokonutui/profile-dropdown"
import { AccountSettings } from "./account-settings"

export type WorkspaceUser = {
  id?: string
  name?: string | null
  email?: string | null
  role?: string
  image?: string | null
}

export { default as ProfileDropdown } from "@/components/kokonutui/profile-dropdown"

export function WorkspaceAccount({ user }: { user?: WorkspaceUser }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const name = user?.name || user?.email?.split("@")[0] || "TAC Admin"
  const email = user?.email || "admin@tacxpress.in"
  const role = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Admin"

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const primaryAccount: Account = {
    id: user?.id || "tac-admin",
    name,
    email,
    plan: role,
    initials,
  }

  // Corridor workspace accounts for multi-account switching demonstration
  const accounts: Account[] = [
    primaryAccount,
    {
      id: "imphal-hub",
      name: "Imphal Hub Operations",
      email: "imphal.ops@tacxpress.in",
      plan: "Hub Lead",
      initials: "IH",
    },
    {
      id: "delhi-dispatch",
      name: "Delhi Air Dispatch",
      email: "delhi.dispatch@tacxpress.in",
      plan: "Dispatcher",
      initials: "DD",
    },
  ]

  const items: ProfileMenuItem[] = [
    {
      label: "Account & preferences",
      icon: <Settings className="size-4" />,
      onSelect: () => setSettingsOpen(true),
    },
    {
      label: "Public website",
      icon: <ExternalLink className="size-4" />,
      href: "/",
    },
  ]

  const handleSignOut = async () => {
    try {
      await logoutUser()
    } catch {
      toast.error("Could not sign out. Please try again.")
    }
  }

  return (
    <div id="tour-user-menu" className="flex items-center">
      <ProfileDropdown
        compact
        accounts={accounts}
        defaultAccountId={primaryAccount.id}
        items={items}
        theme={(theme as AccountTheme) ?? "system"}
        onThemeChange={(newTheme) => setTheme(newTheme)}
        onSignOut={handleSignOut}
        holdDuration={1200}
      />
      {settingsOpen && (
        <AccountSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
      )}
    </div>
  )
}
