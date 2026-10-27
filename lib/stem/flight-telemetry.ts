/**
 * Logistics STEM Engine: Deterministic IST Flight Telemetry
 *
 * Computes live operational progress for the Delhi (DEL) ⇄ Imphal (IMF)
 * air freight corridor based on Indian Standard Time (IST, UTC+05:30).
 *
 * Provides statutory zero-cost commercial compliance without external API licensing.
 * Complies with ASD-STE100 technical precision guidelines.
 */

export interface TelemetryStage {
  id: string
  label: string
  detail: string
  status: "running" | "done" | "error"
  progress?: number
  scheduledStart: string
  scheduledEnd: string
}

export interface CorridorTelemetryState {
  currentIstTime: string
  istMinuteOfDay: number
  phaseTitle: string
  activeFlightCode: string
  headlineStatus: string
  currentTask: TelemetryStage
  tasks: TelemetryStage[]
}

/**
 * Scheduled operational milestones for the DEL ⇄ IMF corridor in IST.
 * Times in minutes from midnight (00:00 IST).
 */
export const CORRIDOR_SCHEDULE = {
  // Morning Outbound: DEL → IMF
  OUTBOUND_GATE_START: 4 * 60 + 0, // 04:00 IST: BCAS Gate 4 cargo screening & manifest verification
  OUTBOUND_GATE_END: 6 * 60 + 15, // 06:15 IST: Gate scan complete, belly-hold sealed
  OUTBOUND_FLIGHT_START: 6 * 60 + 15, // 06:15 IST: Flight 6E-6124 departure from DEL
  OUTBOUND_FLIGHT_END: 9 * 60 + 15, // 09:15 IST: Flight 6E-6124 landing at IMF (3h direct flight)

  // Midday Hub Deconsolidation & Return Consolidation: IMF
  HUB_DECONSOLIDATION_START: 9 * 60 + 15, // 09:15 IST: Tulihal apron handover & deconsolidation
  HUB_DECONSOLIDATION_END: 12 * 60 + 0, // 12:00 IST: Consignee dispatch & return cargo loading

  // Afternoon Inbound: IMF → DEL
  INBOUND_FLIGHT_START: 13 * 60 + 45, // 13:45 IST: Flight AI-889 departure from IMF
  INBOUND_FLIGHT_END: 16 * 60 + 55, // 16:55 IST: Flight AI-889 landing at DEL

  // Evening Capital Distribution & Night Consolidation: DEL
  NIGHT_STAGING_START: 17 * 60 + 0, // 17:00 IST: Capital terminal clearance & night linehaul staging
  NIGHT_STAGING_END: 23 * 60 + 59, // 23:59 IST: Next-day manifest consolidation
} as const

/**
 * Converts any Date object to exact Indian Standard Time (UTC+05:30).
 * Returns hours, minutes, seconds, and total fractional minutes since midnight.
 */
