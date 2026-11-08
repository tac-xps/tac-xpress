"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  Trace,
  TraceLine,
  TraceTitle,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
} from "@/components/ui/trace"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block"
import { useHighlightedCode } from "@/hooks/use-highlighted-code"
import { bubblePopVariant } from "@/lib/animations"
import {
  Package,
  Phone,
  RotateCcw,
  ArrowDown,
  ArrowRight,
  CornerDownLeft,
  Copy,
  Check,
  ShieldAlert,
  Clock,
  Calculator,
  Compass,
} from "lucide-react"

const transport = new DefaultChatTransport({
  api: "/api/chat",
  prepareSendMessagesRequest: ({ messages }) => ({
    body: { messages: messages.slice(-12) },
  }),
})

const QUICK_PROMPTS = [
  {
    icon: Clock,
    title: "Transit SLA Windows",
    desc: "DEL ⇄ IMF Air (24-48h) vs Highway Express (4-7d) transit benchmarks",
    prompt: "What are the departure schedules and transit SLA windows between New Delhi and Imphal?",
  },
  {
    icon: Calculator,
    title: "Freight Rate Formula",
    desc: "Dimensional chargeable weight calculation and statutory 18% GST breakdown",
    prompt: "How are dimensional freight rates and statutory GST calculated for cargo?",
  },
  {
    icon: ShieldAlert,
    title: "Packaging Protocols",
    desc: "Standards for fragile freight, tamper-evident seals, and moisture barriers",
    prompt: "How should I pack fragile cargo and electronics for air transit?",
  },
  {
    icon: Compass,
    title: "Consignment Telemetry",
    desc: "Optical gate scan audit trail and real-time custody verification",
    prompt: "How do I track a consignment by AWB number and verify custody handovers?",
  },
]

function CodeSnippet({
  code,
  language,
}: {
  code: string
  language?: string
}) {
  const lang = language?.trim() || "bash"
  const lines = useHighlightedCode(code, lang)

  return (
    <CodeBlock size="sm" className="my-2 max-w-full rounded-none border border-border bg-card">
      <CodeBlockHeader className="justify-between border-b border-border bg-muted/40 py-1.5">
        <CodeBlockTitle className="font-mono text-[11px] tracking-tight text-muted-foreground uppercase">
          {lang}
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton
            value={code}
            size="icon-xs"
            className="rounded-none border-0 text-muted-foreground hover:bg-muted hover:text-foreground"
          />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent className="p-3 font-mono text-xs">
        {lines.map((line, idx) => (
          <CodeBlockLine key={idx}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function renderInlineText(text: string, onAction?: () => void) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const elements: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index))
    }
    const label = match[1]
    const href = match[2]

    if (href.startsWith("#") || href.startsWith("/#")) {
      const anchor = href.replace(/^\/?#/, "")
      elements.push(
        <a
          key={match.index}
          href={`/#${anchor}`}
          onClick={(e) => {
            e.preventDefault()
            onAction?.()
            const el = document.getElementById(anchor)
            if (el) {
              el.scrollIntoView({ behavior: "smooth" })
              if (window.location.hash !== `#${anchor}`) {
                window.history.pushState(null, "", `#${anchor}`)
              }
            }
          }}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer"
        >
          {label}
        </a>
      )
    } else if (href.includes("track")) {
      elements.push(
        <button
          key={match.index}
          type="button"
          onClick={() => {
            onAction?.()
            window.dispatchEvent(new CustomEvent("tac-track-open"))
          }}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer"
        >
          {label}
        </button>
      )
    } else {
      elements.push(
        <Link
          key={match.index}
          href={href}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          {label}
        </Link>
      )
    }
    lastIndex = linkRegex.lastIndex
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex))
  }

  return elements.length > 0 ? elements : text
}

function FormattedMessage({ text, onAction }: { text: string; onAction?: () => void }) {
  if (!text.includes("```")) {
    return (
      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap font-sans">
        {renderInlineText(text, onAction)}
      </p>
    )
  }

  const parts = text.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-2 text-sm leading-relaxed break-words font-sans">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const content = part.slice(3, -3)
          const firstLineEnd = content.indexOf("\n")
          let lang = "text"
          let code = content

          if (firstLineEnd !== -1) {
            const rawLang = content.slice(0, firstLineEnd).trim()
            if (rawLang && !rawLang.includes(" ")) {
              lang = rawLang
              code = content.slice(firstLineEnd + 1)
            }
          }

          return (
            <CodeSnippet
              key={index}
              code={code.replace(/\n$/, "")}
              language={lang}
            />
          )
        }

        if (!part) return null

        return (
          <p key={index} className="whitespace-pre-wrap">
            {renderInlineText(part, onAction)}
          </p>
        )
      })}
    </div>
  )
}

function MessageCopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback ignore
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={handleCopy}
      className="size-6 rounded-none text-muted-foreground hover:bg-muted hover:text-foreground"
      aria-label={copied ? "Copied to clipboard" : "Copy response text"}
      title={copied ? "Copied" : "Copy response"}
    >
      {copied ? (
        <Check className="size-3 text-success" />
      ) : (
        <Copy className="size-3" />
      )}
    </Button>
  )
}

export default function SupportConversation({
  onDismiss,
}: {
  onDismiss?: () => void
} = {}) {
  const shouldReduceMotion = useReducedMotion()
  const { messages, sendMessage, status, error, stop, regenerate, setMessages } = useChat({ transport })
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [inputQuery, setInputQuery] = useState("")
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const busy = status === "submitted" || status === "streaming"

  const handleOpenTracking = () => {
    onDismiss?.()
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("tac-track-open"))
    }
  }

  const handleOpenContact = (e: React.MouseEvent) => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      e.preventDefault()
      onDismiss?.()
      contactSection.scrollIntoView({
        behavior: shouldReduceMotion ? "instant" : "smooth",
      })
      if (window.location.hash !== "#contact") {
        window.history.pushState(null, "", "#contact")
      }
    }
  }

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({
      block: "nearest",
      behavior: smooth && !shouldReduceMotion ? "smooth" : "auto",
    })
  }, [shouldReduceMotion])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => () => { void stop() }, [stop])

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBottom(distanceToBottom > 100)
  }

  const handlePromptSelect = async (prompt: string) => {
    if (busy) return
    await sendMessage({ text: prompt })
  }

  const handleReset = () => {
    setMessages([])
  }

  const handleInputSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = inputQuery.trim()
    if (!trimmed || busy) return
    setInputQuery("")
    await sendMessage({ text: trimmed })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleInputSubmit()
    }
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-card">
      {/* Messages Scroll Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-label="Assistant conversation"
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5"
      >
        {/* Zero-Messages Welcome & Quick Prompt Hub */}
        {!messages.length && (
          <div className="flex flex-col gap-4 py-1">
            <div className="border border-border/80 bg-muted/20 p-4 rounded-none">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  TAC-XPRESS • OPERATIONS DESK
                </span>
              </div>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                How can we assist your consignment today?
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Direct answers for bilateral freight rates, departure schedules, packaging protocols, and gate custody milestones.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenTracking}
                  className="inline-flex items-center gap-1.5 border border-border/80 bg-background hover:bg-muted px-2.5 py-1 font-mono text-[11px] font-medium text-foreground transition-colors rounded-none cursor-pointer"
                >
                  <Package className="size-3 text-primary" />
                  Track Live Shipment
                </button>
                <Link
                  href="/#contact"
                  onClick={handleOpenContact}
                  className="inline-flex items-center gap-1.5 border border-border/80 bg-background hover:bg-muted px-2.5 py-1 font-mono text-[11px] font-medium text-foreground transition-colors rounded-none cursor-pointer"
                >
                  <Phone className="size-3 text-muted-foreground" />
                  Hub Contact
                </Link>
              </div>
            </div>

            {/* Quick Prompt Cards - Vertical Stack */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                FREQUENT OPERATIONS INQUIRIES
              </span>
              {QUICK_PROMPTS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handlePromptSelect(item.prompt)}
                    disabled={busy}
                    className="group flex items-start gap-3 p-3 border border-border/80 bg-background hover:bg-muted/40 hover:border-primary/50 text-left transition-colors rounded-none cursor-pointer disabled:opacity-50"
                  >
                    <div className="size-8 shrink-0 flex items-center justify-center border border-border/80 bg-muted/40 text-primary group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                      <Icon className="size-4 shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Message Turns */}
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const textParts = message.parts.filter((p) => p.type === "text")
            const reasoningParts = message.parts.filter((p) => p.type === "reasoning")
            const fullContent = textParts.map((t) => t.text).join("\n")

            return (
              <motion.div
                key={message.id}
                variants={bubblePopVariant}
                initial={shouldReduceMotion ? false : "hidden"}
                animate="visible"
                exit="exit"
                className={
                  message.role === "user"
                    ? "self-end max-w-[85%] rounded-none border border-border/70 bg-secondary/80 p-3.5 text-foreground"
                    : "self-start w-full max-w-[95%] py-1.5 flex flex-col gap-1.5"
                }
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {message.role === "user" ? "You" : "Operations AI"}
                  </span>
                  {message.role !== "user" && fullContent && (
                    <MessageCopyButton content={fullContent} />
                  )}
                </div>

                {reasoningParts.map((part, idx) => (
                  <TraceCollapsible key={idx} className="mb-2 w-full rounded-none">
                    <TraceCollapsibleTrigger className="rounded-none text-xs">
                      <TraceLine status={part.state === "streaming" ? "running" : undefined}>
                        <TraceTitle className="font-mono text-xs text-muted-foreground">
                          Reasoning trace
                        </TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent className="rounded-none border-l border-border pl-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      {part.text}
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                ))}

                {textParts.map((part, idx) => (
                  <FormattedMessage key={idx} text={part.text} onAction={onDismiss} />
                ))}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {status === "submitted" && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-1 self-start"
          >
            <Trace>
              <TraceLine status="running">
                <TraceTitle className="font-mono text-xs text-muted-foreground">
                  Consulting corridor dispatch telemetry…
                </TraceTitle>
              </TraceLine>
            </Trace>
          </motion.div>
        )}

        {error && (
          <div role="alert" className="flex flex-col gap-3 border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive rounded-none">
            <p>
              The assistant couldn&rsquo;t reply. Try again shortly or{" "}
              <Link href="/#contact" onClick={handleOpenContact} className="underline font-medium cursor-pointer">
                contact our team
              </Link>
              .
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit rounded-none border-destructive/40 text-destructive hover:bg-destructive/10"
              disabled={busy}
              onClick={() => { void regenerate() }}
            >
              Retry reply
            </Button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Floating Jump to Latest Scroller */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 border border-border/80 bg-background/95 px-3 py-1 font-mono text-[11px] font-semibold text-foreground shadow-md backdrop-blur-xs transition-colors hover:border-primary hover:text-primary rounded-none cursor-pointer"
        >
          <ArrowDown className="size-3" />
          <span>Jump to latest</span>
        </button>
      )}

      {/* Input Tray & Industrial Form */}
      <div className="border-t border-border/80 bg-muted/10 p-3 sm:p-4">
        {busy ? (
          <div className="flex items-center justify-between px-2 py-2">
            <Trace className="w-auto">
              <TraceLine status="running">
                <TraceTitle className="font-mono text-xs text-muted-foreground">
                  Assistant is responding…
                </TraceTitle>
              </TraceLine>
            </Trace>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="rounded-none text-xs"
              onClick={() => stop()}
            >
              Stop
            </Button>
          </div>
        ) : (
          <form onSubmit={handleInputSubmit} className="flex flex-col gap-2">
            {messages.length > 0 && (
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
                <span className="font-mono text-[10px]">DEL ⇄ IMF Active Session</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                  title="Clear conversation history"
                >
                  <RotateCcw className="size-3" />
                  <span>Clear history</span>
                </button>
              </div>
            )}

            <div className="border border-border/80 bg-background focus-within:border-primary transition-colors">
              <textarea
                ref={textareaRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about corridor rates, transit SLA, or packaging…"
                rows={2}
                maxLength={1000}
                className="w-full resize-none bg-transparent p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                aria-label="Your question"
              />
              <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-2.5 py-1.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <span className="size-1.5 rounded-none bg-success" aria-hidden="true" />
                  <span>DEL ⇄ IMF Operations</span>
                </div>
                <Button
                  type="submit"
                  size="xs"
                  disabled={!inputQuery.trim() || busy}
                  aria-label="Send question"
                  className="h-7 rounded-none px-3 font-mono text-[11px] font-semibold tracking-tight cursor-pointer"
                >
                  <span>Ask</span>
                  <CornerDownLeft className="size-3 ml-1" />
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
