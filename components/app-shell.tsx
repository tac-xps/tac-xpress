"use client"
import type { HTMLAttributes } from "react"
import { WorkspaceFrame } from "@/components/operations/workspace-frame"
import { SiteHeader } from "@/components/operations/site-header"
import type { WorkspaceUser } from "@/components/operations/workspace-account"
import { SystemBanner } from "@/components/system-banner"
export function AppShell({
  user,
  userRole,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  userRole?: string
  user?: WorkspaceUser
}) {
  return (
    <WorkspaceFrame
      userRole={userRole}
      header={<SiteHeader user={user} />}
      banner={<SystemBanner />}
      {...props}
    >
      {children}
    </WorkspaceFrame>
  )
}
