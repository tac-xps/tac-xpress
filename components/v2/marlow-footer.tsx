"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Loader2 } from "lucide-react"

interface DispatchIssue {
  number: string
  title: string
  date: string
  readTime: string
  isLatest?: boolean
  href: string
}

const RECENT_ISSUES: DispatchIssue[] = [
  {
    number: "48",
    title: "Zero-delay cold chain transit across Delhi ⇄ Imphal",
    date: "Oct 9",
    readTime: "5 min",
    isLatest: true,
    href: "/v2#writing",
  },
  {
    number: "47",
    title: "Calibrating dimensional weight vs actual weight pricing",
    date: "Sep 25",
    readTime: "7 min",
    href: "/v2#writing",
  },
  {
    number: "46",
    title: "42 Hubs, 12,000 PIN codes: Our network expansion strategy",
    date: "Sep 11",
    readTime: "6 min",
    href: "/v2#writing",
  },
  {
    number: "45",
    title: "IATA-compliant air cargo handling under adverse weather",
    date: "Aug 28",
    readTime: "4 min",
    href: "/v2#writing",
  },
]

export function MarlowFooter() {
  const [email, setEmail] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [subscribed, setSubscribed] = React.useState(false)
  const [istTime, setIstTime] = React.useState("01:45 IST")
  const [lisbonTime, setLisbonTime] = React.useState("21:15 UTC")

  React.useEffect(() => {
    const updateTime = () => {
      try {
        const ist = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
        setIstTime(`${ist} IST`)

        const utc = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Lisbon",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
        setLisbonTime(`${utc} UTC`)
      } catch {
      }
    }
    updateTime()
    const interval = setInterval(updateTime, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubscribed(true)
    }, 600)
  }

  return (
    <footer className="w-full border-t border-[rgba(20,20,19,0.08)] bg-[#FAFAF8] text-[#141413]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 py-14 lg:py-18">
          <section aria-labelledby="dispatch-title" className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#141413]/50">
                The Corridor Dispatch
              </p>
              <h2
                id="dispatch-title"
                className="mt-2 font-serif text-2xl sm:text-3xl lg:text-[28px] font-normal leading-[1.18] tracking-tight text-[#141413]"
              >
                Notes on high-altitude linehauls, cold chain, and freight SLAs every other Thursday.
              </h2>
              <p className="mt-3 text-sm text-[#141413]/60 leading-relaxed font-sans">
                Read by <span className="font-mono font-medium text-[#141413] tabular-nums">4,182</span> logistics directors and fleet dispatchers across India. Zero spam, one click to leave.
              </p>
            </div>

            <div className="mt-8">
              {subscribed ? (
                <div className="flex items-center gap-2 p-3.5 rounded-none bg-[#1F9A55]/10 border border-[#1F9A55]/20 text-[#1F9A55] text-xs font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>You&apos;re subscribed to The Corridor Dispatch. Check your inbox for Issue 48.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="h-10 min-w-0 flex-1 rounded-none border border-[rgba(20,20,19,0.12)] bg-white px-3.5 text-sm outline-none transition-colors duration-150 placeholder:text-[#141413]/40 focus:border-[#141413] text-[#141413]"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-none bg-[#141413] px-5 font-medium text-xs text-[#FAFAF8] transition-colors duration-150 hover:bg-[#141413]/85 disabled:opacity-50 shadow-xs"
                    >
                      {submitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Subscribe</span>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#141413]/40 font-mono mt-1">
                    Issue 49 lands Oct 28.
                  </p>
                </form>
              )}
            </div>
          </section>

          <section aria-labelledby="issues-title" className="lg:col-span-7">
            <div className="flex items-baseline justify-between mb-4">
              <h3 id="issues-title" className="font-medium text-xs font-mono uppercase tracking-wider text-[#141413]/50">
                Recent Dispatches
              </h3>
              <Link
                href="/v2#writing"
                className="text-xs text-[#141413]/60 hover:text-[#141413] transition-colors font-mono"
              >
                All 48 issues &rarr;
              </Link>
            </div>

            <ol className="border-t border-[rgba(20,20,19,0.08)] divide-y divide-[rgba(20,20,19,0.08)]">
              {RECENT_ISSUES.map((issue) => (
                <li key={issue.number}>
                  <Link
                    href={issue.href}
                    className="group -mx-3 grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-3 rounded-none px-3 py-3.5 transition-colors duration-150 hover:bg-[rgba(20,20,19,0.03)]"
                  >
                    <span className="font-mono text-xs tabular-nums text-[#141413]/40">
                      No. {issue.number}
                    </span>
                    <span className="min-w-0 text-sm font-sans text-[#141413] group-hover:text-[#2F6FE4] transition-colors">
                      {issue.title}
                      {issue.isLatest && (
                        <span className="ml-2 inline-flex h-4 items-center rounded-none border border-[rgba(20,20,19,0.12)] bg-white px-1.5 text-[9px] font-mono font-medium text-[#1F9A55] align-middle">
                          Latest
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-2 font-mono text-xs tabular-nums text-[#141413]/40">
                      <span className="hidden sm:inline">{issue.date} · {issue.readTime}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-40 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="border-t border-[rgba(20,20,19,0.08)] py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#141413]/70 font-medium">
              <li>
                <Link href="/v2" className="hover:text-[#141413] transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/v2#telemetry" className="hover:text-[#141413] transition-colors">
                  Telemetry
                </Link>
              </li>
              <li>
                <Link href="/v2#features" className="hover:text-[#141413] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/v2#pricing" className="hover:text-[#141413] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/v2/work" className="hover:text-[#141413] transition-colors">
                  Fleet & Network
                </Link>
              </li>
              <li>
                <Link href="/v2/about" className="hover:text-[#141413] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/v2/contact" className="hover:text-[#141413] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#141413]/50">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#1F9A55]/10 text-[#1F9A55] text-[11px] font-medium">
              <span className="w-1.5 h-1.5 bg-[#1F9A55]" />
              <span>42 Hubs Operational</span>
            </span>

            <span>·</span>

            <span>Delhi {istTime}</span>
            <span>·</span>
            <span>Lisbon {lisbonTime}</span>

            <span>·</span>

            <span>&copy; 2026 Tac-Xpress & Marlow</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
