"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getWorkspaceActivity } from "@/app/actions/workspace-activity"
export type AppNotification = { id: string; type: "ticket" | "invoice" | "shipment"; title: string; description: string; created_at: string; read: boolean; link: string }
type NotificationContextType = { notifications: AppNotification[]; unreadCount: number; markAllAsRead: () => void; markAsRead: (id: string) => void; error?: string }
const NotificationContext = createContext<NotificationContextType>({ notifications: [], unreadCount: 0, markAllAsRead: () => {}, markAsRead: () => {} })
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [error, setError] = useState("")
  const [readIds, setReadIds] = useState<string[]>([])
  useEffect(() => {
    let active = true
    let loading = false
    async function refresh() {
      if (loading || document.visibilityState === "hidden") return
      loading = true
      try {
        const response = await getWorkspaceActivity()
        if (active) {
          setNotifications(response.items.map((item) => ({ ...item, read: false })))
          setError("")
        }
      } catch { if (active) setError("Recent activity is unavailable. Open the relevant workspace page or try again later.") }
      finally { loading = false }
    }
    void refresh()
    const timer = window.setInterval(refresh, 60_000)
    window.addEventListener("focus", refresh)
    return () => { active = false; window.clearInterval(timer); window.removeEventListener("focus", refresh) }
  }, [])
  const visible = notifications.map((item) => ({ ...item, read: readIds.includes(item.id) }))
  return <NotificationContext.Provider value={{
    notifications: visible, error, unreadCount: visible.filter((item) => !item.read).length,
    markAllAsRead: () => setReadIds(notifications.map((item) => item.id)),
    markAsRead: (id) => setReadIds((ids) => [...new Set([...ids, id])].slice(-100)),
  }}>{children}</NotificationContext.Provider>
}
export function useNotifications() { return useContext(NotificationContext) }

