"use client";

/**
 * @author: @dorianbaffier
 * @description: Status Island
 * @version: 1.0.0
 * @date: 2026-10-15
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react";
import {
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown, ChevronUp, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export type IslandTaskStatus = "running" | "done" | "error";

export interface IslandTask {
  id: string;
  /** What is happening, e.g. "Uploading 12 photos". */
  label: string;
  /** Optional second part, shown dimmed after the label. */
  detail?: string;
  status: IslandTaskStatus;
  /** 0 to 1 while running. Leave it out for work without a known length. */
  progress?: number;
  /** A follow-up, like Undo, Open or Retry. */
  action?: { label: string; onClick: () => void };
}

export interface StatusIslandProps {
  /** Oldest first; the newest task is the one the island shows. */
  tasks: IslandTask[];
  istTime?: string;
  phaseTitle?: string;
  /** Called when a finished task has been on screen for `dismissAfter`. */
  onDismiss?: (id: string) => void;
  /** Milliseconds a done task stays. Paused while the island is open. */
  dismissAfter?: number;
  className?: string;
}

const ACCORDION_EASE: Transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] };
const SWAP: Transition = { duration: 0.18, ease: [0.22, 1, 0.36, 1] };

function TaskIcon({ task }: { task: IslandTask }) {
  if (task.status === "done") {
    return (
      <span
        aria-hidden="true"
        className="flex size-4 shrink-0 items-center justify-center rounded-none bg-status-delivered/20 text-status-delivered border border-status-delivered/50"
      >
        <Check className="size-2.5 stroke-[2.5]" />
      </span>
    );
  }
  if (task.status === "error") {
    return (
      <span
        aria-hidden="true"
        className="flex size-4 shrink-0 items-center justify-center rounded-none bg-destructive/20 text-destructive border border-destructive/50 font-mono text-[10px] font-bold"
      >
        !
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="relative flex size-4 shrink-0 items-center justify-center rounded-none bg-status-transit/20 text-status-transit border border-status-transit/50"
    >
      <span className="size-1.5 rounded-none bg-status-transit animate-pulse" />
    </span>
  );
}

function TaskTrailing({ task }: { task: IslandTask }) {
  if (task.action) {
    const { label, onClick } = task.action;
    return (
      <button
        className="shrink-0 rounded-none border border-border/80 bg-muted/60 px-2 py-0.5 font-mono font-medium text-foreground text-xs transition-colors hover:bg-accent focus-visible:outline-none"
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        type="button"
      >
        {label}
      </button>
    );
  }
  if (task.status === "running" && typeof task.progress === "number") {
    const percent = Math.round(Math.min(1, Math.max(0, task.progress)) * 100);
    return (
      <div className="flex shrink-0 items-center gap-2">
        <div className="h-1.5 w-10 sm:w-12 rounded-none bg-muted overflow-hidden border border-border/50">
          <div
            className="h-full bg-status-delivered transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="font-mono text-xs font-semibold tabular-nums text-foreground/90">
          {percent}%
        </span>
      </div>
    );
  }
  return null;
}

function TaskRow({ task }: { task: IslandTask }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 py-1.5 border-b border-border/40 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <TaskIcon task={task} />
        <div className="min-w-0 flex-1 truncate">
          <div className="truncate font-mono text-xs font-semibold text-foreground">
            {task.label}
          </div>
          {task.detail ? (
            <div className="truncate font-sans text-[11px] text-muted-foreground">
              {task.detail}
            </div>
          ) : null}
        </div>
      </div>
      <TaskTrailing task={task} />
    </div>
  );
}

function describe(task: IslandTask) {
  return [task.label, task.detail].filter(Boolean).join(", ");
}

/**
 * Tactical Corridor Operations Console (Straight-Line HUD).
 * Reports active air freight linehaul progress between New Delhi and Imphal.
 */
