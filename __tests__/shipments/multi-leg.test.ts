import { describe, it, expect, vi } from "vitest"

vi.mock("server-only", () => ({}))

import { calculateLegProgress } from "@/lib/shipments/legs"

describe("multi-leg shipment state modeling", () => {
  it("handles empty legs gracefully", () => {
    const progress = calculateLegProgress([])
    expect(progress).toEqual({
      totalLegs: 0,
      completedLegs: 0,
      activeLegNumber: null,
      isCompleted: false,
      progressPercent: 0,
      isFinalLegActive: false,
    })
  })

  it("calculates initial status when cargo starts leg 1", () => {
    const legs = [
      { legNumber: 1, status: "in_transit" },
      { legNumber: 2, status: "pending" },
      { legNumber: 3, status: "pending" },
    ]
    const progress = calculateLegProgress(legs)
    expect(progress.totalLegs).toBe(3)
    expect(progress.completedLegs).toBe(0)
    expect(progress.activeLegNumber).toBe(1)
    expect(progress.progressPercent).toBe(0)
    expect(progress.isCompleted).toBe(false)
    expect(progress.isFinalLegActive).toBe(false)
  })

  it("advances progress when intermediate hub leg completes", () => {
    const legs = [
      { legNumber: 1, status: "completed" },
      { legNumber: 2, status: "in_transit" },
      { legNumber: 3, status: "pending" },
    ]
    const progress = calculateLegProgress(legs)
    expect(progress.totalLegs).toBe(3)
    expect(progress.completedLegs).toBe(1)
    expect(progress.activeLegNumber).toBe(2)
    expect(progress.progressPercent).toBe(33)
    expect(progress.isCompleted).toBe(false)
    expect(progress.isFinalLegActive).toBe(false)
  })

  it("flags final leg as active when approaching destination hub", () => {
    const legs = [
      { legNumber: 1, status: "completed" },
      { legNumber: 2, status: "completed" },
      { legNumber: 3, status: "in_transit" },
    ]
    const progress = calculateLegProgress(legs)
    expect(progress.totalLegs).toBe(3)
    expect(progress.completedLegs).toBe(2)
    expect(progress.activeLegNumber).toBe(3)
    expect(progress.progressPercent).toBe(67)
    expect(progress.isCompleted).toBe(false)
    expect(progress.isFinalLegActive).toBe(true)
  })

  it("marks whole journey completed when all legs complete", () => {
    const legs = [
      { legNumber: 1, status: "completed" },
      { legNumber: 2, status: "completed" },
      { legNumber: 3, status: "completed" },
    ]
    const progress = calculateLegProgress(legs)
    expect(progress.totalLegs).toBe(3)
    expect(progress.completedLegs).toBe(3)
    expect(progress.activeLegNumber).toBeNull()
    expect(progress.progressPercent).toBe(100)
    expect(progress.isCompleted).toBe(true)
  })
})