export function getIstTimeComponents(date: Date = new Date()) {
  const istOffsetMillis = 5.5 * 60 * 60 * 1000
  const istDate = new Date(date.getTime() + istOffsetMillis)

  const hours = istDate.getUTCHours()
  const minutes = istDate.getUTCMinutes()
  const seconds = istDate.getUTCSeconds()
  const totalMinutes = hours * 60 + minutes + seconds / 60

  const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} IST`

  return {
    hours,
    minutes,
    seconds,
    totalMinutes,
    timeString,
    istDate,
  }
}

/**
 * Calculates deterministic linear progress between two minute boundaries.
 * Clamps result strictly to [0, 1].
 */
export function calculatePhaseProgress(
  currentMinute: number,
  startMinute: number,
  endMinute: number
): number {
  if (currentMinute <= startMinute) return 0
  if (currentMinute >= endMinute) return 1
  return Math.min(1, Math.max(0, (currentMinute - startMinute) / (endMinute - startMinute)))
}

/**
 * Computes live operational telemetry state for the DEL ⇄ IMF corridor.
 */
export function computeCorridorTelemetry(date: Date = new Date()): CorridorTelemetryState {
  const { totalMinutes, timeString } = getIstTimeComponents(date)

  // 1. Delhi Gateway Gate 4 Clearance
  let gateStatus: "running" | "done" = "done"
  let gateProgress: number | undefined

  if (totalMinutes < CORRIDOR_SCHEDULE.OUTBOUND_GATE_START) {
    // Overnight: Queued for dawn screening
    gateStatus = "running"
    gateProgress = 0
  } else if (totalMinutes < CORRIDOR_SCHEDULE.OUTBOUND_GATE_END) {
    // Active dawn screening
    gateStatus = "running"
    gateProgress = calculatePhaseProgress(
      totalMinutes,
      CORRIDOR_SCHEDULE.OUTBOUND_GATE_START,
      CORRIDOR_SCHEDULE.OUTBOUND_GATE_END
    )
  } else {
    gateStatus = "done"
  }

  // 2. DEL → IMF Flight 6E-6124 (Direct Air Linehaul)
  let outboundStatus: "running" | "done" = "done"
  let outboundProgress: number | undefined

  if (totalMinutes < CORRIDOR_SCHEDULE.OUTBOUND_FLIGHT_START) {
    outboundStatus = "running"
    outboundProgress = 0
  } else if (totalMinutes < CORRIDOR_SCHEDULE.OUTBOUND_FLIGHT_END) {
    outboundStatus = "running"
    outboundProgress = calculatePhaseProgress(
      totalMinutes,
      CORRIDOR_SCHEDULE.OUTBOUND_FLIGHT_START,
      CORRIDOR_SCHEDULE.OUTBOUND_FLIGHT_END
    )
  } else {
    outboundStatus = "done"
  }

  // 3. Imphal Tulihal Hub Inbound & Deconsolidation
  let hubStatus: "running" | "done" = "done"
  let hubProgress: number | undefined

  if (totalMinutes < CORRIDOR_SCHEDULE.HUB_DECONSOLIDATION_START) {
    hubStatus = "running"
    hubProgress = 0
  } else if (totalMinutes < CORRIDOR_SCHEDULE.HUB_DECONSOLIDATION_END) {
    hubStatus = "running"
    hubProgress = calculatePhaseProgress(
      totalMinutes,
      CORRIDOR_SCHEDULE.HUB_DECONSOLIDATION_START,
      CORRIDOR_SCHEDULE.HUB_DECONSOLIDATION_END
    )
  } else {
    hubStatus = "done"
  }

  // 4. IMF → DEL Flight AI-889 (Capital Return Belly-Hold)
  let inboundStatus: "running" | "done" = "done"
  let inboundProgress: number | undefined

  if (totalMinutes < CORRIDOR_SCHEDULE.INBOUND_FLIGHT_START) {
    inboundStatus = "running"
    inboundProgress = totalMinutes > CORRIDOR_SCHEDULE.HUB_DECONSOLIDATION_END ? 0.15 : 0
  } else if (totalMinutes < CORRIDOR_SCHEDULE.INBOUND_FLIGHT_END) {
    inboundStatus = "running"
    inboundProgress = calculatePhaseProgress(
      totalMinutes,
      CORRIDOR_SCHEDULE.INBOUND_FLIGHT_START,
      CORRIDOR_SCHEDULE.INBOUND_FLIGHT_END
    )
  } else {
    inboundStatus = "done"
  }

  // Determine current active corridor phase
  let phaseTitle = "Capital Staging Active"
  let activeFlightCode = "6E-6124"
  let headlineStatus = "DEL ⇄ IMF Telemetry"

  if (totalMinutes >= CORRIDOR_SCHEDULE.OUTBOUND_FLIGHT_START && totalMinutes < CORRIDOR_SCHEDULE.OUTBOUND_FLIGHT_END) {
    phaseTitle = "Air Linehaul: DEL → IMF In Flight"
    activeFlightCode = "6E-6124"
    headlineStatus = `DEL → IMF 6E-6124 Airborne (${Math.round((outboundProgress ?? 0) * 100)}%)`
  } else if (totalMinutes >= CORRIDOR_SCHEDULE.HUB_DECONSOLIDATION_START && totalMinutes < CORRIDOR_SCHEDULE.HUB_DECONSOLIDATION_END) {
    phaseTitle = "Tulihal Apron Deconsolidation"
    activeFlightCode = "IMF-HUB"
    headlineStatus = `Imphal Tulihal Sorting (${Math.round((hubProgress ?? 0) * 100)}%)`
  } else if (totalMinutes >= CORRIDOR_SCHEDULE.INBOUND_FLIGHT_START && totalMinutes < CORRIDOR_SCHEDULE.INBOUND_FLIGHT_END) {
    phaseTitle = "Air Linehaul: IMF → DEL Return In Flight"
    activeFlightCode = "AI-889"
    headlineStatus = `IMF → DEL AI-889 Airborne (${Math.round((inboundProgress ?? 0) * 100)}%)`
  } else if (totalMinutes >= CORRIDOR_SCHEDULE.OUTBOUND_GATE_START && totalMinutes < CORRIDOR_SCHEDULE.OUTBOUND_FLIGHT_START) {
    phaseTitle = "BCAS Security Gate Clearance"
    activeFlightCode = "DEL-GATE4"
    headlineStatus = "DEL IGI Gate 4 Verification"
  }

  const tasks: TelemetryStage[] = [
    {
      id: "del-gateway",
      label: "Delhi IGI Cargo Gateway (DEL)",
      detail:
        gateStatus === "running"
          ? "BCAS Gate 4 scan & X-ray palletizing active"
          : "BCAS Gate 4 security clear & manifest sealed",
      status: gateStatus,
      progress: gateProgress,
      scheduledStart: "04:00 IST",
      scheduledEnd: "06:15 IST",
    },
    {
      id: "flight-del-imf",
      label: "DEL → IMF Flight 6E-6124",
      detail:
        outboundStatus === "running"
          ? totalMinutes < CORRIDOR_SCHEDULE.OUTBOUND_FLIGHT_START
            ? "Air belly-hold space secured, boarding active"
            : "Commercial belly-hold en route in flight"
          : "Tulihal runway touchdown & apron handover",
      status: outboundStatus,
      progress: outboundProgress,
      scheduledStart: "06:15 IST",
      scheduledEnd: "09:15 IST",
    },
    {
      id: "imf-hub",
      label: "Imphal Tulihal Hub (IMF)",
      detail:
        hubStatus === "running"
          ? totalMinutes < CORRIDOR_SCHEDULE.HUB_DECONSOLIDATION_START
            ? "Inbound sorting bay prepared"
            : "Consignee deconsolidation & dispatch active"
          : "Consignee handover complete & outbound loaded",
      status: hubStatus,
      progress: hubProgress,
      scheduledStart: "09:15 IST",
      scheduledEnd: "12:00 IST",
    },
    {
      id: "flight-imf-del",
      label: "IMF → DEL Flight AI-889",
      detail:
        inboundStatus === "running"
          ? totalMinutes < CORRIDOR_SCHEDULE.INBOUND_FLIGHT_START
            ? "Capital return cargo manifest verified"
            : "Capital return belly-hold en route in flight"
          : "Delhi IGI cargo arrival & dock clear",
      status: inboundStatus,
      progress: inboundProgress,
      scheduledStart: "13:45 IST",
      scheduledEnd: "16:55 IST",
    },
  ]

  // Select the single most relevant task for the collapsed HUD pill
  // Priority: in-flight leg -> active hub/gate -> last running -> latest completed
  let currentTask = tasks.find(
    (t) =>
      t.status === "running" &&
      typeof t.progress === "number" &&
      t.progress > 0 &&
      t.progress < 1
  )

  if (!currentTask) {
    currentTask = tasks.find((t) => t.status === "running") ?? tasks[tasks.length - 1]
  }

  return {
    currentIstTime: timeString,
    istMinuteOfDay: totalMinutes,
    phaseTitle,
    activeFlightCode,
    headlineStatus,
    currentTask,
    tasks,
  }
}
