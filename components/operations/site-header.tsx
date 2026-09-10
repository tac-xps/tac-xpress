"use client"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { WorkspaceHeader } from "./workspace-header"
import { WorkspaceSearch } from "./workspace-search"
import { WorkspaceAccount, type WorkspaceUser } from "./workspace-account"
import { WorkspaceNotifications } from "./workspace-notifications"
export function SiteHeader({ user }: { user?: WorkspaceUser }) {
  return (
    <WorkspaceHeader>
      <WorkspaceSearch />
      <div className="hidden sm:block">
        <ThemeSwitcher />
      </div>
      <WorkspaceNotifications />
      <WorkspaceAccount user={user} />
    </WorkspaceHeader>
  )
}
