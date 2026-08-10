'use client'
import { useEffect, useRef, useCallback } from 'react'

interface Options {
  bookSlug: string
  chapterSlug: string
  bookTitle: string
  chapterTitle: string
  articleRef: React.RefObject<HTMLDivElement>
}

export function useReadingProgress({
  bookSlug,
  chapterSlug,
  bookTitle,
  chapterTitle,
  articleRef,
}: Options) {
  const maxPct      = useRef(0)      // deepest point reached (never decreases)
  const totalWords  = useRef(0)      // counted once on mount
  const lastSaved   = useRef(-1)     // last scroll_pct we actually sent
  const timer       = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fraction of the article the user has scrolled into view [0, 1]
  const getPct = useCallback((): number => {
    const el = articleRef.current
    if (!el) return 0
    const articleTop    = el.getBoundingClientRect().top + window.scrollY
    const articleHeight = el.scrollHeight
    if (articleHeight === 0) return 0
    const seen = window.scrollY + window.innerHeight - articleTop
    return Math.min(1, Math.max(0, seen / articleHeight))
  }, [articleRef])

  const flush = useCallback(async (pct: number) => {
    // Only send if we advanced at least 1 %
    if (pct <= lastSaved.current + 0.01) return
    lastSaved.current = pct

    const words = Math.round(pct * totalWords.current)
    const today = new Date().toISOString().slice(0, 10)

    try {
      await fetch('/api/reading-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          book_slug: bookSlug,
          chapter_slug: chapterSlug,
          book_title: bookTitle,
          chapter_title: chapterTitle,
          words_read: words,
          scroll_pct: pct,
        }),
      })
    } catch {
      // silent — not critical
    }
  }, [bookSlug, chapterSlug, bookTitle, chapterTitle])

  const onScroll = useCallback(() => {
    const pct = getPct()
    if (pct <= maxPct.current) return   // haven't gone deeper
    maxPct.current = pct

    // Debounce: write 8 s after the last scroll event
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => flush(maxPct.current), 8_000)
  }, [getPct, flush])

  useEffect(() => {
    const el = articleRef.current
    if (el) {
      const text = el.textContent || ''
      totalWords.current = text.trim().split(/\s+/).filter(Boolean).length
    }

    // Capture initial position (opening the chapter already counts)
    const init = getPct()
    maxPct.current = init
    flush(init)

    window.addEventListener('scroll', onScroll, { passive: true })

    // Flush immediately when the tab goes hidden or the page unloads
    const onHide = () => {
      if (timer.current) clearTimeout(timer.current)
      flush(maxPct.current)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') onHide()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', onHide)

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', onHide)
      if (timer.current) clearTimeout(timer.current)
      flush(maxPct.current)   // flush on unmount (route change)
    }
  }, [articleRef, getPct, onScroll, flush])
}
