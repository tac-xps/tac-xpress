import { useEffect, useRef, useState, useSyncExternalStore } from "react"
// ...
  useEffect(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    if (scrollHeight > 0) {
      requestAnimationFrame(() => {
        setProgress(Math.min(Math.max(scrollY / scrollHeight, 0), 1))
      })
    }
  }, [scrollY])