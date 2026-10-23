"use client"

import React from "react"
import { useQueryState, parseAsString, parseAsInteger } from "nuqs"
import { MessageSquare, ThumbsUp, AlertCircle, Sparkles, TrendingUp } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { staggerContainer, staggerItem, microGestures } from "@/lib/animations"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export interface FeedbackMetricsProps {
  metrics: {
    total: number
    positive: number
    negative: number
    general: number
  }
}

export function FeedbackMetrics({ metrics }: FeedbackMetricsProps) {
  const shouldReduceMotion = useReducedMotion()
  const [filterSentiment, setFilterSentiment] = useQueryState(
    "sentiment",
    parseAsString
      .withDefault("all")
      .withOptions({ shallow: false, history: "push" })
  )
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger
      .withDefault(1)
      .withOptions({ shallow: false, history: "push" })
  )

  const handleSelect = (sentiment: "all" | "positive" | "negative" | "general") => {
    if (sentiment === "all") {
      void setFilterSentiment(null)
    } else {
      void setFilterSentiment(sentiment)
    }
    void setPage(1)
  }

  const positivePercent =
    metrics.total > 0
      ? Math.round((metrics.positive / metrics.total) * 100)
      : 100

  const attentionPercent =
    metrics.total > 0
      ? Math.round((metrics.negative / metrics.total) * 100)
      : 0

  const items = [
    {
      id: "all" as const,
      label: "Total Feedback",
      value: metrics.total,
      subtext: "All customer submissions",
      icon: MessageSquare,
      color: "text-primary",
      activeColor: "border-primary bg-primary/5 ring-1 ring-primary/20",
    },
    {
      id: "positive" as const,
      label: "Positive Sentiment",
      value: metrics.positive,
      subtext: `${positivePercent}% favorable rating`,
      icon: ThumbsUp,
      color: "text-success",
      activeColor: "border-success bg-success/5 ring-1 ring-success/20",
    },
    {
      id: "negative" as const,
      label: "Needs Attention",
      value: metrics.negative,
      subtext: `${attentionPercent}% operational flags`,
      icon: AlertCircle,
      color: "text-destructive",
      activeColor: "border-destructive bg-destructive/5 ring-1 ring-destructive/20",
    },
    {
      id: "general" as const,
      label: "General Inquiries",
      value: metrics.general,
      subtext: "Standard communications",
      icon: Sparkles,
      color: "text-info",
      activeColor: "border-info bg-info/5 ring-1 ring-info/20",
    },
  ]

  return (
    <section
      aria-label="Feedback Metrics & Quick Filters"
      className="overflow-hidden rounded-none border border-border/80 bg-card shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
          <TrendingUp className="size-3.5 text-primary" />
          Feedback Signal Telemetry
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/70">
          <span className="size-1.5 rounded-none bg-success" />
          Live Ingestion
        </span>
      </div>

      <motion.div
        variants={staggerContainer}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        className="grid grid-cols-2 gap-px bg-border/40 lg:grid-cols-4"
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive =
            (filterSentiment === "all" && item.id === "all") ||
            filterSentiment === item.id

          return (
            <motion.button
              key={item.id}
              type="button"
              variants={staggerItem}
              whileHover={shouldReduceMotion ? {} : microGestures.hoverLift}
              onClick={() => handleSelect(item.id)}
              className={`group flex flex-col items-start p-5 text-left transition-all ${
                isActive ? item.activeColor : "bg-card hover:bg-muted/30"
              }`}
            >
              <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <Icon className={`size-4 ${item.color} transition-transform group-hover:scale-110`} />
              </div>
              <div className="mt-2 font-mono text-2xl font-bold tabular-nums text-foreground">
                <AnimatedCounter value={item.value} />
              </div>
              <span className="mt-1 font-mono text-[11px] text-muted-foreground">
                {item.subtext}
              </span>
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}
