"use client"
import Link from "next/link"
import { Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/components/providers/notification-provider"
export function WorkspaceNotifications() {
  const { notifications, unreadCount, markAllAsRead, markAsRead, error } =
    useNotifications()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifications, ${unreadCount} unread`}
          className="relative"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 size-2 rounded-none bg-status-transit" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-w-[calc(100vw-2rem)]"
      >
        <DropdownMenuLabel>Recent activity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {error && (
          <p role="status" className="px-2 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length
            ? notifications.map((item) => (
                <DropdownMenuItem key={item.id} asChild>
                  <Link
                    href={item.link}
                    onClick={() => markAsRead(item.id)}
                    className="flex flex-col items-start gap-1 py-3"
                  >
                    <span className={item.read ? "font-normal" : "font-medium"}>
                      {item.title}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))
            : !error && (
                <p className="p-4 text-sm text-muted-foreground">
                  No recent activity in the last seven days.
                </p>
              )}
        </div>
        {unreadCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={markAllAsRead}>
              Mark displayed activity as read
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
