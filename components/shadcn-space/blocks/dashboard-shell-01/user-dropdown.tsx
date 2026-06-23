"use client"

import React, { useEffect, useState, useRef } from "react"
import {
  User,
  LogOut,
  Settings,
  CreditCard,
  Users,
  Key,
  Monitor,
  Moon,
  Sun,
  Bell,
  Upload,
  Loader2,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { getUserProfile, uploadAvatarFile, resetTour } from "@/app/actions/user"
import { logoutUser } from "@/app/actions/auth"
import { toast } from "sonner"
import { SettingsDialog, SettingsTab } from "./settings-dialog"

export function UserDropdown() {
  const { setTheme } = useTheme()
  const { data: session, status } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<{
    id?: string
    fullName?: string
    email?: string
    avatarUrl?: string
    role?: string
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Settings Dialog State
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")

  const openSettings = (tab: SettingsTab) => {
    setActiveTab(tab)
    setSettingsOpen(true)
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUserProfile()
        if (data) {
          setProfile({
            ...data,
            email: data.email || session?.user?.email || undefined,
            role: data.role || (session?.user as any)?.role || undefined,
          })
        } else if (session?.user?.id) {
          // Fallback to session data if profile fetch fails
          setProfile({
            id: session.user.id,
            email: session.user.email || undefined,
            fullName: session.user.name || "Guest User",
            role: (session.user as any)?.role || "Staff",
          })
        }
      } catch (err) {
        console.error("Failed to fetch user", err)
        if (session?.user?.id) {
          const defaultName = session.user.email
            ? session.user.email.split("@")[0]
            : "Guest User"
          setProfile({
            id: session.user.id,
            email: session.user.email || undefined,
            fullName: session.user.name || defaultName,
            role: (session.user as any)?.role || "Staff",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      loadUser()
    } else if (status === "unauthenticated") {
      setIsLoading(false)
    }
  }, [session, status])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!profile?.id) {
      toast.error("You must be signed in to upload an avatar.")
      return
    }

    setIsUploading(true)
    const toastId = toast.loading("Uploading avatar...")
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await uploadAvatarFile(formData)

      setProfile((prev) =>
        prev ? { ...prev, avatarUrl: res.publicUrl } : null
      )
      toast.success("Avatar updated successfully!", { id: toastId })
    } catch (error: any) {
      console.error("Upload failed:", error)
      toast.error(error.message || "Failed to upload avatar", { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "TX"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        className="relative h-9 w-9 animate-pulse rounded-full bg-muted/50"
        disabled
      />
    )
  }

  return (
    <>
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        defaultTab={activeTab}
        profile={profile}
        onProfileUpdate={(updatedFields) =>
          setProfile((prev) => (prev ? { ...prev, ...updatedFields } : prev))
        }
      />
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
        disabled={!profile?.id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full ring-offset-background transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
              <AvatarImage
                src={profile?.avatarUrl || ""}
                alt={profile?.fullName || "User"}
              />
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {getInitials(profile?.fullName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-72 rounded-none border-border/50 bg-background/80 p-2 shadow-xl backdrop-blur-2xl"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="mb-2 rounded-none border border-border/40 bg-muted/30 p-3 font-normal">
            <div className="flex items-center gap-3">
              <label
                htmlFor="avatar-upload"
                className="group relative cursor-pointer rounded-full"
              >
                <Avatar className="h-12 w-12 border border-border/50 shadow-sm transition-opacity group-hover:opacity-50">
                  <AvatarImage
                    src={profile?.avatarUrl || ""}
                    alt={profile?.fullName || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 font-bold text-primary">
                    {getInitials(profile?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin text-primary" />
                  ) : (
                    <Upload className="size-4 text-primary" />
                  )}
                </div>
              </label>
              <div className="flex flex-col space-y-0.5 overflow-hidden">
                <p className="truncate text-sm leading-none font-semibold text-foreground">
                  {profile?.fullName || "Guest User"}
                </p>
                <p className="truncate text-xs leading-none text-muted-foreground">
                  {profile?.email || "Not signed in"}
                </p>
                <div className="mt-1 flex">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
                    {profile?.role || "Viewer"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Button
                onClick={() => openSettings("account")}
                variant="outline"
                size="sm"
                className="h-8 w-full bg-background/50 text-xs font-medium hover:bg-background"
              >
                View Full Profile
              </Button>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer rounded-none"
              onSelect={() => openSettings("account")}
            >
              <User className="mr-2 size-4 text-muted-foreground" />
              <span>Account Options</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-none"
              onSelect={() => openSettings("account")}
            >
              <Settings className="mr-2 size-4 text-muted-foreground" />
              <span>Workspace Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-none"
              onSelect={async (e) => {
                e.preventDefault()
                await resetTour()
                window.location.reload()
              }}
            >
              <Monitor className="mr-2 size-4 text-muted-foreground" />
              <span>Restart Product Tour</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1 opacity-50" />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer rounded-none"
              onSelect={() => openSettings("team")}
            >
              <Users className="mr-2 size-4 text-muted-foreground" />
              <span>Team Management</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-none"
              onSelect={() => openSettings("api")}
            >
              <Key className="mr-2 size-4 text-muted-foreground" />
              <span>API Integrations</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-none"
              onSelect={() => openSettings("notifications")}
            >
              <Bell className="mr-2 size-4 text-muted-foreground" />
              <span>Notification Rules</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1 opacity-50" />

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer rounded-none">
                <Monitor className="mr-2 size-4 text-muted-foreground" />
                <span>Appearance</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="min-w-[120px] rounded-none border-border/50 bg-background/80 p-1 shadow-xl backdrop-blur-2xl">
                  <DropdownMenuItem
                    className="cursor-pointer rounded-none"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 size-4 text-muted-foreground" />
                    <span>Light Mode</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-none"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 size-4 text-muted-foreground" />
                    <span>Dark Mode</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-none"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="mr-2 size-4 text-muted-foreground" />
                    <span>System Match</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1 opacity-50" />

          <DropdownMenuItem
            className="mt-1 cursor-pointer rounded-none text-destructive focus:text-destructive"
            onClick={() => logoutUser()}
          >
            <LogOut className="mr-2 size-4" />
            <span>Sign Out Securely</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
