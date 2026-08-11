'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import type { NoteColor } from '@/lib/types'

interface PopupState {
  visible: boolean
  x: number
  y: number
  selectedText: string
  sectionHeading: string | null
  charStart: number
  charEnd: number
  isBelow: boolean
}

interface SelectionPopupProps {
  onAddNote: (selectedText: string, sectionHeading: string | null, charStart: number, charEnd: number) => void
  onHighlight: (selectedText: string, sectionHeading: string | null, charStart: number, charEnd: number, color: NoteColor) => void
  articleRef: React.RefObject<HTMLDivElement>
}

function getCharOffset(
  range: Range,
  container: HTMLElement,
): { start: number; end: number } {
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(container)
  preCaretRange.setEnd(range.startContainer, range.startOffset)
  const start = preCaretRange.toString().length
  return { start, end: start + range.toString().length }
}

function getNearestHeading(node: Node): string | null {
  let el: Element | null =
    node instanceof Element ? node : node.parentElement
  while (el) {
    const prev = el.previousElementSibling
    if (prev && (prev.tagName === 'H2' || prev.tagName === 'H3')) {
      return prev.textContent ?? null
    }
    el = el.parentElement
  }
  return null
}

const POPUP_INITIAL: PopupState = {
  visible: false,
  x: 0,
  y: 0,
  selectedText: '',
  sectionHeading: null,
  charStart: 0,
  charEnd: 0,
  isBelow: false,
}

export default function SelectionPopup({
  onAddNote,
  onHighlight,
  articleRef,
}: SelectionPopupProps) {
  const [popup, setPopup] = useState<PopupState>(POPUP_INITIAL)
  // Track whether pointer is currently down to avoid flicker during drag
  const isPointerDown = useRef(false)

  const hidePopup = useCallback(() => {
    setPopup(POPUP_INITIAL)
  }, [])

  const evaluateSelection = useCallback(() => {
    // Don't evaluate while the pointer is still held down
    if (isPointerDown.current) return

    const selection = window.getSelection()
    const text = selection?.toString().trim() ?? ''

    if (!text || !selection || selection.rangeCount === 0) {
      hidePopup()
      return
    }

    const range = selection.getRangeAt(0)
    const articleEl = articleRef.current

    if (!articleEl) {
      hidePopup()
      return
    }

    // Confirm selection is within the article
    if (!articleEl.contains(range.commonAncestorContainer)) {
      hidePopup()
      return
    }

    const rect = range.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      hidePopup()
      return
    }

    const { start, end } = getCharOffset(range, articleEl)
    const heading = getNearestHeading(range.commonAncestorContainer)

    // On touch devices the native copy/paste bar occupies the space above the
    // selection, so we place our popup below the selection instead.
    const isTouch = navigator.maxTouchPoints > 0
    const popupWidth = 180
    const x = rect.left + rect.width / 2 - popupWidth / 2
    const popupHeight = 44 // approximate height of our popup
    const yAbove = rect.top - popupHeight - 8
    const yBelow = rect.bottom + 8
    // Place below on touch; fall back to above on desktop.
    // If above would clip the top of the viewport, also go below.
    const isBelow = isTouch || yAbove < 8
    const y = isBelow
      ? Math.min(yBelow, window.innerHeight - popupHeight - 8)
      : yAbove

    setPopup({
      visible: true,
      x: Math.max(8, Math.min(x, window.innerWidth - popupWidth - 8)),
      y: Math.max(8, y),
      selectedText: text,
      sectionHeading: heading,
      charStart: start,
      charEnd: end,
      isBelow,
    })
  }, [articleRef, hidePopup])

  const handlePointerDown = useCallback(() => {
    isPointerDown.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    isPointerDown.current = false
    // On touch, wait longer so the native copy bar settles first,
    // letting us measure the final rect before positioning.
    const delay = navigator.maxTouchPoints > 0 ? 120 : 10
    setTimeout(evaluateSelection, delay)
  }, [evaluateSelection])

  const handleSelectionChange = useCallback(() => {
    // Hide immediately when selection collapses
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) {
      hidePopup()
    }
  }, [hidePopup])

  useEffect(() => {
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('touchend', handlePointerUp)
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('touchend', handlePointerUp)
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [handlePointerDown, handlePointerUp, handleSelectionChange])

  const handleHighlightClick = (e: React.MouseEvent, color: NoteColor) => {
    e.preventDefault()
    e.stopPropagation()
    onHighlight(popup.selectedText, popup.sectionHeading, popup.charStart, popup.charEnd, color)
    hidePopup()
    window.getSelection()?.removeAllRanges()
  }

  const handleNoteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddNote(popup.selectedText, popup.sectionHeading, popup.charStart, popup.charEnd)
    hidePopup()
    window.getSelection()?.removeAllRanges()
  }

  if (!popup.visible) return null

  return (
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        top: popup.y,
        left: popup.x,
        zIndex: 40,
        pointerEvents: 'auto',
      }}
      onPointerDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-1 bg-paper shadow-xl rounded-lg px-2 py-1.5 border border-rule">
        {/* Amber highlight */}
        <button
          onClick={(e) => handleHighlightClick(e, 'amber')}
          title="تظليل أصفر"
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-surface transition-colors"
          aria-label="تظليل أصفر"
        >
          <span
            className="w-4 h-4 rounded-sm border border-rule/60"
            style={{ background: 'rgb(254 240 138)' }}
          />
        </button>
        {/* Teal highlight */}
        <button
          onClick={(e) => handleHighlightClick(e, 'teal')}
          title="تظليل أخضر"
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-surface transition-colors"
          aria-label="تظليل أخضر"
        >
          <span
            className="w-4 h-4 rounded-sm border border-rule/60"
            style={{ background: 'rgb(167 243 208)' }}
          />
        </button>
        {/* Divider */}
        <div className="w-px h-5 bg-rule mx-0.5" />
        {/* Add note */}
        <button
          onClick={handleNoteClick}
          title="إضافة ملاحظة"
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-surface transition-colors text-greek"
          aria-label="إضافة ملاحظة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
      {popup.isBelow ? (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full popup-caret-up" />
      ) : (
        <div className="absolute left-1/2 -translate-x-1/2 top-full popup-caret-down" />
      )}
    </div>
  )
}
