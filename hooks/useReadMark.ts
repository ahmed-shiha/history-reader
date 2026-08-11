'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface Options {
  bookSlug: string
  chapterSlug: string
  bookTitle: string
  chapterTitle: string
  articleRef: React.RefObject<HTMLDivElement>
}

export function useReadMark({
  bookSlug,
  chapterSlug,
  bookTitle,
  chapterTitle,
  articleRef,
}: Options) {
  // markerPct: 0–1 position within the article, null = not set yet
  const [markerPct, setMarkerPct] = useState<number | null>(null)
  const [markerWords, setMarkerWords] = useState<number>(0)
  const saving = useRef(false)

  // ── Fetch existing mark on mount ────────────────────────────────
  useEffect(() => {
    fetch(`/api/reading-progress?book_slug=${encodeURIComponent(bookSlug)}&chapter_slug=${encodeURIComponent(chapterSlug)}&latest=true`)
      .then(r => r.json())
      .then(d => {
        const rec = d.record
        if (rec && rec.char_offset > 0 && rec.total_chars > 0) {
          const pct = rec.char_offset / rec.total_chars
          setMarkerPct(pct)
          setMarkerWords(rec.words_read ?? 0)
        }
      })
      .catch(() => {})
  }, [bookSlug, chapterSlug])

  // ── Save position to Supabase ────────────────────────────────────
  const save = useCallback(async (pct: number, charOffset: number, totalChars: number, wordsRead: number) => {
    if (saving.current) return
    saving.current = true
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
          words_read: wordsRead,
          scroll_pct: pct,
          char_offset: charOffset,
          total_chars: totalChars,
        }),
      })
    } catch {
      // silent
    } finally {
      saving.current = false
    }
  }, [bookSlug, chapterSlug, bookTitle, chapterTitle])

  // ── Click handler ─────────────────────────────────────────────────
  useEffect(() => {
    const el = articleRef.current
    if (!el) return

    // Track pointer start to detect tap vs drag
    let startX = 0
    let startY = 0

    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX
      startY = e.clientY
    }

    const onClick = (e: MouseEvent) => {
      // Ignore if pointer moved significantly (selection drag)
      if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) return

      // Ignore if there's a text selection
      const sel = window.getSelection()
      if (sel && !sel.isCollapsed) return

      // Ignore clicks on highlighted marks
      if ((e.target as HTMLElement).closest('mark[data-note-id]')) return

      // Get char offset at click point
      let charOffset = 0
      if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(e.clientX, e.clientY)
        if (range && el.contains(range.startContainer)) {
          const preRange = document.createRange()
          preRange.selectNodeContents(el)
          preRange.setEnd(range.startContainer, range.startOffset)
          charOffset = preRange.toString().length
        }
      }

      const text = el.textContent || ''
      const totalChars = text.length
      const totalWords = text.trim().split(/\s+/).filter(Boolean).length
      if (totalChars === 0) return

      const pct = charOffset / totalChars
      const wordsRead = Math.round(pct * totalWords)

      setMarkerPct(pct)
      setMarkerWords(wordsRead)
      save(pct, charOffset, totalChars, wordsRead)
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('click', onClick)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('click', onClick)
    }
  }, [articleRef, save])

  return { markerPct, markerWords }
}
