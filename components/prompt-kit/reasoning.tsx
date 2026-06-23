"use client"
import * as React from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function Reasoning({
  children,
  isStreaming = false,
}: {
  children: React.ReactNode
  isStreaming?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="mt-2 flex w-full flex-col gap-2 rounded-md border border-border/40 bg-muted/30 p-3">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === ReasoningTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isOpen,
              isStreaming,
            })
          }
          return null
        })}
      </div>
      {isOpen && (
        <div className="animate-in duration-200 fade-in slide-in-from-top-2">
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement(child) &&
              child.type === ReasoningContent
            ) {
              return child
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}

export function ReasoningTrigger({
  children,
  isOpen,
  isStreaming,
}: {
  children: React.ReactNode
  isOpen?: boolean
  isStreaming?: boolean
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
      <Sparkles
        className={cn(
          "h-3.5 w-3.5",
          isStreaming && "animate-pulse text-status-pending"
        )}
      />
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "ml-auto h-3.5 w-3.5 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </div>
  )
}

export function ReasoningContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mt-2 font-mono text-xs leading-relaxed text-muted-foreground/80",
        className
      )}
    >
      {children}
    </div>
  )
}
