"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, CreditCard, Users, Key, Bell, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { updateProfile, getTeamMembers } from "@/app/actions/user"
import { toast } from "sonner"
import { format } from "date-fns"

export type SettingsTab = "account" | "team" | "api" | "notifications"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: SettingsTab
  profile?: any
  onProfileUpdate?: (updatedFields: any) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  defaultTab = "account",
  profile,
  onProfileUpdate,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)

  const [fullName, setFullName] = useState(profile?.fullName || "")
  const [emailNotifs, setEmailNotifs] = useState(
    profile?.emailNotifications ?? true
  )
  const [whatsappNotifs, setWhatsappNotifs] = useState(
    profile?.whatsappNotifications ?? true
  )
  const [smsNotifs, setSmsNotifs] = useState(profile?.smsNotifications ?? false)

  const [teamMembers, setTeamMembers] = useState<any[]>([])
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "")
      setEmailNotifs(profile.emailNotifications ?? true)
      setWhatsappNotifs(profile.whatsappNotifications ?? true)
      setSmsNotifs(profile.smsNotifications ?? false)
    }
  }, [profile])

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab)
      // Fetch dynamic data when modal opens
      setIsDataLoading(true)
      getTeamMembers()
        .catch(() => [])
        .then((team) => {
          setTeamMembers(team)
          setIsDataLoading(false)
        })
    }
  }, [open, defaultTab])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await updateProfile({
        fullName,
        emailNotifications: emailNotifs,
        whatsappNotifications: whatsappNotifs,
        smsNotifications: smsNotifs,
      })
      if (onProfileUpdate) {
        onProfileUpdate({
          fullName,
          emailNotifications: emailNotifs,
          whatsappNotifications: whatsappNotifs,
          smsNotifications: smsNotifs,
        })
      }
      toast.success("Settings updated successfully!")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[700px] max-w-[95vw] flex-col overflow-hidden rounded-none border-border/50 bg-background/90 p-0 shadow-2xl backdrop-blur-3xl sm:max-w-4xl md:max-w-4xl md:flex-row lg:max-w-5xl">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your personal profile and workspace settings here.
        </DialogDescription>

        {/* Left Sidebar Tabs */}
        <div className="flex w-full flex-col gap-2 border-r border-border/40 bg-muted/20 p-4 md:w-64">
          <div className="mt-2 mb-4 px-2">
            <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Manage your workspace.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as SettingsTab)}
            orientation="vertical"
            className="flex w-full flex-col gap-1"
          >
            <TabsList className="flex h-auto flex-col items-start space-y-1 bg-transparent p-0">
              <TabsTrigger
                value="account"
                className="w-full justify-start rounded-none px-3 py-2 transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <User className="mr-2 h-4 w-4" /> Account
              </TabsTrigger>

              <TabsTrigger
                value="team"
                className="w-full justify-start rounded-none px-3 py-2 transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <Users className="mr-2 h-4 w-4" /> Team Members
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="w-full justify-start rounded-none px-3 py-2 transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <Key className="mr-2 h-4 w-4" /> API Integrations
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="w-full justify-start rounded-none px-3 py-2 transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                <Bell className="mr-2 h-4 w-4" /> Notifications
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <Tabs value={activeTab} className="h-full w-full">
            {/* ACCOUNT TAB */}
            <TabsContent
              value="account"
              className="m-0 flex h-full animate-in flex-col gap-6 border-none p-0 duration-300 fade-in-50 outline-none slide-in-from-right-4"
            >
              <div>
                <h3 className="text-xl font-medium tracking-tight">
                  Profile Details
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your personal information.
                </p>
              </div>
              <div className="mt-4 max-w-md space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="cursor-not-allowed bg-muted/50"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Contact support to change your email.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile?.role || "Viewer"}
                    disabled
                    className="cursor-not-allowed bg-muted/50"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="mt-6 w-full sm:w-auto"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* TEAM TAB */}
            <TabsContent
              value="team"
              className="m-0 flex h-full animate-in flex-col gap-6 border-none p-0 duration-300 fade-in-50 outline-none slide-in-from-right-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium tracking-tight">
                    Team Members
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage who has access to your workspace.
                  </p>
                </div>
                <Button size="sm" className="shadow-sm">
                  <Users className="mr-2 h-4 w-4" /> Invite User
                </Button>
              </div>
              <div className="mt-4 overflow-hidden rounded-none border border-border/50 shadow-sm">
                <div className="grid grid-cols-4 border-b border-border/50 bg-muted/30 p-3 text-xs font-semibold text-muted-foreground">
                  <div className="col-span-2 pl-2">User</div>
                  <div>Role</div>
                  <div className="pr-2 text-right">Action</div>
                </div>
                {isDataLoading ? (
                  <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading
                    team members...
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No team members found.
                  </div>
                ) : (
                  teamMembers.map((member, i) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-4 items-center border-b border-border/50 p-3 transition-colors last:border-0 hover:bg-muted/10"
                    >
                      <div className="col-span-2 flex items-center gap-3 pl-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {member.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {member.fullName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {member.email}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="rounded bg-muted/50 px-2 py-1 text-xs">
                          {member.role}
                        </span>
                      </div>
                      <div className="pr-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs hover:bg-background"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* API TAB */}
            <TabsContent
              value="api"
              className="m-0 flex h-full animate-in flex-col gap-6 border-none p-0 duration-300 fade-in-50 outline-none slide-in-from-right-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium tracking-tight">
                    API Integrations
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your secret keys for webhooks and APIs.
                  </p>
                </div>
                <Button size="sm" variant="default" className="shadow-sm">
                  Generate New Key
                </Button>
              </div>
              <div className="mt-4 flex flex-col gap-4 rounded-none border border-border/50 bg-muted/5 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">
                      Production API Key
                    </h4>
                    <p className="mt-1 inline-block cursor-pointer rounded bg-muted/30 px-2 py-1 font-mono text-sm text-muted-foreground blur-sm transition-all hover:blur-none">
                      pk_live_8f92a4b89x9p2
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* NOTIFICATIONS TAB */}
            <TabsContent
              value="notifications"
              className="m-0 flex h-full animate-in flex-col gap-6 border-none p-0 duration-300 fade-in-50 outline-none slide-in-from-right-4"
            >
              <div>
                <h3 className="text-xl font-medium tracking-tight">
                  Notification Rules
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Configure how you receive operational alerts.
                </p>
              </div>
              <div className="mt-4 max-w-lg space-y-4">
                <div className="flex items-center justify-between rounded-none border border-border/50 bg-muted/5 p-4 shadow-sm">
                  <div className="space-y-1 pr-4">
                    <Label className="text-base font-medium">
                      Email Alerts
                    </Label>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Receive daily operational digests, SLA warnings, and
                      weekly performance reports.
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifs}
                    onCheckedChange={setEmailNotifs}
                  />
                </div>
                <div className="flex items-center justify-between rounded-none border border-border/50 bg-muted/5 p-4 shadow-sm">
                  <div className="space-y-1 pr-4">
                    <Label className="text-base font-medium">
                      WhatsApp Webhooks
                    </Label>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Instant real-time messages for high-priority dispatch
                      assignments.
                    </p>
                  </div>
                  <Switch
                    checked={whatsappNotifs}
                    onCheckedChange={setWhatsappNotifs}
                  />
                </div>
                <div className="flex items-center justify-between rounded-none border border-border/50 bg-muted/5 p-4 shadow-sm">
                  <div className="space-y-1 pr-4">
                    <Label className="text-base font-medium">
                      SMS Critical Outages
                    </Label>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Fallback alerts reserved strictly for system outages and
                      emergency fleet tracking.
                    </p>
                  </div>
                  <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="mt-6"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Preferences
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
