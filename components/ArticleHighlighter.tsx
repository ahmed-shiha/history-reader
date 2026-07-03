'use client'
import { useEffect } from 'react'
import Mark from 'mark.js'
import type { Note } from '@/lib/types'

interface ArticleHighlighterProps {
  notes: Note[]
  articleRef: React.RefObject<HTMLDivElement>
  onNoteClick: (note: Note) => void
  activeNoteId?: string | null
}

export default function ArticleHighlighter({
  notes,
  articleRef,
  onNoteClick,
  activeNoteId,
}: ArticleHighlighterProps) {
  useEffect(() => {
    const el = articleRef.current
    if (!el) return

    const instance = new Mark(el)
    instance.unmark()

    if (notes.length === 0) return

    notes.forEach((note) => {
      instance.mark(note.selected_text, {
        element: 'mark',
        className: '',
        separateWordSearch: false,
        accuracy: 'partially',
        each: (markEl: HTMLElement) => {
          markEl.setAttribute('data-note-id', note.id)
          markEl.setAttribute('title', note.note_content)
          if (note.id === activeNoteId) {
            markEl.classList.add('active')
          }
          // Use named function so we can track it; mark.js removes marks on
          // unmark(), so we don't need to manually clean up listeners.
          markEl.addEventListener('click', () => onNoteClick(note))
        },
      })
    })

    return () => {
      instance.unmark()
    }
    // onNoteClick intentionally excluded — callers should memoize it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, articleRef, activeNoteId])

  return null
}
