"use client";

/**
 * @author: @dorianbaffier
 * @description: Boarding Pass
 * @version: 1.0.0
 * @date: 2026-10-22
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Plane } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** Radius of the notches on either side of the tear line, in px. */
const NOTCH = 10;

export type FlightStatus =
  | "on-time"
  | "delayed"
  | "gate-change"
  | "boarding"
  | "in-transit"
  | "gate-scan"
  | "delivered";

export interface Flight {
  airline: string;
  number: string;
  from: { code: string; city: string; time: string };
  to: { code: string; city: string; time: string };
  date: string;
  gate: string;
  boards: string;
  seat: string;
  group: string;
  passenger: string;
  status: FlightStatus;
  /** One line under the status, like "Delayed 25 min". */
  note?: string;
}

export interface BoardingPassLabels {
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  footerLabel?: string;
}

export interface BoardingPassProps {
  /** Leave out to watch a demo flight get a gate change and a delay. */
  flight?: Flight;
  /** Rotating sequence of waybills/manifests. */
  flights?: Flight[];
  /** Rotation interval in ms. */
  interval?: number;
  /** Custom field labels (e.g. for freight Air Waybill). */
  labels?: BoardingPassLabels;
  className?: string;
}

const BASE: Flight = {
  airline: "Northwind",
  number: "NW 214",
  from: { code: "LIS", city: "Lisbon", time: "10:40" },
  to: { code: "CPH", city: "Copenhagen", time: "15:05" },
  date: "Thu, 12 Nov",
  gate: "B12",
  boards: "10:05",
  seat: "14A",
  group: "2",
  passenger: "Maya Chen",
  status: "on-time",
};

const DEMO: Flight[] = [
  BASE,
  {
    ...BASE,
    gate: "B31",
    status: "gate-change",
    note: "Gate moved to B31, 6 min walk",
  },
  {
    ...BASE,
    gate: "B31",
    boards: "10:30",
    from: { ...BASE.from, time: "11:05" },
    to: { ...BASE.to, time: "15:30" },
    status: "delayed",
    note: "Delayed 25 min, late inbound aircraft",
  },
  {
    ...BASE,
    gate: "B31",
    boards: "10:30",
    from: { ...BASE.from, time: "11:05" },
    to: { ...BASE.to, time: "15:30" },
    status: "boarding",
    note: "Group 2 is boarding now",
  },
];

const STATUS: Record<FlightStatus, { label: string; tone: string }> = {
  "on-time": {
    label: "On time",
    tone: "bg-success-wash text-success",
  },
  "gate-change": {
    label: "Gate change",
    tone: "bg-warning-wash text-warning",
  },
  delayed: {
    label: "Delayed",
    tone: "bg-destructive-wash text-destructive",
  },
  boarding: {
    label: "Boarding",
    tone: "bg-info-wash text-info",
  },
  "in-transit": {
    label: "In transit",
    tone: "bg-status-transit-wash text-status-transit",
  },
  "gate-scan": {
    label: "Gate scan",
    tone: "bg-warning-wash text-warning",
  },
  delivered: {
    label: "Delivered",
    tone: "bg-status-delivered-wash text-status-delivered",
  },
};

/** Remembers the value before the last change, so it can sit struck under the new one. */
function usePrevious(value: string) {
  const [state, setState] = useState({
    now: value,
    was: null as string | null,
  });
  if (state.now !== value) {
    setState({ now: value, was: state.now });
  }
  return state.was;
}

/**
 * A value where only the characters that changed roll over, one after
 * another, like a departures board updating one slot.
 */
