"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateFreightPricing, calculateGstPaise } from "@/lib/stem/freight"

export function CorridorTariffsSection() {
  const [mode, setMode] = useState<"air" | "surface">("air")
  const [weight, setWeight] = useState("30")
  const [rate, setRate] = useState("")
  const [fuel, setFuel] = useState("0")
  const shouldReduceMotion = useReducedMotion()
  const weightKg = Number(weight)
  const rateInr = Number(rate)
  const fuelPercent = Number(fuel)
  const valid =
    rate.trim() !== "" &&
    fuel.trim() !== "" &&
    Number.isFinite(weightKg) &&
    weightKg >= 0.01 &&
    weightKg <= 2000 &&
    Number.isFinite(rateInr) &&
    rateInr >= 0.01 &&
    rateInr <= 1000000 &&
    Number.isFinite(fuelPercent) &&
    fuelPercent >= 0 &&
    fuelPercent <= 100
  const pricing = valid
    ? calculateFreightPricing({
        chargedWeightKg: weightKg,
        ratePerKgPaise: Math.round(rateInr * 100),
        minimumChargePaise: 0,
        fuelSurchargePercent: fuelPercent,
      })
    : null
  const gst = pricing
    ? calculateGstPaise(pricing.subtotalTaxablePaise, 18, true)
    : null
  const formatInr = (paise: number) =>
    (paise / 100).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    })

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <h2
            id="pricing-heading"
            className="text-2xl font-medium tracking-tight sm:text-4xl"
          >
            Calculate using your quoted rate
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the chargeable weight, rate, and fuel surcharge from your
            quote. Confirm other charges with our team.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2" aria-label="Cargo mode">
              <Button
                type="button"
                variant={mode === "air" ? "default" : "outline"}
                aria-pressed={mode === "air"}
                onClick={() => setMode("air")}
                className="relative overflow-hidden"
              >
                {mode === "air" && (
                  <motion.div
                    layoutId="tariffModeIndicator"
                    className="absolute inset-0 bg-primary z-0 rounded-none"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", visualDuration: 0.25, bounce: 0 }
                    }
                  />
                )}
                <span className="relative z-10">Air cargo</span>
              </Button>
              <Button
                type="button"
                variant={mode === "surface" ? "default" : "outline"}
                aria-pressed={mode === "surface"}
                onClick={() => setMode("surface")}
                className="relative overflow-hidden"
              >
                {mode === "surface" && (
                  <motion.div
                    layoutId="tariffModeIndicator"
                    className="absolute inset-0 bg-primary z-0 rounded-none"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", visualDuration: 0.25, bounce: 0 }
                    }
                  />
                )}
                <span className="relative z-10">Surface cargo</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tariff-weight">Chargeable weight (kg)</Label>
              <Input
                id="tariff-weight"
                type="number"
                min="0.01"
                max="2000"
                step="0.01"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tariff-rate">Quoted rate (INR per kg)</Label>
              <Input
                id="tariff-rate"
                type="number"
                min="0.01"
                max="1000000"
                step="0.01"
                value={rate}
                onChange={(event) => setRate(event.target.value)}
                aria-describedby="tariff-guidance"
              />
              <p id="tariff-guidance" className="text-xs text-muted-foreground">
                Use the rate confirmed by our team for your shipment.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tariff-fuel">Quoted fuel surcharge (%)</Label>
              <Input
                id="tariff-fuel"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={fuel}
                onChange={(event) => setFuel(event.target.value)}
              />
            </div>
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="flex flex-col gap-2 border-t pt-4 text-sm"
            >
              {pricing && gst ? (
                <dl className="flex flex-col gap-2">
                  <div className="flex justify-between gap-2">
                    <dt>Base freight</dt>
                    <dd className="font-mono tabular-nums">
                      {formatInr(pricing.baseFreightPaise)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Fuel surcharge</dt>
                    <dd className="font-mono tabular-nums">
                      {formatInr(pricing.fuelSurchargePaise)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>GST (18%)</dt>
                    <dd className="font-mono tabular-nums">
                      {formatInr(gst.totalTaxPaise)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2 border-t pt-2 font-medium">
                    <dt>Calculated total</dt>
                    <dd className="font-mono tabular-nums">
                      {formatInr(gst.totalPaise)}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-muted-foreground">
                  Enter a positive quoted rate and weight to calculate. Use a
                  fuel surcharge from 0% to 100%.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 border bg-card p-6">
            <div className="relative aspect-[21/9] overflow-hidden border bg-muted">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={
                      mode === "air"
                        ? "/images/new-assets/tariff-air.png"
                        : "/images/new-assets/tariff-surface.png"
                    }
                    alt={`Illustration of ${mode} cargo`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <h3 className="text-lg font-medium">Request a confirmed quote</h3>
            <p className="text-sm text-muted-foreground">
              TAC-XPRESS serves New Delhi and Imphal in both directions. Share
              your shipment details to confirm the rate and delivery window.
            </p>
            <Button asChild>
              <Link href="#contact">Request a cargo quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
