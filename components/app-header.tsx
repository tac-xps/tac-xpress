"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { navLinks } from "@/components/app-shared"
import { CustomTrigger } from "@/components/custom-trigger"
import { NavUser } from "@/components/nav-user"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { HelpCircleIcon, BellIcon } from "lucide-react"

import { useState, useEffect } from "react"
import {
  getUnreadCount,
  getPendingNotifications,
  markNotificationSent,
} from "@/app/actions/notifications"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface AppNotification {
  id: string
  type: string
  status: string
  tickets?: {
    subject: string
    priority: string
    sla_breach_type: string
  }
}

export function AppHeader() {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    getUnreadCount().then(setUnreadCount).catch(console.error)
  }, [])

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open)
    if (open) {
      const data = await getPendingNotifications()
      setNotifications(data || [])
    }
  }

  const handleMarkSent = async (id: string) => {
    await markNotificationSent(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  // Find the active nav item by matching pathname
  const activeItem = navLinks.find((item) => {
    if (!item.path) return false
    if (item.path === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(item.path)
  })

  return (
    <header className="sticky top-0 z-50 flex h-(--app-header-height) w-full shrink-0 items-center justify-between gap-2 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <CustomTrigger place="navbar" />
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{activeItem?.title ?? "Dashboard"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        <Button
          size="icon-sm"
          variant="outline"
          aria-label="Help & documentation"
        >
          <HelpCircleIcon />
        </Button>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              aria-label="Notifications"
              size="icon-sm"
              variant="outline"
              className="relative"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-primary-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b px-4 py-3 text-sm font-semibold">
              Notifications
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex flex-col gap-1 border-b px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium">
                        {n.type === "sla_breached"
                          ? "SLA Breach"
                          : "SLA At Risk"}
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleMarkSent(n.id)}
                        className="h-auto p-0 text-xs"
                      >
                        Mark read
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ticket: {n.tickets?.subject} <br />
                      Priority:{" "}
                      <span className="capitalize">{n.tickets?.priority}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <NavUser />
      </div>
    </header>
  )
}
