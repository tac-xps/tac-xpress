"use client"

import { useEffect } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Package,
  Truck,
  FileText,
  Users,
  Settings,
  BarChart3,
  Search,
  Plus,
  MapPin,
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const commands = [
  {
    group: "Actions",
    items: [
      {
        icon: Plus,
        label: "Create Shipment",
        shortcut: "⌘N",
        action: () => {},
      },
      {
        icon: Truck,
        label: "Create Dispatch Run",
        shortcut: "⌘D",
        action: () => {},
      },
      {
        icon: FileText,
        label: "Generate Invoice",
        shortcut: "⌘I",
        action: () => {},
      },
      { icon: Users, label: "Add Customer", shortcut: "⌘⇧C", action: () => {} },
    ],
  },
  {
    group: "Navigation",
    items: [
      {
        icon: BarChart3,
        label: "Go to Dashboard",
        shortcut: "⌘1",
        action: () => {},
      },
      {
        icon: Package,
        label: "Go to Shipments",
        shortcut: "⌘2",
        action: () => {},
      },
      {
        icon: Truck,
        label: "Go to Dispatch",
        shortcut: "⌘3",
        action: () => {},
      },
      {
        icon: FileText,
        label: "Go to Invoices",
        shortcut: "⌘4",
        action: () => {},
      },
      {
        icon: Users,
        label: "Go to Customers",
        shortcut: "⌘5",
        action: () => {},
      },
    ],
  },
  {
    group: "Tools",
    items: [
      { icon: Search, label: "Track AWB", shortcut: "⌘T", action: () => {} },
      {
        icon: MapPin,
        label: "Fleet Tracking",
        shortcut: "⌘⇧F",
        action: () => {},
      },
      { icon: Settings, label: "Settings", shortcut: "⌘,", action: () => {} },
    ],
  },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem key={item.label} onSelect={item.action}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
