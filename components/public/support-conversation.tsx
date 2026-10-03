"use client"
import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { bubblePopVariant, microGestures } from "@/lib/animations"

const transport = new DefaultChatTransport({
  api: "/api/chat",
  prepareSendMessagesRequest: ({ messages }) => ({
    body: { messages: messages.slice(-12) },
  }),
})

export default function SupportConversation() {
  const [input, setInput] = useState("")
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
              Tell me what you’re planning to send, or ask about preparing your
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
            The assistant couldn’t reply. Try again shortly or{" "}
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

      <form
        className="space-y-3 border-t p-6"
        onSubmit={(event) => {
          event.preventDefault()
          if (!input.trim() || busy) return
          void sendMessage({ text: input.trim() })
          setInput("")
        }}
      >
        <Label htmlFor="support-chat-message">Your question</Label>
        <Input
          id="support-chat-message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={4000}
          autoComplete="off"
          placeholder="How should I pack my cargo?"
        />
        <div className="flex items-center justify-end">
          {busy ? (
            <motion.div
              whileHover={shouldReduceMotion ? undefined : microGestures.hoverScale}
              whileTap={shouldReduceMotion ? undefined : microGestures.tap}
            >
              <Button type="button" variant="outline" onClick={() => stop()}>
                Stop reply
              </Button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={shouldReduceMotion ? undefined : microGestures.hoverScale}
              whileTap={shouldReduceMotion ? undefined : microGestures.tap}
            >
              <Button type="submit" disabled={!input.trim()}>
                Send question
              </Button>
            </motion.div>
          )}
        </div>
      </form>
    </>
  )
}
