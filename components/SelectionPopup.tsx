'use client'
import { useEffect, useState, useCallback, useRef } from 'react'

interface PopupState {
  visible: boolean
  x: number
  y: number
  selectedText: string
  sectionHeading: string | null
  charStart: number
  charEnd: number
}

interface SelectionPopupProps {
  onAddNote: (
    selectedText: string,
    sectionHeading: string | null,
    charStart: number,
    charEnd: number,
  ) => void
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
}

export default function SelectionPopup({
  onAddNote,
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

    // Position above the selection, centred horizontally.
    // rect coords are viewport-relative; we use position:fixed so no scrollY needed.
    const popupWidth = 180
    const x = rect.left + rect.width / 2 - popupWidth / 2
    const y = rect.top - 48 // 48px above selection top

    setPopup({
      visible: true,
      x: Math.max(8, Math.min(x, window.innerWidth - popupWidth - 8)),
      y: Math.max(8, y),
      selectedText: text,
      sectionHeading: heading,
      charStart: start,
      charEnd: end,
    })
  }, [articleRef, hidePopup])

  const handlePointerDown = useCallback(() => {
    isPointerDown.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    isPointerDown.current = false
    // Small delay lets the browser finalise the selection
    setTimeout(evaluateSelection, 10)
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

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddNote(
      popup.selectedText,
      popup.sectionHeading,
      popup.charStart,
      popup.charEnd,
    )
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
      // Prevent the popup itself from collapsing the selection
      onPointerDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-1.5 bg-white shadow-xl rounded-lg px-3 py-2 border border-rule">
        <button
          onClick={handleButtonClick}
          className="flex items-center gap-1.5 text-sm font-medium text-greek hover:text-greek/80 whitespace-nowrap transition-colors"
        >
          <span aria-hidden="true">📝</span>
          <span>إضافة ملاحظة</span>
        </button>
      </div>
      {/* Caret pointer */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full"
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #D8CEBC',
        }}
      />
    </div>
  )
}
