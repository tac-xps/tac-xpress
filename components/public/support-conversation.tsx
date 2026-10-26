"use client"
import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { bubblePopVariant, microGestures } from "@/lib/animations"
import AIInputSearch, { type SearchTool } from "@/components/kokonutui/ai-input-search"
import { Package, MapPin, Phone } from "lucide-react"

const transport = new DefaultChatTransport({
  api: "/api/chat",
  prepareSendMessagesRequest: ({ messages }) => ({
    body: { messages: messages.slice(-12) },
  }),
})

const CARGO_TOOLS: SearchTool[] = [
  {
    id: "tracking",
    label: "Track shipment",
    icon: Package,
    activity: "Querying custody ledger",
    placeholder: "Enter AWB number or consignment ID",
    hint: "Real-time gate audit trail",
    color: "var(--color-primary)",
  },
  {
    id: "routes",
    label: "Route inquiry",
    icon: MapPin,
    activity: "Fetching corridor data",
    placeholder: "Ask about corridors, hubs, or transit times",
    hint: "DEL, IMF, CCU and all gateways",
    color: "var(--color-info)",
  },
  {
    id: "support",
    label: "Operations desk",
    icon: Phone,
    activity: "Routing to operations",
    placeholder: "Ask anything about cargo, packaging, or billing",
    hint: "Mon–Sat 08:00–20:00 IST",
    color: "var(--color-status-delivered)",
  },
]

export default function SupportConversation() {
  const shouldReduceMotion = useReducedMotion()
  const { messages, sendMessage, status, error, stop, regenerate } = useChat({ transport })
  const bottom = useRef<HTMLDivElement>(null)
  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest", behavior: shouldReduceMotion ? "auto" : "smooth" })
  }, [messages, shouldReduceMotion])

  useEffect(() => () => { void stop() }, [stop])

  return (
    <>
      <div
        role="log"
        aria-label="Assistant conversation"
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6"
      >
        {!messages.length && (
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Tell me what you&apos;re planning to send, or ask about preparing your
              cargo.
            </p>
            <Link href="/track" className="font-medium text-primary underline">
              Track a shipment
            </Link>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={bubblePopVariant}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              exit="exit"
              className={
                message.role === "user"
                  ? "rounded-none bg-secondary p-3.5 self-end max-w-[85%]"
                  : "py-1.5 self-start max-w-[90%]"
              }
            >
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {message.role === "user" ? "You" : "AI assistant"}
              </p>
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("")}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {status === "submitted" && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground py-1"
          >
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-none bg-primary animate-pulse" />
              <span className="size-1.5 rounded-none bg-primary animate-pulse [animation-delay:200ms]" />
              <span className="size-1.5 rounded-none bg-primary animate-pulse [animation-delay:400ms]" />
            </span>
            <span>Preparing a reply…</span>
          </motion.div>
        )}

        {error && (
          <div role="alert" className="flex flex-col gap-3 text-sm text-destructive">
            The assistant couldn&apos;t reply. Try again shortly or{" "}
            <Link href="/contact" className="underline">
              contact our team
            </Link>
            .
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              disabled={busy}
              onClick={() => { void regenerate() }}
            >
              Retry reply
            </Button>
          </div>
        )}
        <div ref={bottom} />
      </div>

      {/* AIInputSearch replaces the plain input form */}
      <div className="border-t p-4">
        {busy ? (
          <div className="flex items-center justify-between px-2 py-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
              <span className="size-1.5 rounded-none bg-primary animate-pulse" />
              Assistant is responding…
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none text-xs"
              onClick={() => stop()}
            >
              Stop
            </Button>
          </div>
        ) : (
          <AIInputSearch
            placeholder="Ask about cargo, routes, or packaging…"
            tools={CARGO_TOOLS}
            defaultTool="support"
            models={["TAC Express AI"]}
            defaultModel="TAC Express AI"
            onSearch={async (query, { signal }) => {
              if (!query.trim()) return
              await sendMessage({ text: query.trim() })
            }}
            className="w-full rounded-none border-0 shadow-none p-0"
          />
        )}
      </div>
    </>
  )
}
