"use client"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type AppNotification = {
  id: string
  type: "ticket" | "invoice" | "shipment"
  title: string
  description: string
  created_at: string
  read: boolean
  link: string
}

type NotificationContextType = {
  notifications: AppNotification[]
  unreadCount: number
  markAllAsRead: () => void
  markAsRead: (id: string) => void
  error?: string
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
  markAsRead: () => {},
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [error, setError] = useState("")
  const [readIds, setReadIds] = useState<string[]>([])

  useEffect(() => {
    let active = true
    let loading = false
    let lastFetched = 0

    async function refresh(force = false) {
      const now = Date.now()
      // Throttle: skip if fetched within the last 30s (unless forced)
      if (!force && now - lastFetched < 30_000) return
      if (loading || document.visibilityState === "hidden") return
      loading = true
      try {
        const res = await fetch("/api/workspace-activity", {
          // Bypass browser cache — we rely on our own 30s JS throttle instead
          cache: "no-store",
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as { items: Omit<AppNotification, "read">[] }
        if (active) {
          lastFetched = Date.now()
          setNotifications(data.items.map((item) => ({ ...item, read: false })))
          setError("")
        }
      } catch {
        if (active)
          setError(
            "Recent activity is unavailable. Open the relevant workspace page or try again later."
          )
      } finally {
        loading = false
      }
    }

    void refresh(true)
    // Poll every 60 seconds; focus handler is throttled by the 30s guard above
    const timer = window.setInterval(() => refresh(true), 60_000)
    const handleFocus = () => refresh(false)
    window.addEventListener("focus", handleFocus)

    return () => {
      active = false
      window.clearInterval(timer)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const visible = notifications.map((item) => ({
    ...item,
    read: readIds.includes(item.id),
  }))

  return (
    <NotificationContext.Provider
      value={{
        notifications: visible,
        error,
        unreadCount: visible.filter((item) => !item.read).length,
        markAllAsRead: () =>
          setReadIds(notifications.map((item) => item.id)),
        markAsRead: (id) =>
          setReadIds((ids) => [...new Set([...ids, id])].slice(-100)),
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
