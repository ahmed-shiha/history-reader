'use client'
import { useState } from 'react'
import type { Note } from '@/lib/types'

interface NotesSidebarProps {
  notes: Note[]
  onNoteClick: (note: Note) => void
  onDeleteNote: (id: string) => void
  onEditNote: (note: Note) => void
  activeNoteId?: string | null
  articleSlug: string
}

function formatArabicDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function NoteCard({
  note,
  isActive,
  onNoteClick,
  onDeleteNote,
  onEditNote,
}: {
  note: Note
  isActive: boolean
  onNoteClick: (n: Note) => void
  onDeleteNote: (id: string) => void
  onEditNote: (n: Note) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmDelete) {
      onDeleteNote(note.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEditNote(note)
  }

  return (
    <article
      onClick={() => onNoteClick(note)}
      className={`cursor-pointer rounded-xl p-3.5 mb-3 border transition-all hover:shadow-md ${
        isActive
          ? 'border-greek border-2 bg-greek-light'
          : 'border-rule bg-paper hover:border-ink-lt'
      }`}
    >
      {/* Section heading */}
      {note.section_heading && (
        <p className="text-xs text-greek font-medium mb-1.5 truncate">
          📍 {note.section_heading}
        </p>
      )}

      {/* Selected text quote */}
      <blockquote
        dir="rtl"
        className="border-r-2 border-yellow-400 bg-yellow-50 pr-2.5 py-1 text-xs text-ink-mid leading-relaxed line-clamp-2 mb-2"
      >
        {note.selected_text}
      </blockquote>

      {/* Note content */}
      <p className="text-sm text-ink leading-relaxed line-clamp-3">
        {note.note_content}
      </p>

      {/* Footer: date + actions */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-rule/60">
        <time className="text-xs text-ink-lt" dateTime={note.created_at}>
          {formatArabicDate(note.created_at)}
        </time>
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="text-ink-lt hover:text-greek p-1 rounded transition-colors"
            aria-label="تعديل الملاحظة"
            title="تعديل"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className={`p-1 rounded transition-colors ${
              confirmDelete
                ? 'text-red-600 bg-red-50'
                : 'text-ink-lt hover:text-red-500'
            }`}
            aria-label="حذف الملاحظة"
            title={confirmDelete ? 'اضغط مرة أخرى للتأكيد' : 'حذف'}
          >
            {confirmDelete ? '⚠️' : '🗑️'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function NotesSidebar({
  notes,
  onNoteClick,
  onDeleteNote,
  onEditNote,
  activeNoteId,
}: NotesSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-rule sticky top-0 bg-surface z-10">
        <h2 className="font-bold text-sm text-ink">
          الملاحظات{' '}
          <span className="text-ink-lt font-normal">({notes.length})</span>
        </h2>
        {/* Mobile close button */}
        <button
          className="lg:hidden text-ink-lt hover:text-ink p-1"
          onClick={() => setMobileOpen(false)}
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

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-4">
        {notes.length === 0 ? (
          <div className="text-center py-10 text-ink-lt">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-sm leading-relaxed">
              لا توجد ملاحظات بعد
              <br />
              <span className="text-xs">حدِّد أيَّ نصٍّ لإضافة ملاحظة</span>
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onNoteClick={onNoteClick}
              onDeleteNote={onDeleteNote}
              onEditNote={onEditNote}
            />
          ))
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — fixed on the left (start) side */}
      <aside className="hidden lg:block fixed top-14 bottom-0 right-0 w-72 bg-surface border-l border-rule overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile: floating toggle button */}
      <button
        className="lg:hidden fixed bottom-5 left-4 z-40 bg-greek text-paper w-12 h-12 rounded-full shadow-xl flex items-center justify-center"
        onClick={() => setMobileOpen(true)}
        aria-label={`الملاحظات (${notes.length})`}
      >
        <span className="text-lg" aria-hidden="true">
          📋
        </span>
        {notes.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-ink text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {notes.length > 9 ? '9+' : notes.length}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Slide-up panel */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl shadow-2xl max-h-[65vh] flex flex-col">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-rule" />
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </div>
        </>
      )}
    </>
  )
}
