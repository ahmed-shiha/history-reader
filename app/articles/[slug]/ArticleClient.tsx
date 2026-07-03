'use client'
import { useRef, useState, useCallback } from 'react'
import type { ArticleMeta, Note, CreateNoteInput } from '@/lib/types'
import { useNotes } from '@/hooks/useNotes'
import SelectionPopup from '@/components/SelectionPopup'
import NoteModal from '@/components/NoteModal'
import ArticleHighlighter from '@/components/ArticleHighlighter'
import NotesSidebar from '@/components/NotesSidebar'

interface ArticleClientProps {
  slug: string
  meta: ArticleMeta
  children: React.ReactNode
}

interface PendingNote {
  selectedText: string
  sectionHeading: string | null
  charStart: number
  charEnd: number
}

interface ModalState {
  isOpen: boolean
  pending: PendingNote | null
  editingNote: Note | null
}

const AUTHOR_STYLE_LABELS: Record<string, string> = {
  classical: 'أسلوب كلاسيكي',
  modern: 'أسلوب حديث',
  analytical: 'تحليلي',
  narrative: 'سردي',
}

export default function ArticleClient({
  slug,
  meta,
  children,
}: ArticleClientProps) {
  const { notes, addNote, deleteNote, updateNote } = useNotes(slug)
  const articleRef = useRef<HTMLDivElement>(null)
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    pending: null,
    editingNote: null,
  })

  // ── Open modal to create a new note ──────────────────────────────────────
  const handleAddNote = useCallback(
    (
      selectedText: string,
      sectionHeading: string | null,
      charStart: number,
      charEnd: number,
    ) => {
      setModalState({
        isOpen: true,
        pending: { selectedText, sectionHeading, charStart, charEnd },
        editingNote: null,
      })
    },
    [],
  )

  // ── Save a new note ───────────────────────────────────────────────────────
  const handleSaveNewNote = useCallback(
    async (noteContent: string) => {
      if (!modalState.pending) return
      const { selectedText, sectionHeading, charStart, charEnd } =
        modalState.pending

      const input: CreateNoteInput = {
        article_slug: slug,
        selected_text: selectedText,
        note_content: noteContent,
        section_heading: sectionHeading ?? undefined,
        char_start: charStart,
        char_end: charEnd,
      }

      const saved = await addNote(input)
      if (saved) setActiveNoteId(saved.id)
      setModalState({ isOpen: false, pending: null, editingNote: null })
    },
    [modalState.pending, slug, addNote],
  )

  // ── Open modal to edit an existing note ──────────────────────────────────
  const handleEditNote = useCallback((note: Note) => {
    setModalState({ isOpen: true, pending: null, editingNote: note })
  }, [])

  // ── Save edits to an existing note ────────────────────────────────────────
  const handleSaveEditedNote = useCallback(
    async (noteContent: string) => {
      if (!modalState.editingNote) return
      await updateNote(modalState.editingNote.id, noteContent)
      setModalState({ isOpen: false, pending: null, editingNote: null })
    },
    [modalState.editingNote, updateNote],
  )

  const handleCloseModal = useCallback(() => {
    setModalState({ isOpen: false, pending: null, editingNote: null })
  }, [])

  // ── Unified modal save handler ────────────────────────────────────────────
  const handleModalSave = useCallback(
    (content: string) => {
      if (modalState.editingNote) {
        handleSaveEditedNote(content)
      } else {
        handleSaveNewNote(content)
      }
    },
    [modalState.editingNote, handleSaveEditedNote, handleSaveNewNote],
  )

  // ── Click on highlighted note → scroll into view + activate ──────────────
  const handleNoteClick = useCallback((note: Note) => {
    setActiveNoteId(note.id)
    const markEl = document.querySelector(`[data-note-id="${note.id}"]`)
    markEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const isEditing = Boolean(modalState.editingNote)
  const modalSelectedText =
    modalState.editingNote?.selected_text ?? modalState.pending?.selectedText ?? ''
  const modalInitialContent = modalState.editingNote?.note_content ?? ''

  return (
    <div className="flex min-h-screen">
      {/* Notes sidebar */}
      <NotesSidebar
        notes={notes}
        onNoteClick={handleNoteClick}
        onDeleteNote={deleteNote}
        onEditNote={handleEditNote}
        activeNoteId={activeNoteId}
        articleSlug={slug}
      />

      {/* Main reading area — offset from right-side sidebar on desktop */}
      <main className="flex-1 lg:mr-72 px-4 sm:px-8 lg:px-12 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Article header */}
          <header className="mb-10 pb-8 border-b border-rule">
            {/* Author style chip */}
            <span className="inline-block text-xs font-medium bg-greek-light text-greek px-3 py-1 rounded-full mb-4">
              {AUTHOR_STYLE_LABELS[meta.author_style] ?? meta.author_style}
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-4">
              {meta.title}
            </h1>

            {meta.description && (
              <p className="text-base text-ink-mid leading-relaxed mb-4">
                {meta.description}
              </p>
            )}

            {/* Date */}
            {meta.date && (
              <time
                dateTime={meta.date}
                className="text-sm text-ink-lt"
              >
                {new Date(meta.date).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}

            {/* Usage hint */}
            <div className="mt-5 flex items-center gap-2 text-xs text-ink-lt bg-surface rounded-lg px-4 py-2.5 border border-rule w-fit">
              <span aria-hidden="true">💡</span>
              <span>حدِّد أيَّ نصٍّ لإضافة ملاحظة</span>
            </div>
          </header>

          {/* Article body */}
          <div
            ref={articleRef}
            className="article-prose"
            dir="rtl"
          >
            {children}
          </div>

          {/* Selection popup — fixed-position, floats above selected text */}
          <SelectionPopup
            onAddNote={handleAddNote}
            articleRef={articleRef}
          />

          {/* Highlight existing notes */}
          <ArticleHighlighter
            notes={notes}
            articleRef={articleRef}
            onNoteClick={handleNoteClick}
            activeNoteId={activeNoteId}
          />
        </div>
      </main>

      {/* Note modal */}
      <NoteModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleModalSave}
        selectedText={modalSelectedText}
        initialContent={modalInitialContent}
        isEditing={isEditing}
      />
    </div>
  )
}
