'use client'
import { useEffect, useRef } from 'react'

// Save & restore window scroll position per page key.
// Saves every 500 ms while scrolling, restores on mount after a short delay
// (to let the page finish rendering before jumping).

const PREFIX = 'scroll-pos:'

function save(key: string) {
  try {
    localStorage.setItem(PREFIX + key, String(Math.round(window.scrollY)))
  } catch {}
}

function load(key: string): number {
  try {
    const v = localStorage.getItem(PREFIX + key)
    return v ? parseInt(v, 10) : 0
  } catch {
    return 0
  }
}

export function useScrollRestore(key: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Restore after a tick so the DOM is fully painted
    const restoreTimer = setTimeout(() => {
      const saved = load(key)
      if (saved > 0) {
        window.scrollTo({ top: saved, behavior: 'instant' })
      }
    }, 120)

    // Save on scroll with 500 ms debounce
    function onScroll() {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => save(key), 500)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(restoreTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener('scroll', onScroll)
      // Save immediately on unmount (navigation away)
      save(key)
    }
  }, [key])
}
