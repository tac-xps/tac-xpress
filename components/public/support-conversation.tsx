"use client"

import { useEffect, useRef } from "react"
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

function FormattedMessage({ text }: { text: string }) {
  if (!text.includes("```")) {
    return (
      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
        {text}
      </p>
    )
  }

  const parts = text.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-2 text-sm leading-relaxed break-words">
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
            {part}
          </p>
        )
      })}
    </div>
  )
}

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
          {messages.map((message) => {
            const textParts = message.parts.filter((p) => p.type === "text")
            const reasoningParts = message.parts.filter((p) => p.type === "reasoning")

            return (
              <motion.div
                key={message.id}
                variants={bubblePopVariant}
                initial={shouldReduceMotion ? false : "hidden"}
                animate="visible"
                exit="exit"
                className={
                  message.role === "user"
                    ? "rounded-none bg-secondary p-3.5 self-end max-w-[85%]"
                    : "py-1.5 self-start max-w-[90%] w-full"
                }
              >
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {message.role === "user" ? "You" : "AI assistant"}
                </p>

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
                  <FormattedMessage key={idx} text={part.text} />
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
                <TraceTitle className="font-mono text-xs">Preparing reply…</TraceTitle>
              </TraceLine>
            </Trace>
          </motion.div>
        )}

        {error && (
          <div role="alert" className="flex flex-col gap-3 text-sm text-destructive">
            The assistant couldn&rsquo;t reply. Try again shortly or{" "}
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
          <AIInputSearch
            placeholder="Ask about cargo, routes, or packaging…"
            tools={CARGO_TOOLS}
            defaultTool="support"
            models={["TAC Express AI"]}
            defaultModel="TAC Express AI"
            onSearch={async (query) => {
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

