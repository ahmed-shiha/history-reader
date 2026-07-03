'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
  selectedText: string
  initialContent?: string
  isEditing?: boolean
}

export default function NoteModal({
  isOpen,
  onClose,
  onSave,
  selectedText,
  initialContent = '',
  isEditing = false,
}: NoteModalProps) {
  const [content, setContent] = useState(initialContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync content when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent)
      // Focus textarea after mount animation
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen, initialContent])

  // ESC key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const handleSave = () => {
    const trimmed = content.trim()
    if (!trimmed) return
    onSave(trimmed)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'تعديل الملاحظة' : 'إضافة ملاحظة'}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal card */}
      <div className="relative z-10 w-full sm:max-w-lg bg-paper rounded-t-2xl sm:rounded-2xl shadow-2xl border border-rule flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-rule">
          <h2 className="text-base font-bold text-ink">
            {isEditing ? 'تعديل الملاحظة' : 'إضافة ملاحظة'}
          </h2>
          <button
            onClick={onClose}
            className="text-ink-lt hover:text-ink transition-colors rounded-md p-1 hover:bg-surface"
            aria-label="إغلاق"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Selected text preview */}
          <div>
            <p className="text-xs text-ink-lt mb-1.5">النص المحدَّد</p>
            <blockquote
              dir="rtl"
              className="border-r-4 border-yellow-400 bg-yellow-50 px-4 py-3 rounded-l-md text-sm text-ink-mid leading-relaxed line-clamp-4"
            >
              {selectedText}
            </blockquote>
          </div>

          {/* Note textarea */}
          <div>
            <label
              htmlFor="note-content"
              className="text-xs text-ink-lt mb-1.5 block"
            >
              ملاحظتك
            </label>
            <textarea
              id="note-content"
              ref={textareaRef}
              dir="rtl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب ملاحظتك هنا…"
              className="w-full min-h-[120px] resize-y rounded-lg border border-rule bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-lt leading-relaxed focus:outline-none focus:ring-2 focus:ring-greek/40 focus:border-greek transition-colors font-arabic"
              onKeyDown={(e) => {
                // Ctrl/Cmd + Enter submits
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault()
                  handleSave()
                }
              }}
            />
            <p className="text-xs text-ink-lt mt-1">
              اضغط Ctrl+Enter للحفظ السريع
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-rule">
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="flex-1 bg-greek text-paper font-bold text-sm py-2.5 px-4 rounded-lg hover:bg-greek/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isEditing ? 'حفظ التعديل' : 'حفظ الملاحظة'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-surface text-ink-mid font-medium text-sm py-2.5 px-4 rounded-lg hover:bg-rule transition-colors border border-rule"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
