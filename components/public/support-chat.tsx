"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
const Conversation = dynamic(() => import("./support-conversation"), {
  ssr: false,
  loading: () => (
    <p className="p-6" role="status">
      Opening assistant…
    </p>
  ),
})

export function SupportChat() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed right-4 bottom-4 z-40 shadow-sm sm:right-6 sm:bottom-6"
          aria-label="Open AI assistant"
        >
          <MessageCircle />
          <span className="hidden sm:inline">Ask a question</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="cargo-public gap-0 bg-card data-[side=right]:w-full sm:max-w-md">
        <SheetHeader className="border-b p-6 pr-14">
          <SheetTitle>How can we help?</SheetTitle>
          <SheetDescription>
            AI answers about our services. Use shipment tracking for recorded
            delivery updates.
          </SheetDescription>
        </SheetHeader>
        {open && <Conversation />}
      </SheetContent>
    </Sheet>
  )
}