function Flap({
  value,
  className,
  reduceMotion,
}: {
  value: string;
  className?: string;
  reduceMotion: boolean;
}) {
  const was = usePrevious(value);
  let changed = 0;
  return (
    <span className={cn("inline-flex", className)}>
      <span className="sr-only">{value}</span>
      {[...value].map((char, i) => {
        const moved = was !== null && was[i] !== char;
        const order = moved ? changed++ : 0;
        return (
          <span
            aria-hidden="true"
            className="relative inline-block overflow-hidden"
            key={`${i.toString()}-${value.length}`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                animate={{ y: "0%", opacity: 1 }}
                className="inline-block whitespace-pre"
                exit={{ y: "100%", opacity: 0 }}
                initial={{ y: "-100%", opacity: 0 }}
                key={char}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.3, delay: Math.min(order, 5) * 0.05, ease: EASE_OUT }
                }
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}

function Field({
  label,
  value,
  previous,
  reduceMotion,
  large,
}: {
  label: string;
  value: string;
  previous: string;
  reduceMotion: boolean;
  large?: boolean;
}) {
  const changed = previous !== value;
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Flap
        className={cn(
          "font-semibold text-foreground tabular-nums tracking-tight transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          large ? "text-xl" : "text-base",
          changed && "text-warning"
        )}
        reduceMotion={reduceMotion}
        value={value}
      />
      <div className="mt-0.5 h-4">
        <AnimatePresence initial={false}>
          {changed && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-muted-foreground/80 tabular-nums line-through decoration-muted-foreground/50"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: -4 }}
              transition={{
                duration: reduceMotion ? 0 : 0.24,
                delay: reduceMotion ? 0 : 0.25,
                ease: EASE_OUT,
              }}
            >
              {previous}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** A statutory airway bill consignment barcode. */
function Barcode({ seed }: { seed: string }) {
  return (
    <div
      role="img"
      aria-label={`Consignment barcode for reference ${seed}`}
      className="h-10 w-full rounded-none bg-[repeating-linear-gradient(90deg,currentColor_0px,currentColor_2px,transparent_2px,transparent_4px,currentColor_4px,currentColor_7px,transparent_7px,transparent_10px,currentColor_10px,currentColor_11px,transparent_11px,transparent_14px)] text-foreground opacity-85"
    />
  );
}

/**
 * A boarding pass that keeps itself current. When the gate or times change,
 * only the characters that moved roll over, the new value turns orange, and
 * the old one stays underneath, struck through, so you can see what changed.
 */
export default function BoardingPass({
  flight,
  flights,
  interval,
  labels,
  className,
}: BoardingPassProps) {
  const [step, setStep] = useState(0);
  const reduceMotion = Boolean(useReducedMotion());
  const list = flights ?? DEMO;
  const current = flight ?? list[step % list.length];
  // What the pass said when it was issued: the baseline for "changed".
  const [issued] = useState(flight ?? list[0]);
  const cardRef = useRef<HTMLDivElement>(null);
  const tearRef = useRef<HTMLDivElement>(null);
  const [tearY, setTearY] = useState(0);

  useEffect(() => {
    if (flight || list.length <= 1) {
      return;
    }
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % list.length),
      interval ?? 3200
    );
    return () => window.clearInterval(id);
  }, [flight, list.length, interval]);

  useLayoutEffect(() => {
    const measure = () => {
      if (tearRef.current) {
        setTearY(tearRef.current.offsetTop);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const status = STATUS[current.status];
  const fade = { duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT };
  const notches = `radial-gradient(circle ${NOTCH}px at 0 ${tearY}px, #0000 97%, #000 100%), radial-gradient(circle ${NOTCH}px at 100% ${tearY}px, #0000 97%, #000 100%)`;

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <div
        className="rounded-none border border-border bg-card text-card-foreground shadow-sm"
        ref={cardRef}
        style={{
          maskImage: notches,
          WebkitMaskImage: notches,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-medium text-sm text-foreground">
              <span className="flex size-6 items-center justify-center rounded-none bg-primary text-primary-foreground">
                <Plane aria-hidden className="size-3.5 -rotate-45" />
              </span>
              {current.airline}
              <span className="font-normal text-muted-foreground">
                {current.number}
              </span>
            </p>
            <span
              className={cn(
                "relative inline-flex h-6 items-center overflow-hidden rounded-none px-2.5 font-mono text-xs uppercase tracking-wider transition-colors duration-300",
                status.tone
              )}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={status.label}
                  transition={fade}
                >
                  {status.label}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-4xl text-foreground tracking-tight">
                {current.from.code}
              </p>
              <p className="text-xs leading-snug text-muted-foreground">
                {current.from.city} ·{" "}
                <Flap
                  className={cn(
                    "tabular-nums transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    current.from.time === issued.from.time
                      ? "text-foreground"
                      : "text-warning"
                  )}
                  reduceMotion={reduceMotion}
                  value={current.from.time}
                />
              </p>
            </div>
            <div className="mb-5 flex flex-1 items-center gap-1.5 text-border">
              <span className="h-px flex-1 border-current border-t border-dashed" />
              <Plane
                aria-hidden
                className="size-3.5 rotate-45 text-muted-foreground"
              />
              <span className="h-px flex-1 border-current border-t border-dashed" />
            </div>
            <div className="min-w-0 text-right">
              <p className="font-semibold text-4xl text-foreground tracking-tight">
                {current.to.code}
              </p>
              <p className="text-xs leading-snug text-muted-foreground">
                <Flap
                  className={cn(
                    "tabular-nums transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    current.to.time === issued.to.time
                      ? "text-foreground"
                      : "text-warning"
                  )}
                  reduceMotion={reduceMotion}
                  value={current.to.time}
                />{" "}
                · {current.to.city}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-3">
            <Field
              label={labels?.field1 ?? "Gate"}
              large
              previous={issued.gate}
              reduceMotion={reduceMotion}
              value={current.gate}
            />
            <Field
              label={labels?.field2 ?? "Boards"}
              large
              previous={issued.boards}
              reduceMotion={reduceMotion}
              value={current.boards}
            />
            <Field
              label={labels?.field3 ?? "Seat"}
              large
              previous={issued.seat}
              reduceMotion={reduceMotion}
              value={current.seat}
            />
            <Field
              label={labels?.field4 ?? "Group"}
              large
              previous={issued.group}
              reduceMotion={reduceMotion}
              value={current.group}
            />
          </div>

          <div className="relative mt-2 h-4 text-xs">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="truncate text-muted-foreground"
                exit={{ opacity: 0, y: -4 }}
                initial={{ opacity: 0, y: 4 }}
                key={current.note ?? current.date}
                transition={fade}
              >
                {current.note ??
                  `${current.date} · Scheduled commercial belly-hold space`}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* The tear line, between the notches. */}
        <div className="relative mx-4" ref={tearRef}>
          <div className="border-border border-t-2 border-dashed" />
        </div>

        <div className="flex items-center gap-4 p-5">
          <div className="min-w-0 flex-1">
            <Barcode seed={`${current.passenger}${current.number}`} />
          </div>
          <div className="shrink-0 text-right leading-tight">
            <p className="text-xs text-muted-foreground">
              {labels?.footerLabel ?? "Passenger"}
            </p>
            <p className="font-medium text-sm text-foreground">
              {current.passenger}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80 tabular-nums">
              {current.date}
            </p>
          </div>
        </div>
      </div>

      {/* Outlines for the notches, which the mask cut out of the border. */}
      {tearY > 0 &&
        [0, 1].map((side) => (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute text-border"
            height={NOTCH * 2 + 2}
            key={side}
            style={{
              top: tearY - NOTCH - 1,
              [side ? "right" : "left"]: -1,
            }}
            viewBox={`0 0 ${NOTCH + 1} ${NOTCH * 2 + 2}`}
            width={NOTCH + 1}
          >
            <path
              d={
                side
                  ? `M ${NOTCH + 1} 1 A ${NOTCH} ${NOTCH} 0 0 0 ${NOTCH + 1} ${NOTCH * 2 + 1}`
                  : `M 0 1 A ${NOTCH} ${NOTCH} 0 0 1 0 ${NOTCH * 2 + 1}`
              }
              fill="none"
              stroke="currentColor"
            />
          </svg>
        ))}
    </div>
  );
}
