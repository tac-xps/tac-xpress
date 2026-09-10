"use client"
// Official shadcn sidebar-07 nav-user composition; account actions are TAC-XPRESS.
import { useState, useTransition } from "react"
import Link from "next/link"
import { LogOut, Settings, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUser } from "@/app/actions/auth"
import { toast } from "sonner"
import { AccountSettings } from "./account-settings"
export type WorkspaceUser = {
  id?: string
  name?: string | null
  email?: string | null
  role?: string
  image?: string | null
}
export function WorkspaceAccount({ user }: { user?: WorkspaceUser }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const name = user?.name || user?.email?.split("@")[0] || "Staff"
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <div id="tour-user-menu">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open staff account">
            <Avatar className="size-8 rounded-none">
              <AvatarImage src={user?.image ?? undefined} alt="" />
              <AvatarFallback className="rounded-none bg-secondary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="grid gap-1">
            <span className="truncate">{name}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {user?.email}
            </span>
            <span className="text-xs font-normal text-muted-foreground capitalize">
              {user?.role ?? "Staff"}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
              <Settings />
              Account & preferences
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">
                <ExternalLink />
                Public website
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={pending}
            onSelect={() =>
              startTransition(async () => {
                try {
                  await logoutUser()
                } catch {
                  toast.error("Could not sign out. Please try again.")
                }
              })
            }
          >
            <LogOut />
            {pending ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {settingsOpen && (
        <AccountSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
      )}
    </div>
  )
}
