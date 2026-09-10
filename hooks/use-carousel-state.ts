"use client"
import { useCallback, useMemo, useSyncExternalStore } from "react"
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel"

const empty = JSON.stringify({
  selectedIndex: 0,
  scrollSnaps: [] as number[],
  canScrollPrev: false,
  canScrollNext: false,
  autoplayIsPlaying: false,
})
const serverSnapshot = () => empty

/** Subscribe to Embla as an external store; initial state and cleanup stay consistent. */
export function useCarouselState(api: EmblaCarouselType | undefined) {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!api) return () => {}
      const events: EmblaEventType[] = ["reInit", "select"]
      if (api.plugins().autoplay) events.push("autoplay:play", "autoplay:stop")
      events.forEach((event) => api.on(event, notify))
      return () => {
        events.forEach((event) => api.off(event, notify))
      }
    },
    [api]
  )
  const snapshot = useCallback(
    () =>
      api
        ? JSON.stringify({
            selectedIndex: api.selectedScrollSnap(),
            scrollSnaps: api.scrollSnapList(),
            canScrollPrev: api.canScrollPrev(),
            canScrollNext: api.canScrollNext(),
            autoplayIsPlaying: api.plugins().autoplay?.isPlaying() ?? false,
          })
        : empty,
    [api]
  )
  const state = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  return useMemo(
    () =>
      JSON.parse(state) as {
        selectedIndex: number
        scrollSnaps: number[]
        canScrollPrev: boolean
        canScrollNext: boolean
        autoplayIsPlaying: boolean
      },
    [state]
  )
}
