"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import {
  MessageChatIcon,
  SendMessageIcon,
  CloseCustomIcon,
  TrackingBoxIcon,
} from "@/components/icons/landing-icons"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { type UIMessage } from "@ai-sdk/react"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/prompt-kit/reasoning"

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
}

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10, x: -10 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
}

const extractReasoning = (content: string) => {
  const match = content.match(/<think>([\s\S]*?)<\/think>/)
  if (match) {
    return {
      reasoning: match[1].trim(),
      content: content.replace(/<think>[\s\S]*?<\/think>/, "").trim(),
    }
  }
  if (content.includes("<think>")) {
    const parts = content.split("<think>")
    const reasoningPart = parts[1]
    return {
      reasoning: reasoningPart,
      content: parts[0].trim(),
    }
  }
  return { reasoning: null, content }
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: "welcome-message",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Hello! I'm your Tac-Xpress Assistant. I can help you with cargo tracking, pickup scheduling, or general inquiries about our logistics services. How can I assist you today?",
        },
      ],
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: input }],
    }
    const currentMessages = [...messages, userMessage]
    setMessages(currentMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages }),
      })

      if (!res.ok) throw new Error("Network error")

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No reader")

      const decoder = new TextDecoder()
      let done = false
      let textBuffer = ""
      let streamBuffer = ""

      const assistantMessageId = Date.now().toString() + "-ast"
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          parts: [{ type: "text", text: "" }],
        },
      ])

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          streamBuffer += decoder.decode(value, { stream: true })
          const parts = streamBuffer.split("\n\n")
          streamBuffer = parts.pop() || ""

          for (const part of parts) {
            const lines = part.split("\n")
            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.type === "text-delta") {
                    textBuffer += data.delta
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMessageId
                          ? {
                              ...m,
                              parts: [{ type: "text", text: textBuffer }],
                            }
                          : m
                      )
                    )
                  }
                } catch (e) {
                  console.error("Parse error:", e)
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[380px] overflow-hidden rounded-none border border-border/40 bg-background/60 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
          >
            <div className="relative overflow-hidden border-b border-border/40 bg-muted/30 p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 opacity-50" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 rounded-none border-2 border-background shadow-sm">
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                        <TrackingBoxIcon className="h-5 w-5" />
                      </div>
                    </Avatar>
                    <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-widest text-foreground uppercase">
                      Tac-Xpress
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs tracking-wider text-muted-foreground uppercase">
                        AI Support
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-background/50"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseCustomIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex h-[400px] flex-col gap-4 overflow-y-auto bg-gradient-to-b from-background/20 to-background/40 p-4">
              {messages.map((m: UIMessage, index: number) => {
                const rawContent =
                  m.parts
                    ?.filter((p: any) => p.type === "text")
                    .map((p: any) => p.text)
                    .join("") ||
                  (m as any).content ||
                  ""

                const { reasoning: parsedReasoning, content: actualContent } =
                  extractReasoning(rawContent)

                const finalReasoning = parsedReasoning
                const finalContent = actualContent

                const isLastMessage = index === messages.length - 1
                const isStreamingThisMessage =
                  isLoading && isLastMessage && m.role === "assistant"

                return (
                  <motion.div
                    key={m.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      "flex gap-3",
                      m.role === "user" ? "flex-row-reverse self-end" : ""
                    )}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0 rounded-none border border-border/40 shadow-sm">
                      {m.role === "assistant" ? (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                          <TrackingBoxIcon className="h-4 w-4" />
                        </div>
                      ) : (
                        <AvatarFallback className="rounded-none bg-primary font-semibold text-primary-foreground">
                          ME
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={cn(
                        "flex max-w-[85%] flex-col gap-1",
                        m.role === "user" ? "items-end" : ""
                      )}
                    >
                      <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                        {m.role === "assistant" ? "Tac-Xpress" : "You"}
                      </span>
                      <div
                        className={cn(
                          "rounded-none border px-4 py-2.5 text-sm shadow-sm",
                          m.role === "user"
                            ? "border-transparent bg-primary text-primary-foreground shadow-md"
                            : "border-border/20 bg-muted/50 backdrop-blur-sm"
                        )}
                      >
                        {finalReasoning && m.role === "assistant" && (
                          <Reasoning isStreaming={isStreamingThisMessage}>
                            <ReasoningTrigger>
                              Thinking process
                            </ReasoningTrigger>
                            <ReasoningContent className="whitespace-pre-wrap">
                              {finalReasoning}
                            </ReasoningContent>
                          </Reasoning>
                        )}
                        {finalContent && (
                          <p
                            className={cn(
                              "leading-relaxed whitespace-pre-wrap",
                              finalReasoning
                                ? "mt-3 border-t border-border/40 pt-3"
                                : ""
                            )}
                          >
                            {finalContent}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-8 w-8 rounded-none border border-border/40 shadow-sm">
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                      <TrackingBoxIcon className="h-4 w-4" />
                    </div>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex w-16 items-center justify-center gap-1 rounded-none border border-border/20 bg-muted/50 px-4 py-3 shadow-sm backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/40" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border/40 bg-background/60 p-3 backdrop-blur-md">
              <form
                className="relative flex items-center gap-2"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about our services..."
                  className="flex-1 rounded-none border border-border/40 bg-background/50 px-4 py-2.5 text-sm transition-all outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/10"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 rounded-none bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:shadow-primary/25"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendMessageIcon className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={cn(
          "group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-2xl transition-all duration-300",
          isOpen
            ? "rotate-90 bg-destructive text-destructive-foreground"
            : "bg-primary text-primary-foreground hover:shadow-primary/25"
        )}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-inherit opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
        {isOpen ? (
          <CloseCustomIcon className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageChatIcon className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  )
}
