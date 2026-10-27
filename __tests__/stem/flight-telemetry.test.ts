import { describe, it, expect } from "vitest"
import {
  getIstTimeComponents,
  calculatePhaseProgress,
  computeCorridorTelemetry,
  CORRIDOR_SCHEDULE,
} from "@/lib/stem/flight-telemetry"

describe("Logistics STEM Engine: IST Corridor Flight Telemetry", () => {
  it("converts UTC time to exact Indian Standard Time (UTC+05:30)", () => {
    // 00:00 UTC = 05:30 IST
    const dateUtc = new Date("2026-10-23T00:00:00.000Z")
    const ist = getIstTimeComponents(dateUtc)
    expect(ist.hours).toBe(5)
    expect(ist.minutes).toBe(30)
    expect(ist.seconds).toBe(0)
    expect(ist.totalMinutes).toBe(5 * 60 + 30)
    expect(ist.timeString).toBe("05:30:00 IST")
  })

  it("calculates phase progress accurately and clamps to [0, 1]", () => {
    // Before window
    expect(calculatePhaseProgress(100, 200, 300)).toBe(0)
    // At start
    expect(calculatePhaseProgress(200, 200, 300)).toBe(0)
    // Midpoint
    expect(calculatePhaseProgress(250, 200, 300)).toBe(0.5)
    // At end
    expect(calculatePhaseProgress(300, 200, 300)).toBe(1)
    // After window
    expect(calculatePhaseProgress(400, 200, 300)).toBe(1)
  })

  it("computes morning flight in-flight state (07:45 IST)", () => {
    // 07:45 IST is 02:15 UTC
    const morningFlight = new Date("2026-10-23T02:15:00.000Z")
    const telemetry = computeCorridorTelemetry(morningFlight)

    expect(telemetry.phaseTitle).toContain("DEL → IMF In Flight")
    expect(telemetry.activeFlightCode).toBe("6E-6124")

    const outboundFlight = telemetry.tasks.find((t) => t.id === "flight-del-imf")
    expect(outboundFlight?.status).toBe("running")
    expect(outboundFlight?.progress).toBeGreaterThan(0.4)
    expect(outboundFlight?.progress).toBeLessThan(0.6)

    // Current primary task shown on HUD is the airborne flight
    expect(telemetry.currentTask.id).toBe("flight-del-imf")
  })

  it("computes Tulihal hub deconsolidation state (10:30 IST)", () => {
    // 10:30 IST is 05:00 UTC
    const hubTime = new Date("2026-10-23T05:00:00.000Z")
    const telemetry = computeCorridorTelemetry(hubTime)

    expect(telemetry.phaseTitle).toContain("Tulihal")
    const hubTask = telemetry.tasks.find((t) => t.id === "imf-hub")
    expect(hubTask?.status).toBe("running")
    expect(hubTask?.progress).toBeGreaterThan(0.4)

    // Outbound flight has landed
    const outboundFlight = telemetry.tasks.find((t) => t.id === "flight-del-imf")
    expect(outboundFlight?.status).toBe("done")
  })

  it("computes afternoon return flight in-flight state (15:20 IST)", () => {
    // 15:20 IST is 09:50 UTC
    const returnFlightTime = new Date("2026-10-23T09:50:00.000Z")
    const telemetry = computeCorridorTelemetry(returnFlightTime)

    expect(telemetry.phaseTitle).toContain("IMF → DEL Return")
    expect(telemetry.activeFlightCode).toBe("AI-889")

    const returnTask = telemetry.tasks.find((t) => t.id === "flight-imf-del")
    expect(returnTask?.status).toBe("running")
    expect(returnTask?.progress).toBeGreaterThan(0.4)
    expect(returnTask?.progress).toBeLessThan(0.6)
    expect(telemetry.currentTask.id).toBe("flight-imf-del")
  })

  it("computes evening linehaul staging state (20:00 IST)", () => {
    // 20:00 IST is 14:30 UTC
    const eveningTime = new Date("2026-10-23T14:30:00.000Z")
    const telemetry = computeCorridorTelemetry(eveningTime)

    expect(telemetry.phaseTitle).toContain("Capital Staging")
    expect(telemetry.activeFlightCode).toBe("DEL-STAGE")
    const stagingTask = telemetry.tasks.find((t) => t.id === "del-staging")
    expect(stagingTask?.status).toBe("running")
    expect(stagingTask?.progress).toBeGreaterThan(0.4)
    expect(telemetry.currentTask.id).toBe("del-staging")
  })

  it("computes overnight staging state (02:00 IST)", () => {
    // 02:00 IST is 20:30 UTC previous day
    const nightTime = new Date("2026-10-22T20:30:00.000Z")
    const telemetry = computeCorridorTelemetry(nightTime)

    expect(telemetry.tasks).toHaveLength(5)
    expect(telemetry.currentIstTime).toBe("02:00:00 IST")
    const gateTask = telemetry.tasks.find((t) => t.id === "del-gateway")
    expect(gateTask?.status).toBe("running")
  })
})
