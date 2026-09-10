"use client"
import { useSyncExternalStore } from "react"
const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false
/** SSR-safe browser readiness without an extra effect-driven state update. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
}
