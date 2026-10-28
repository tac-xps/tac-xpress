"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
}

export interface MorphicNavbarProps {
  /** Links keyed by their href, in display order. */
  items?: Record<string, NavItem>;
  /**
   * Initially active path. Defaults to the first item's path. When an item's
   * path matches the current route, that item is active instead.
   */
  defaultPath?: string;
  /**
   * After page scroll, optionally compress bar.
   */
  compact?: boolean;
  className?: string;
}

const DEFAULT_NAV_ITEMS: Record<string, NavItem> = {
  "#features": { name: "Features" },
  "#method": { name: "Method" },
  "#customers": { name: "Customers" },
  "#pricing": { name: "Pricing" },
  "#company": { name: "Company" },
};

const ACTIVE_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 32,
  mass: 0.8,
} as const;

const HOVER_SPRING = {
  type: "spring",
  stiffness: 450,
  damping: 35,
  mass: 0.7,
} as const;

const matchesPath = (path: string, current: string) =>
  path === current || (path !== "/" && current.startsWith(`${path}/`));

const findItemPath = (paths: string[], current: string | null) => {
  let match: string | undefined;
  for (const path of paths) {
    if (
      current &&
      matchesPath(path, current) &&
      (!match || path.length > match.length)
    ) {
      match = path;
    }
  }
  return match;
};

const followHash = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  if (href.startsWith("#")) {
    event.preventDefault();
    const targetId = decodeURIComponent(href.replace(/^#/, ""));
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
      }
    }
  }
};

export function MorphicNavbar({
  items = DEFAULT_NAV_ITEMS,
  defaultPath,
  className,
}: MorphicNavbarProps) {
  const entries = useMemo(() => Object.entries(items), [items]);
  const paths = useMemo(() => entries.map(([path]) => path), [entries]);
  const pathname = usePathname();

  const [activePath, setActivePath] = useState(
    () => findItemPath(paths, pathname) ?? defaultPath ?? paths[0] ?? "/"
  );
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const prevDefaultPathRef = useRef(defaultPath);
  useEffect(() => {
    if (
      defaultPath &&
      defaultPath !== prevDefaultPathRef.current &&
      paths.includes(defaultPath)
    ) {
      prevDefaultPathRef.current = defaultPath;
      setActivePath(defaultPath);
    }
  }, [defaultPath, paths]);

  useEffect(() => {
    if (pathname) {
      const routePath = findItemPath(paths, pathname);
      if (routePath) {
        setActivePath(routePath);
      }
    }
  }, [pathname, paths]);

  const prefersReduced = useReducedMotion();
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % paths.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + paths.length) % paths.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = paths.length - 1;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      const targetLink = linkRefs.current[nextIndex];
      targetLink?.focus();
      const targetPath = paths[nextIndex];
      if (targetPath) {
        setActivePath(targetPath);
      }
    }
  };

  return (
    <nav
      className={cn(
        "relative inline-flex items-center gap-1 border border-border/50 bg-muted/40 p-1 rounded-none shadow-2xs backdrop-blur-xs",
        className
      )}
      role="navigation"
      aria-label="Corridor navigation"
      onPointerLeave={() => setHoveredPath(null)}
    >
      {entries.map(([href, item], index) => {
        const isActive = activePath === href;
        const isHovered = hoveredPath === href;
        const isHash = href.startsWith("#");
        const NavLink = isHash ? "a" : Link;

        return (
          <div
            key={href}
            className="relative"
            onPointerEnter={() => setHoveredPath(href)}
          >
            {/* Hover Gliding Indicator */}
            {isHovered && !isActive && (
              <motion.div
                layoutId="hoverNavIndicator"
                className="absolute inset-0 bg-muted/60 rounded-none z-0"
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : HOVER_SPRING
                }
                aria-hidden="true"
              />
            )}

            {/* Active Shared Layout Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute inset-0 bg-card border border-border/70 shadow-2xs rounded-none z-10"
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : ACTIVE_SPRING
                }
                aria-hidden="true"
              >
                <span className="absolute bottom-0 inset-x-2.5 h-[2px] bg-primary rounded-none" />
              </motion.div>
            )}

            {/* Anchor / Link */}
            <NavLink
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              href={href}
              draggable={false}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative z-20 flex h-8 items-center px-3.5 text-xs font-medium tracking-tight rounded-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none",
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                setActivePath(href);
                if (isHash) {
                  followHash(e, href);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <span>{item.name}</span>
            </NavLink>
          </div>
        );
      })}
    </nav>
  );
}

export default MorphicNavbar;
