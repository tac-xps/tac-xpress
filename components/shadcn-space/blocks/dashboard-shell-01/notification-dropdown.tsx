"use client"

import React from "react"
import { NotificationIcon } from "@/components/icons/sidebar-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/components/providers/notification-provider"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Ticket, FileText, Box } from "lucide-react"

export function NotificationDropdown() {
  const { notifications, unreadCount, markAllAsRead, markAsRead } =
    useNotifications()

  return (
    <DropdownMenu
      onOpenChange={(open) => open && unreadCount > 0 && markAllAsRead()}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <NotificationIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 animate-pulse rounded-full bg-destructive ring-2 ring-background" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          <span className="text-xs text-muted-foreground">
            {notifications.length} recent
          </span>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="cursor-pointer p-0"
                asChild
              >
                <Link
                  href={notif.link}
                  className={`flex items-start gap-4 border-b border-border/50 px-4 py-3 last:border-0 ${notif.read ? "opacity-70" : "bg-muted/20"}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="mt-0.5 shrink-0 rounded-full border border-border/50 bg-background p-1.5 shadow-sm">
                    {notif.type === "ticket" ? (
                      <Ticket className="text-trend-positive size-4" />
                    ) : notif.type === "invoice" ? (
                      <FileText className="size-4 text-primary" />
                    ) : (
                      <Box className="size-4 text-status-pending" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 overflow-hidden">
                    <span className="text-sm leading-none font-medium">
                      {notif.title}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {notif.description}
                    </span>
                    <span className="mt-1 text-[10px] text-muted-foreground/70">
                      {formatDistanceToNow(new Date(notif.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
