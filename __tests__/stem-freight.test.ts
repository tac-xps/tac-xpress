import { describe, expect, it } from "vitest"
import {
  calculateAirVolumetricWeight,
  calculateSurfaceVolumetricWeight,
  calculateChargedWeight,
  calculateFreightPricing,
  calculateGstPaise,
  calculateWeightVariance,
  calculateSlaBreachRisk,
  AIR_VOLUMETRIC_DIVISOR,
  SURFACE_VOLUMETRIC_DIVISOR,
} from "@/lib/stem/freight"

describe("Logistics STEM Engine - Dimensional & Volumetric Formulas", () => {
  it("computes IATA air volumetric weight correctly with ceiling precision", () => {
    // 50 x 40 x 30 cm = 60,000 cm³ / 5000 = 12 kg
    const weight = calculateAirVolumetricWeight(50, 40, 30)
    expect(weight).toBe(12)

    // Fractional volume rounds up: 51 x 40 x 30 = 61,200 / 5000 = 12.24 -> 13 kg
    const roundedUp = calculateAirVolumetricWeight(51, 40, 30)
    expect(roundedUp).toBe(13)
  })

  it("handles multi-piece consignments in air volumetric calculation", () => {
    // 5 packages of 40 x 30 x 20 cm = 5 x 24,000 = 120,000 / 5000 = 24 kg
    const weight = calculateAirVolumetricWeight(40, 30, 20, 5)
    expect(weight).toBe(24)
  })

  it("computes surface road volumetric weight with 4500 divisor", () => {
    // 60 x 50 x 45 cm = 135,000 cm³ / 4500 = 30 kg
    const weight = calculateSurfaceVolumetricWeight(60, 50, 45)
    expect(weight).toBe(30)
  })

  it("returns zero for zero or negative dimensions safely", () => {
    expect(calculateAirVolumetricWeight(0, 50, 50)).toBe(0)
    expect(calculateSurfaceVolumetricWeight(-10, 50, 50)).toBe(0)
  })

  it("determines billable charged weight by taking mathematical maximum", () => {
    // Actual 15kg > Volumetric 12kg -> 15kg
    expect(calculateChargedWeight(15, 12)).toBe(15)

    // Volumetric 25kg > Actual 10kg -> 25kg
    expect(calculateChargedWeight(10, 25)).toBe(25)

    // Identical
    expect(calculateChargedWeight(20, 20)).toBe(20)
  })
})

describe("Logistics STEM Engine - Pricing & Tax Mathematics", () => {
  it("calculates commercial base freight with fuel surcharge in integer paise", () => {
    const pricing = calculateFreightPricing({
      chargedWeightKg: 20,
      ratePerKgPaise: 15000, // ₹150.00 / kg
      minimumChargePaise: 50000, // ₹500.00 min
      fuelSurchargePercent: 12.5, // 12.5% FSC
      docketFeePaise: 15000, // ₹150 docket
      handlingFeePaise: 5000, // ₹50 handling
    })

    // Base: 20 * 15,000 = 300,000 paise (₹3,000.00)
    expect(pricing.baseFreightPaise).toBe(300000)

    // FSC: 300,000 * 0.125 = 37,500 paise (₹375.00)
    expect(pricing.fuelSurchargePaise).toBe(37500)

    // Subtotal: 300,000 + 37,500 + 15,000 + 5,000 = 357,500 paise (₹3,575.00)
    expect(pricing.subtotalTaxablePaise).toBe(357500)
  })

  it("enforces minimum corridor charge when calculated freight is lower", () => {
    const pricing = calculateFreightPricing({
      chargedWeightKg: 1,
      ratePerKgPaise: 10000, // ₹100.00
      minimumChargePaise: 50000, // ₹500.00 min charge
      fuelSurchargePercent: 10,
    })

    expect(pricing.baseFreightPaise).toBe(50000)
    expect(pricing.fuelSurchargePaise).toBe(5000)
    expect(pricing.subtotalTaxablePaise).toBe(55000)
  })

  it("splits intra-state GST 18% into CGST and SGST with zero rounding loss", () => {
    // ₹1,000.25 (100025 paise) @ 18% = 18004.5 -> 18005 paise total tax
    const gst = calculateGstPaise(100025, 18, false)

    expect(gst.totalTaxPaise).toBe(18005)
    // CGST: 9002, SGST: 9003 -> sum equals 18005
    expect(gst.cgstPaise + gst.sgstPaise).toBe(18005)
    expect(gst.cgstPaise).toBe(9002)
    expect(gst.sgstPaise).toBe(9003)
    expect(gst.igstPaise).toBe(0)
    expect(gst.totalPaise).toBe(100025 + 18005)
  })

  it("assigns entire tax amount to IGST for inter-state cargo", () => {
    const gst = calculateGstPaise(200000, 18, true)

    expect(gst.totalTaxPaise).toBe(36000)
    expect(gst.cgstPaise).toBe(0)
    expect(gst.sgstPaise).toBe(0)
    expect(gst.igstPaise).toBe(36000)
    expect(gst.totalPaise).toBe(236000)
  })
})

describe("Logistics STEM Engine - Telemetry & SLA Guardrails", () => {
  it("flags scale weight variance exceeding 5.0% threshold", () => {
    // 100kg declared vs 103kg scale -> 3% variance (pass)
    const withinTolerance = calculateWeightVariance(103, 100)
    expect(withinTolerance.variancePercent).toBe(3)
    expect(withinTolerance.requiresInspection).toBe(false)

    // 100kg declared vs 106kg scale -> 6% variance (fail, requires inspection)
    const overTolerance = calculateWeightVariance(106, 100)
    expect(overTolerance.variancePercent).toBe(6)
    expect(overTolerance.requiresInspection).toBe(true)
  })

  it("scores SLA breach risk severity accurately", () => {
    // 50% elapsed on standard corridor (risk factor 1.0) -> normal
    const normal = calculateSlaBreachRisk(120, 240, 1.0)
    expect(normal.riskScore).toBe(0.5)
    expect(normal.severity).toBe("normal")

    // 75% elapsed on standard corridor -> at risk
    const atRisk = calculateSlaBreachRisk(180, 240, 1.0)
    expect(atRisk.riskScore).toBe(0.75)
    expect(atRisk.severity).toBe("at_risk")

    // 90% elapsed -> breached
    const breached = calculateSlaBreachRisk(216, 240, 1.0)
    expect(breached.riskScore).toBe(0.9)
    expect(breached.severity).toBe("breached")

    // Mountain corridor hazard (risk factor 1.3) pushes 60% elapsed into at-risk
    const hillHazard = calculateSlaBreachRisk(144, 240, 1.3)
    expect(hillHazard.riskScore).toBe(0.78)
    expect(hillHazard.severity).toBe("at_risk")
  })
})