export function StatusIsland({
  tasks,
  istTime,
  phaseTitle,
  onDismiss,
  dismissAfter = 4000,
  className,
}: StatusIslandProps) {
  const [open, setOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const doneAt = useRef(new Map<string, number>());
  const lastStatus = useRef(new Map<string, IslandTaskStatus>());
  const current = tasks.find((task) => task.status === "running") ?? tasks.at(-1);
  const expanded = open && tasks.length > 0;
  const islandRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const focusList = useRef(false);
  const focusPill = useRef(false);
  const skipOpen = useRef(false);

  useEffect(() => {
    if (expanded && focusList.current) {
      focusList.current = false;
      listRef.current?.focus({ preventScroll: true });
    } else if (!expanded && focusPill.current) {
      focusPill.current = false;
      skipOpen.current = true;
      pillRef.current?.focus({ preventScroll: true });
    }
  }, [expanded]);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const close = (event: globalThis.PointerEvent) => {
      if (!islandRef.current?.contains(event.target as Node)) {
        setIsPinned(false);
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [expanded]);

  useEffect(() => {
    for (const task of tasks) {
      if (lastStatus.current.get(task.id) !== task.status) {
        lastStatus.current.set(task.id, task.status);
        setAnnouncement(describe(task));
      }
    }
    const ids = new Set(tasks.map((task) => task.id));
    for (const id of lastStatus.current.keys()) {
      if (!ids.has(id)) {
        lastStatus.current.delete(id);
        doneAt.current.delete(id);
      }
    }
  }, [tasks]);

  useEffect(() => {
    if (!onDismiss || expanded) {
      return;
    }
    const now = Date.now();
    const timers: number[] = [];
    for (const task of tasks) {
      if (task.status !== "done") {
        continue;
      }
      const since = doneAt.current.get(task.id) ?? now;
      doneAt.current.set(task.id, since);
      const left = Math.max(0, dismissAfter - (now - since));
      timers.push(window.setTimeout(() => onDismiss(task.id), left));
    }
    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [tasks, expanded, onDismiss, dismissAfter]);

  useEffect(() => {
    if (expanded) {
      const now = Date.now();
      for (const id of doneAt.current.keys()) {
        doneAt.current.set(id, now);
      }
    }
  }, [expanded]);

  const handlePointerEnter = useCallback((event: PointerEvent) => {
    if (event.pointerType === "mouse") {
      setOpen(true);
    }
  }, []);

  const handlePointerLeave = useCallback((event: PointerEvent) => {
    if (event.pointerType === "mouse" && !isPinned) {
      setOpen(false);
    }
  }, [isPinned]);

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (!isPinned && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }, [isPinned]);

  const handleFocus = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (skipOpen.current) {
      skipOpen.current = false;
      return;
    }
    if ((event.target as Node) === pillRef.current) {
      focusList.current = true;
    }
    setOpen(true);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      focusPill.current = Boolean(
        islandRef.current?.contains(document.activeElement)
      );
      setIsPinned(false);
      setOpen(false);
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("relative flex flex-col items-start", className)}>
        <output aria-live="polite" className="sr-only">
          {announcement}
        </output>
        <AnimatePresence>
          {current ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-none border border-border bg-card text-card-foreground shadow-md transition-colors"
              exit={{ opacity: 0, y: 6 }}
              initial={{ opacity: 0, y: 6 }}
              key="console"
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              ref={islandRef}
              transition={SWAP}
            >
              {expanded ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex w-84 max-w-[calc(100vw-2rem)] flex-col outline-none"
                  initial={{ opacity: 0 }}
                  key="expanded-ledger"
                  ref={listRef}
                  tabIndex={-1}
                  transition={ACCORDION_EASE}
                >
                  <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-3.5 py-2">
                    <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-foreground">
                      <span className="size-2 rounded-none bg-status-delivered animate-pulse" />
                      DEL ⇄ IMF Telemetry
                    </span>
                    <div className="flex items-center gap-2.5">
                      {istTime ? (
                        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                          {istTime}
                        </span>
                      ) : null}
                      <button
                        aria-label="Collapse operations ledger"
                        className="flex items-center gap-1 font-mono text-[10px] uppercase text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => {
                          setIsPinned(false);
                          setOpen(false);
                        }}
                        type="button"
                      >
                        <span>Close</span>
                        <ChevronDown className="size-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col px-3.5 py-2">
                    {tasks.map((task) => (
                      <TaskRow key={task.id} task={task} />
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-3.5 py-1.5 font-mono text-[10px] text-muted-foreground">
                    <span>Direct: Delhi (DEL) ⇄ Imphal (IMF)</span>
                    <span className="font-semibold text-status-delivered">
                      {phaseTitle ?? "Active Corridor"}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <button
                  aria-expanded={false}
                  aria-label={`DEL ⇄ IMF Telemetry: ${describe(current)}. Click to open operations ledger`}
                  className="group relative flex size-11 items-center justify-center transition-colors hover:bg-muted/40 focus-visible:outline-none"
                  onClick={() => {
                    setIsPinned(true);
                    setOpen(true);
                  }}
                  ref={pillRef}
                  title={`DEL ⇄ IMF Telemetry · ${current.label}`}
                  type="button"
                >
                  {/* Corner Live Beacon */}
                  <span className="absolute top-1.5 right-1.5 flex size-2 rounded-none" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-status-delivered opacity-75" />
                    <span className="relative inline-flex size-2 rounded-none bg-status-delivered" />
                  </span>

                  {/* Flight Telemetry Glyph & Destination Code */}
                  <div className="flex flex-col items-center justify-center -space-y-0.5">
                    <Plane className="size-4 text-foreground transition-transform duration-200 group-hover:scale-110 -rotate-45" />
                    <span className="font-mono text-[9px] font-bold tracking-tight text-foreground/80">
                      IMF
                    </span>
                  </div>
                </button>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/**
 * The trailing slot inside the closed pill. The pill itself is a button, so
 * the action shows as a label here and becomes a real button in the list.
 */
function TaskTrailingInert({ task }: { task: IslandTask }) {
  if (task.action) {
    return (
      <span className="-my-1 inline-block rounded-none border border-border/80 bg-muted/60 px-2 py-0.5 font-mono font-medium text-foreground text-xs">
        {task.action.label}
      </span>
    );
  }
  return <TaskTrailing task={task} />;
}

type DemoKind = "upload" | "export" | "archive" | "sync";

const DEMO_ACTIONS: { kind: DemoKind; label: string }[] = [
  { kind: "upload", label: "Upload photos" },
  { kind: "export", label: "Export report" },
  { kind: "archive", label: "Archive thread" },
  { kind: "sync", label: "Sync calendar" },
];

/** A playground: each button starts a pretend task that reports to the island. */
export default function StatusIslandDemo({
  className,
}: {
  className?: string;
}) {
  const [tasks, setTasks] = useState<IslandTask[]>([]);
  const timers = useRef(new Set<number>());
  const counter = useRef(0);

  useEffect(() => {
    const active = timers.current;
    return () => {
      for (const timer of active) {
        window.clearInterval(timer);
        window.clearTimeout(timer);
      }
    };
  }, []);

  const update = useCallback((id: string, patch: Partial<IslandTask>) => {
    setTasks((list) =>
      list.map((task) => (task.id === id ? { ...task, ...patch } : task))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setTasks((list) => list.filter((task) => task.id !== id));
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      fn();
    }, ms);
    timers.current.add(timer);
  }, []);

  const runRef = useRef<
    | ((
        id: string,
        options: { speed: number; failAt?: number; onDone: () => void }
      ) => void)
    | null
  >(null);

  const run = useCallback(
    (
      id: string,
      options: { speed: number; failAt?: number; onDone: () => void }
    ) => {
      let progress = 0;
      const timer = window.setInterval(() => {
        progress = Math.min(
          1,
          progress + options.speed * (0.5 + Math.random())
        );
        if (options.failAt !== undefined && progress >= options.failAt) {
          window.clearInterval(timer);
          timers.current.delete(timer);
          update(id, {
            status: "error",
            label: "Sync failed",
            detail: "Calendar offline",
            progress: undefined,
            action: {
              label: "Retry",
              onClick: () => {
                update(id, {
                  status: "running",
                  label: "Syncing calendar",
                  detail: undefined,
                  progress: 0,
                  action: undefined,
                });
                runRef.current?.(id, {
                  speed: options.speed,
                  onDone: options.onDone,
                });
              },
            },
          });
          return;
        }
        update(id, { progress });
        if (progress >= 1) {
          window.clearInterval(timer);
          timers.current.delete(timer);
          later(options.onDone, 250);
        }
      }, 180);
      timers.current.add(timer);
    },
    [later, update]
  );

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  const start = useCallback(
    (kind: DemoKind) => {
      counter.current += 1;
      const id = `${kind}-${counter.current}`;
      if (kind === "archive") {
        setTasks((list) => [
          ...list,
          {
            id,
            status: "done",
            label: "Thread archived",
            action: {
              label: "Undo",
              onClick: () =>
                update(id, {
                  label: "Thread restored",
                  action: undefined,
                }),
            },
          },
        ]);
        return;
      }
      if (kind === "upload") {
        setTasks((list) => [
          ...list,
          {
            id,
            status: "running",
            label: "Uploading",
            detail: "12 photos",
            progress: 0,
          },
        ]);
        run(id, {
          speed: 0.045,
          onDone: () =>
            update(id, {
              status: "done",
              label: "12 photos uploaded",
              detail: undefined,
              action: { label: "View", onClick: () => remove(id) },
            }),
        });
        return;
      }
      if (kind === "export") {
        setTasks((list) => [
          ...list,
          { id, status: "running", label: "Exporting report", progress: 0 },
        ]);
        run(id, {
          speed: 0.07,
          onDone: () =>
            update(id, {
              status: "done",
              label: "Report ready",
              detail: "Q3.csv",
              action: { label: "Open", onClick: () => remove(id) },
            }),
        });
        return;
      }
      setTasks((list) => [
        ...list,
        { id, status: "running", label: "Syncing calendar", progress: 0 },
      ]);
      run(id, {
        speed: 0.06,
        failAt: counter.current % 2 === 0 ? undefined : 0.62,
        onDone: () =>
          update(id, {
            status: "done",
            label: "Calendar synced",
            detail: undefined,
            action: undefined,
          }),
      });
    },
    [remove, run, update]
  );

  return (
    <div
      className={cn(
        "relative flex h-[360px] w-full max-w-2xl flex-col items-center justify-between py-6",
        className
      )}
    >
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {DEMO_ACTIONS.map((action) => (
          <button
            className="h-8 rounded-none border border-border bg-card px-3.5 font-medium text-[13px] text-foreground transition-colors duration-150 hover:bg-muted active:bg-muted/80"
            key={action.kind}
            onClick={() => start(action.kind)}
            type="button"
          >
            {action.label}
          </button>
        ))}
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Start a task, then hover the island
        </p>
      ) : null}
      <StatusIsland onDismiss={remove} tasks={tasks} />
    </div>
  );
}
