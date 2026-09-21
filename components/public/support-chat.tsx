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
import { MagneticButton } from "./magnetic-button"
import { motion, useReducedMotion } from "motion/react"

const Conversation = dynamic(() => import("./support-conversation"), {
  ssr: false,
  loading: () => (
    <p className="p-6 font-mono text-xs text-muted-foreground" role="status">
      Opening assistant…
    </p>
  ),
})

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <MagneticButton
        strength={0.2}
        className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
      >
        <SheetTrigger asChild>
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-semibold uppercase tracking-wider px-4 py-2.5 h-11 shadow-md flex items-center gap-2 border border-primary/40"
              aria-label="Open AI assistant"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary-foreground" />
              </span>
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">Ask a question</span>
            </Button>
          </motion.div>
        </SheetTrigger>
      </MagneticButton>

      <SheetContent className="cargo-public gap-0 bg-card data-[side=right]:w-full sm:max-w-md">
        <SheetHeader className="border-b p-6 pr-14">
          <SheetTitle className="font-sans text-lg font-semibold tracking-tight">How can we help?</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            AI answers about our services. Use shipment tracking for recorded
            delivery updates.
          </SheetDescription>
        </SheetHeader>
        {open && <Conversation />}
      </SheetContent>
    </Sheet>
  )
}
