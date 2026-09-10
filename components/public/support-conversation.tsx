"use client"
import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const transport = new DefaultChatTransport({
  api: "/api/chat",
  prepareSendMessagesRequest: ({ messages }) => ({
    body: { messages: messages.slice(-12) },
  }),
})
export default function SupportConversation() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, error, stop, regenerate } = useChat({ transport })
  const bottom = useRef<HTMLDivElement>(null)
  const busy = status === "submitted" || status === "streaming"
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" })
  }, [messages])
  useEffect(() => () => { void stop() }, [stop])
  return (
    <>
      <div
        role="log"
        aria-label="Assistant conversation"
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6"
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user" ? "rounded-lg bg-secondary p-3" : "py-1"
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
          </div>
        ))}
        {status === "submitted" && (
          <p role="status" className="text-sm text-muted-foreground">
            Preparing a reply…
          </p>
        )}
        {error && (
          <div role="alert" className="flex flex-col gap-3 text-sm text-destructive">
            The assistant couldn’t reply. Try again shortly or{" "}
            <Link href="/contact" className="underline">
              contact our team
            </Link>
            .
            <Button type="button" variant="outline" size="sm" className="w-fit" disabled={busy} onClick={() => { void regenerate() }}>Retry reply</Button>
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
        {busy ? (
          <Button type="button" variant="outline" onClick={() => stop()}>
            Stop reply
          </Button>
        ) : (
          <Button type="submit" disabled={!input.trim()}>
            Send question
          </Button>
        )}
      </form>
    </>
  )
}
