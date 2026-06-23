"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/clients"
import { toast } from "sonner"
import { Bell, Ticket, Box, FileText } from "lucide-react"

export type AppNotification = {
  id: string
  type: "ticket" | "invoice" | "shipment"
  title: string
  description: string
  created_at: string
  read: boolean
  link: string
}

interface NotificationContextType {
  notifications: AppNotification[]
  unreadCount: number
  markAllAsRead: () => void
  markAsRead: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  // Function to add a notification to the list, keeping only the 50 most recent
  const addNotification = (newNotif: AppNotification) => {
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50))

    // Show a global toast!
    toast(newNotif.title, {
      description: newNotif.description,
      icon:
        newNotif.type === "ticket" ? (
          <Ticket className="text-trend-positive h-4 w-4" />
        ) : newNotif.type === "invoice" ? (
          <FileText className="h-4 w-4 text-primary" />
        ) : (
          <Box className="h-4 w-4 text-status-pending" />
        ),
    })
  }

  useEffect(() => {
    const supabase = supabaseBrowser()

    // Listen for new Tickets
    const ticketsChannel = supabase
      .channel("global-tickets")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tickets" },
        (payload: any) => {
          const ticket = payload.new as any
          addNotification({
            id: `ticket-${ticket.id}`,
            type: "ticket",
            title: "New Support Ticket",
            description: ticket.subject,
            created_at: ticket.created_at || new Date().toISOString(),
            read: false,
            link: `/dashboard/messages`,
          })
        }
      )

    // Listen for new Invoices (assuming table exists)
    const invoicesChannel = supabase
      .channel("global-invoices")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "invoices" },
        (payload: any) => {
          const invoice = payload.new as any
          addNotification({
            id: `invoice-${invoice.id}`,
            type: "invoice",
            title: "New Invoice Created",
            description: `Invoice #${invoice.invoice_number} for ${invoice.customer_name}`,
            created_at: invoice.created_at || new Date().toISOString(),
            read: false,
            link: `/dashboard/invoices`,
          })
        }
      )

    // Listen for new Shipments (assuming table exists)
    const shipmentsChannel = supabase
      .channel("global-shipments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shipments" },
        (payload: any) => {
          const shipment = payload.new as any
          addNotification({
            id: `shipment-${shipment.id}`,
            type: "shipment",
            title: "New Shipment Created",
            description: `AWB: ${shipment.awb_number}`,
            created_at: shipment.created_at || new Date().toISOString(),
            read: false,
            link: `/dashboard/shipments`,
          })
        }
      )

    ticketsChannel.subscribe()
    invoicesChannel.subscribe()
    shipmentsChannel.subscribe()

    return () => {
      supabase.removeChannel(ticketsChannel)
      supabase.removeChannel(invoicesChannel)
      supabase.removeChannel(shipmentsChannel)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    )
  }
  return context
}
