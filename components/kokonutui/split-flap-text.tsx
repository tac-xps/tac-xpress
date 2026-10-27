"use client";

/**
 * @author: @dorianbaffier
 * @description: Split Flap Text
 * @version: 1.0.0
 * @date: 2026-10-22
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
  type CSSProperties,
  type Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** The order the flaps are printed in. A tile can only flip forward. */
const CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/&!?";
/** One flap falling, in ms. Quick, so long trips round the drum still feel brisk. */
const FLIP = 56;
/** Tiles start a beat apart, left to right. */
const STAGGER = 24;

export interface SplitFlapTextProps {
  /** Show this text. Leave out to cycle through `words`. */
  text?: string;
  /** Lines to cycle through when `text` isn't set. */
  words?: string[];
  /** Time each word stays up, in ms. */
  interval?: number;
  /** Tiles always shown, so the board doesn't change width. Defaults to the longest word. */
  length?: number;
  className?: string;
  /** Classes for each tile, to recolor the board. */
  tileClassName?: string;
}

const clean = (value: string) =>
  [...value.toUpperCase()].map((c) => (CHARSET.includes(c) ? c : " ")).join("");

function Half({
  char,
  half,
  className,
  ref,
  style,
}: {
  char: string;
  half: "top" | "bottom";
  className?: string;
  ref?: Ref<HTMLSpanElement>;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cn(
        "backface-hidden absolute inset-x-0 h-1/2 overflow-hidden bg-inherit select-none rounded-none",
        half === "top" ? "top-0" : "bottom-0",
        className
      )}
      ref={ref}
      style={style}
    >
      <span
        className={cn(
          "absolute inset-x-0 flex h-[200%] items-center justify-center font-mono font-bold leading-none select-none",
          half === "top" ? "top-0" : "-top-full"
        )}
      >
        {char}
      </span>
    </span>
  );
}

interface Flip {
  id: number;
  from: string;
  to: string;
}

const FLIP_DURATION = 140;

function Tile({
  target,
  delay,
  reduceMotion,
  className,
}: {
  target: string;
  delay: number;
  reduceMotion: boolean;
  className?: string;
}) {
  const [shown, setShown] = useState(target);
  const [flip, setFlip] = useState<Flip | null>(null);
  const shownRef = useRef(target);
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);
  const shadeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduceMotion) {
      shownRef.current = target;
      return;
    }
    if (shownRef.current === target) {
      return;
    }
    const from = shownRef.current;
    const to = target;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setFlip({ id: Date.now(), from, to });
      finishTimer = setTimeout(() => {
        shownRef.current = to;
        setShown(to);
        setFlip(null);
      }, FLIP_DURATION);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (finishTimer) {
        clearTimeout(finishTimer);
      }
    };
  }, [target, delay, reduceMotion]);

  // The top flap falls on its hinge, the bottom of the next letter lands,
  // and the lower half darkens for a moment under the falling flap.
  useLayoutEffect(() => {
    if (!flip) {
      return;
    }
    const half = FLIP_DURATION / 2;
    topRef.current?.animate(
      [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }],
      {
        duration: half,
        easing: "cubic-bezier(0.5, 0, 0.9, 0.6)",
        fill: "forwards",
      }
    );
    bottomRef.current?.animate(
      [{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }],
      {
        duration: half,
        delay: half,
        easing: "cubic-bezier(0.2, 0.6, 0.3, 1)",
        fill: "both",
      }
    );
    shadeRef.current?.animate(
      [{ opacity: 0 }, { opacity: 0.8 }, { opacity: 0 }],
      {
        duration: FLIP_DURATION,
        easing: "linear",
      }
    );
  }, [flip]);

  const front = reduceMotion ? target : flip ? flip.to : shown;
  const back = reduceMotion ? target : flip ? flip.from : shown;
  const isSpace = front === " " && back === " " && !flip;

  if (isSpace) {
    return (
      <span
        aria-hidden="true"
        className="relative inline-block h-[1.48em] w-[0.38em] rounded-none select-none"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-block h-[1.48em] w-[0.96em] rounded-none bg-primary text-primary-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] [perspective:8em]",
        className
      )}
    >
      {/* Still halves: the next letter's top, the old letter's bottom. */}
      <Half char={front} half="top" />
      <Half char={back} half="bottom" />
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-none bg-black/40 opacity-0"
        ref={shadeRef}
      />
      {flip && (
        <>
          <Half
            char={flip.from}
            half="top"
            key={`t-${flip.id}`}
            ref={topRef}
            style={{ transformOrigin: "50% 100%" }}
          />
          <Half
            char={flip.to}
            half="bottom"
            key={`b-${flip.id}`}
            ref={bottomRef}
            style={{ transformOrigin: "50% 0%", transform: "rotateX(90deg)" }}
          />
        </>
      )}
      {/* Precision hairline split dividing top and bottom mechanical flaps */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/35 dark:bg-black/60" />
    </span>
  );
}

/**
 * Departure-board lettering. Each tile flips through its drum only as far
 * as its new letter, the tiles start a beat apart, and the flaps fall on a
 * real hinge with the half below darkening under them.
 */
export default function SplitFlapText({
  text,
  words = ["NOW BOARDING", "GATE 12", "ON TIME", "LAST CALL"],
  interval = 3800,
  length,
  className,
  tileClassName,
}: SplitFlapTextProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);

  useEffect(() => {
    if (text !== undefined || words.length < 2) {
      return;
    }
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [text, words.length, interval]);

  const value = clean(text ?? words[index] ?? "");
  const size =
    length ??
    Math.max(
      value.length,
      ...(text === undefined ? words.map((w) => w.length) : [0])
    );
  const padded = value.padEnd(size, " ");

  return (
    <span
      className={cn(
        "inline-flex gap-[0.08em] font-semibold tabular-nums leading-none",
        className || "text-3xl sm:text-5xl"
      )}
    >
      {/* Only announce text the app sets; a board cycling on its own would
          talk over the reader every few seconds. */}
      <span
        aria-live={text === undefined ? "off" : "polite"}
        className="sr-only"
      >
        {value}
      </span>
      {[...padded].map((char, i) => (
        <Tile
          className={tileClassName}
          delay={i * STAGGER}
          key={i.toString()}
          reduceMotion={reduceMotion}
          target={char}
        />
      ))}
    </span>
  );
}
