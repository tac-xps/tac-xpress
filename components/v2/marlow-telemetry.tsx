"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import BoardingPass, {
  type Flight,
  type BoardingPassLabels,
} from "@/components/kokonutui/boarding-pass"
import CurrencyTransfer, {
  type TransferAccount,
} from "@/components/kokonutui/currency-transfer"
import UptimeCard, {
  type UptimeService,
} from "@/components/kokonutui/uptime-card"
import { Package, ShieldCheck, Activity, Plane, ArrowRight } from "lucide-react"
import Link from "next/link"

const CARGO_FLIGHT: Flight = {
  airline: "TAC-XPRESS LOGISTICS",
  number: "TAC-804",
  from: {
    code: "DEL",
    city: "New Delhi",
    time: "08:30 IST",
  },
  to: {
    code: "IMF",
    city: "Imphal",
    time: "11:45 IST",
  },
  date: "Oct 24",
  gate: "GATE 03",
  boards: "08:00 IST",
  seat: "1,240 KG",
  group: "NFO-01",
  passenger: "PHARMA COLD-CHAIN (AP-904)",
  status: "boarding",
  note: "Commercial belly-hold secured · BCAS cleared",
}

const CARGO_LABELS: BoardingPassLabels = {
  field1: "Gate",
  field2: "Loading",
  field3: "Payload",
  field4: "Bay",
  footerLabel: "Consignee / Destination Station",
}

const FREIGHT_FROM: TransferAccount = {
  amount: 450,
  currency: "KG",
  symbol: "kg",
  bank: "Delhi IGI Terminal (Origin)",
  last4: "8042",
}

const FREIGHT_TO: TransferAccount = {
  amount: 18450,
  currency: "INR",
  symbol: "₹",
  bank: "Imphal Gateway (Tax Invoice)",
  last4: "9104",
  name: "GSTIN: 07AABCT2304M1Z2",
}

const HUB_SERVICES: UptimeService[] = [
  {
    name: "DEL: IGI Cargo Gateway",
    incidents: {},
  },
  {
    name: "BOM: Air Cargo Complex",
    incidents: {
      72: {
        title: "Scheduled apron maintenance",
        status: "degraded",
        minutes: 18,
        updates: [
          {
            time: "02:15",
            label: "Routine",
            note: "Gate scale 4 calibrated.",
          },
        ],
      },
    },
  },
  {
    name: "BLR: Kempegowda Logistics",
    incidents: {},
  },
  {
    name: "IMF: Tulihal Station",
    incidents: {
      34: {
        title: "Monsoon squall tarmac delay",
        status: "degraded",
        minutes: 22,
        updates: [
          {
            time: "14:10",
            label: "Weather Hold",
            note: "Aircraft hold cleared in 22 min.",
          },
        ],
      },
    },
  },
]

export function MarlowTelemetry() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="telemetry" className="px-6 max-w-6xl mx-auto py-20 border-t border-[rgba(20,20,19,0.08)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141413]/5 text-[#141413]/70 font-mono text-[11px] uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5 text-[#2F6FE4]" />
            <span>Living Corridor Telemetry</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#141413] leading-[1.12]">
            Precision freight <span className="italic">in active motion</span>
          </h2>
        </div>
        <p className="max-w-md text-sm text-[#141413]/70 leading-relaxed font-sans">
          Real-time airway manifests, pure STEM volumetric weight calculations, and 90-day gateway uptime reliability across India&apos;s primary air and surface corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-[#FAFAF8] border border-[rgba(20,20,19,0.08)] p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(20,20,19,0.06)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#141413] text-[#FAFAF8] flex items-center justify-center font-mono text-xs font-semibold">
                  <Plane className="w-4 h-4 text-[#FAFAF8]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#141413] font-sans">Airway Consignment Manifest</h3>
                  <p className="text-[11px] text-[#141413]/50 font-mono">Flight TAC-804 · Next Flight Out (NFO)</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1F9A55]/10 text-[#1F9A55] text-[11px] font-mono font-medium">
                <span className="w-1.5 h-1.5 bg-[#1F9A55] animate-pulse" />
                Live In-Flight
              </span>
            </div>

            <div className="overflow-x-auto pb-2">
              <BoardingPass
                flight={CARGO_FLIGHT}
                labels={CARGO_LABELS}
                className="mx-auto max-w-full shadow-none border-none bg-transparent"
              />
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#FAFAF8] border border-[rgba(20,20,19,0.08)] p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(20,20,19,0.06)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#2F6FE4]/10 text-[#2F6FE4] flex items-center justify-center font-mono text-xs font-semibold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#141413] font-sans">STEM Freight Estimator</h3>
                  <p className="text-[11px] text-[#141413]/50 font-mono">Volumetric (cm³/5000) · 18% GST Compliant</p>
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#141413]/60 bg-[#141413]/5 px-2.5 py-1">
                Surcharges Locked
              </span>
            </div>

            <CurrencyTransfer
              from={FREIGHT_FROM}
              to={FREIGHT_TO}
              rate={41}
              txnId="AWB-2026-TAC804-INVOICE"
              timestamp="10:45 IST"
              className="border-none shadow-none bg-transparent p-0"
            />
          </motion.div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-[#FAFAF8] border border-[rgba(20,20,19,0.08)] p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(20,20,19,0.06)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1F9A55]/10 text-[#1F9A55] flex items-center justify-center font-mono text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#141413] font-sans">Gateway Reliability</h3>
                  <p className="text-[11px] text-[#141413]/50 font-mono">90-Day SLA Uptime History</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#1F9A55]">
                99.8% Avg
              </span>
            </div>

            <UptimeCard
              title="Pan-India Hub SLA Status"
              services={HUB_SERVICES}
              days={90}
              className="border-none shadow-none bg-transparent p-0"
            />
          </motion.div>

          <div className="bg-[#141413] text-[#FAFAF8] p-7 sm:p-8 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="text-[11px] font-mono uppercase text-[#FAFAF8]/50 tracking-wider mb-2">
                Pan-India Network Standard
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-normal leading-tight text-[#FAFAF8] mb-4">
                42 Cargo Hubs. <span className="italic">Zero Blindspots.</span>
              </div>
              <p className="text-xs text-[#FAFAF8]/70 leading-relaxed font-sans">
                Every airway bill undergoes automated dimensional laser scanning and digital tare weigh-in before apron transfer.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/v2/contact"
                className="group inline-flex items-center gap-2 text-xs font-medium text-[#FAFAF8] hover:text-[#FAFAF8]/80 transition-colors"
              >
                <span>Request custom corridor route</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#2F6FE4]" />
              </Link>
              <span className="font-mono text-[11px] text-[#FAFAF8]/40">SLA 99.4%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
