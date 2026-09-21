"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CheckCircle2, LayoutDashboard, Search, PackageCheck } from "lucide-react"
import { LogoMark } from "@/components/logo"
import { cn } from "@/lib/utils"

interface HeroBentoGridProps {
  className?: string
}

export function HeroBentoGrid({ className }: HeroBentoGridProps) {
  const [awb, setAwb] = useState("")

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6 w-full", className)}>
      {/* ── Left Bento Card: In-Transit & Pending Deliveries ───────────────── */}
      <div className="lg:col-span-6 relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900/90 via-black/85 to-black/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between group">
        {/* Ambient background glow & neon trajectory line */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -left-12 size-48 rounded-full bg-orange-600/20 blur-3xl pointer-events-none"
        />

        {/* Dynamic neon telemetry route wave */}
        <svg
          className="absolute right-0 top-1/4 w-3/4 h-32 opacity-40 pointer-events-none select-none"
          viewBox="0 0 400 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0 80C80 80 120 10 200 40S320 110 400 20"
            stroke="url(#orange-glow-line)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="orange-glow-line" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff5722" stopOpacity="0.1" />
              <stop offset="0.5" stopColor="#ff7043" />
              <stop offset="1" stopColor="#ff9800" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Top Bar: Title & Live Tracking Status Badge */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              In-Transit &amp; Pending Deliveries
            </h2>
            <p className="mt-1 text-xs text-zinc-400 font-mono">
              Live telemetry on all scheduled Northeast linehauls
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 font-mono text-xs text-emerald-400 backdrop-blur-md shrink-0">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>Tracking</span>
          </div>
        </div>

        {/* Middle Content: Overlapping Consignment Parcel & Schedule Notification Card */}
        <div className="relative z-10 my-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          {/* 3D Parcel Box Visual */}
          <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 shadow-xl group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/hero/hero-parcel.jpg"
              alt="Scheduled consignment parcel with fragile security seal"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>

          {/* Scheduled Delivery Notification Card */}
          <div className="flex-1 w-full rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-md text-zinc-200 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-sans text-xs font-bold text-white flex items-center gap-1.5">
                <PackageCheck className="size-3.5 text-orange-400" aria-hidden="true" />
                Scheduled Delivery
              </span>
              <span className="font-mono text-[10px] text-zinc-400">EST. TOMORROW</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              <strong className="text-white font-mono">Consignment #TAC-791</strong> is scheduled for priority morning delivery in Imphal. Please verify dispatch manifest at arrival.
            </p>
          </div>
        </div>

        {/* Bottom Interactive Strip: AWB Quick Track Form & Dashboard Access */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            action="/track"
            method="get"
            className="flex-1 flex items-center gap-2 rounded-xl bg-black/60 border border-white/20 px-3 py-1.5 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all"
          >
            <Search className="size-4 text-zinc-400 shrink-0" aria-hidden="true" />
            <label htmlFor="bento-awb-input" className="sr-only">
              Quick AWB Consignment Lookup
            </label>
            <input
              id="bento-awb-input"
              name="awb"
              type="text"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="AWB Number (e.g. TAC-791)..."
              className="w-full bg-transparent font-mono text-xs text-white placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Track consignment"
              className="rounded-lg bg-orange-600 hover:bg-orange-500 text-white px-2.5 py-1 text-[11px] font-sans font-semibold transition-colors shrink-0"
            >
              Track
            </button>
          </form>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 hover:border-white/30 transition-colors shrink-0"
          >
            <LayoutDashboard className="size-3.5 text-orange-400" aria-hidden="true" />
            <span>Open Dashboard</span>
          </Link>
        </div>
      </div>

      {/* ── Right Bento Card: Revolutionize Your Logistics ───────────────── */}
      <div className="lg:col-span-6 relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900/90 via-black/85 to-black/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between group">
        {/* Ambient warm gradient rim */}
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -right-12 size-52 rounded-full bg-orange-500/15 blur-3xl pointer-events-none"
        />

        {/* Card Header & Mega-Stat with Avatar Cluster */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Revolutionize Your Logistics
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Next-generation freight coordination for Northeast India
            </p>
          </div>

          {/* Massive Radiant Numeric Stat */}
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600">
              148k
            </span>
            <span className="font-sans text-xs uppercase tracking-wider text-orange-400 font-semibold">
              Consignments
            </span>
          </div>
        </div>

        {/* Middle Section: Authentic Handler Avatar Cluster */}
        <div className="relative z-10 my-6 flex items-center gap-4">
          <div className="flex items-center -space-x-3">
            {/* Courier Avatar 1 */}
            <div className="relative size-12 overflow-hidden rounded-full border-2 border-black bg-zinc-800 shadow-md">
              <Image
                src="/images/hero/hero-courier.jpg"
                alt="Northeast India cargo handler"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            {/* Central Orange Brand Logo Badge */}
            <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-2 border-black bg-orange-600 text-white shadow-lg">
              <LogoMark className="size-6 text-white" />
            </div>

            {/* Courier Avatar 2 */}
            <div className="relative size-12 overflow-hidden rounded-full border-2 border-black bg-zinc-800 shadow-md">
              <Image
                src="/images/hero/hero-driver.jpg"
                alt="Express transport linehaul driver"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <CheckCircle2 className="size-3.5 text-orange-400" aria-hidden="true" />
              <span>Verified Operations Fleet</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Dedicated ground &amp; air dispatchers
            </span>
          </div>
        </div>

        {/* Bottom Strategic Summary Paragraph & Action Arrow */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-end justify-between gap-6">
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 max-w-xl">
            Step into the future of logistics with our AI-driven platform. From demand forecasting to real-time shipment tracking, revolutionize every aspect of your supply chain across the capital-to-valley network.
          </p>

          <Link
            href="/services"
            aria-label="Explore TAC-XPRESS freight services"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-zinc-300 hover:text-white hover:bg-orange-600 hover:border-orange-500 transition-all duration-200"
          >
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
