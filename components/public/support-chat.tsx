"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MagneticButton } from "./magnetic-button"
import { motion, useReducedMotion } from "motion/react"

function SquareChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15H7l-4 4V3h18v12z" />
      <line x1="7" y1="7" x2="17" y2="7" />
      <line x1="7" y1="11" x2="13" y2="11" />
    </svg>
  )
}

const Conversation = dynamic(() => import("./support-conversation"), {
  ssr: false,
  loading: () => (
    <p className="p-6 font-mono text-xs text-muted-foreground" role="status">
      Opening assistant…
    </p>
  ),
})

const MotionButton = motion.create(Button)

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <MagneticButton
            strength={0.2}
            className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
          >
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <MotionButton
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="relative aspect-square size-12 sm:size-14 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground p-0 shadow-lg hover:shadow-xl flex items-center justify-center border border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all cursor-pointer"
                  aria-label="Ask a question"
                  title="Ask a question"
                >
                  <span className="absolute top-2.5 right-2.5 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-primary-foreground opacity-75" />
                    <span className="relative inline-flex size-2 rounded-none bg-primary-foreground" />
                  </span>
                  <SquareChatIcon className="size-5 sm:size-6" />
                  <span className="sr-only">Ask a question</span>
                </MotionButton>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              sideOffset={12}
              className="rounded-none bg-popover text-popover-foreground border px-3 py-1.5 font-mono text-xs uppercase tracking-wider shadow-md"
            >
              Ask a question
            </TooltipContent>
          </MagneticButton>
        </Tooltip>
      </TooltipProvider>

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
