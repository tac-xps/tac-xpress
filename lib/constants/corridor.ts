/**
 * Tac-Xpress Corridor Canonical Truth
 *
 * Exclusively defines the bilateral New Delhi (DEL) ⇄ Imphal (IMF) operational metrics.
 * Serves as the single source of truth across public landing, tariff calculators, and telemetry.
 *
 * Invariants:
 * - Operating corridor: DEL ⇄ IMF strictly.
 * - Distance: 2,410 km arterial highway / 1,720 km aerial track.
 * - Historic On-Time SLA: 99.4%.
 * - Air Transit SLA: 24 Hours.
 * - Surface Transit SLA: 4 to 5 Days.
 */

export const CORRIDOR_ORIGIN = {
  code: "DEL",
  name: "New Delhi",
  hub: "Indira Gandhi International Airport",
  gate: "Terminal 4 / Air Cargo Gate 4",
} as const

export const CORRIDOR_DESTINATION = {
  code: "IMF",
  name: "Imphal",
  hub: "Bir Tikendrajit International Airport",
  gate: "Tulihal Domestic Apron / Regional Cross-Dock",
} as const

export const CORRIDOR_METRICS = {
  /** Official highway odometer distance via NH27 / NH29 arterial linehaul. */
  roadDistanceKm: 2410,
  /** Great circle aerial distance between IGI and Tulihal. */
  airDistanceKm: 1720,
  /** 12-month verified on-time departure and arrival SLA rate. */
  onTimeSlaPercentage: 99.4,
  /** Verified continuous corridor operating tenure. */
  experienceYears: 15,
} as const

export const CORRIDOR_SERVICES = {
  air: {
    id: "air" as const,
    name: "Air Express Cargo",
    tagline: "Commercial belly-hold capacity allocated daily across scheduled flights.",
    ratePaisePerKg: 12500, // ₹125/kg
    rateFormatted: "₹125",
    unit: "/ kg + 18% GST",
    minWeightKg: 5,
    minimumChargePaise: 62500, // ₹625.00 base min
    sla: "24 Hours SLA",
    slaShort: "24h air",
    bestFor: "High-value electronics, pharmaceuticals, and urgent commercial cargo",
    features: [
      "Guaranteed commercial flight departure",
      "Direct airside custody and BCAS security screening",
      "Real-time GPS and gate milestone tracking",
      "Statutory 18% GST tax invoice breakdown",
    ],
  },
  surface: {
    id: "surface" as const,
    name: "Surface Linehaul",
    tagline: "Dedicated multi-ton sealed arterial trucks traversing the 2,410 km highway corridor.",
    ratePaisePerKg: 5800, // ₹58/kg
    rateFormatted: "₹58",
    unit: "/ kg + 18% GST",
    minWeightKg: 20,
    minimumChargePaise: 116000, // ₹1,160.00 base min
    sla: "4 to 5 Days SLA",
    slaShort: "4 to 5d road",
    bestFor: "Heavy machinery, bulk inventory, hardware, and consolidated merchandise",
    features: [
      "Dedicated multi-ton sealed arterial trucks",
      "Continuous GPS tracking and digital tamper seals",
      "Zero intermediate transshipment hubs",
      "Scheduled bi-weekly convoys DEL ⇄ IMF",
    ],
  },
  charter: {
    id: "charter" as const,
    name: "Dedicated Charter",
    tagline: "Full-aircraft charter or dedicated multi-axle vehicle for single-consignor freight.",
    ratePaisePerKg: 0, // Custom contract rate
    rateFormatted: "Custom",
    unit: "Tonnage quote",
    minWeightKg: 500,
    minimumChargePaise: 0,
    sla: "Priority Dispatch",
    slaShort: "Immediate",
    bestFor: "Critical project cargo, humanitarian logistics, and oversized single-consignor shipments",
    features: [
      "Exclusive vehicle or dedicated air charter capacity",
      "Dedicated operations supervisor escort",
      "Priority ramp and runway access",
      "Custom SLA and direct delivery protocol",
    ],
  },
} as const

export const CORRIDOR_COPY = {
  brandName: "TAC-XPRESS",
  headline: "Delhi to Imphal. Without the detour.",
  subhead: "Dedicated commercial air and surface freight linehaul connecting New Delhi and Imphal with verified custody and itemized statutory billing.",
  routeBadge: "DEL ⇄ IMF · Exclusive Bilateral Corridor",
  routeVector: "DEL ⇄ IMF",
} as const

