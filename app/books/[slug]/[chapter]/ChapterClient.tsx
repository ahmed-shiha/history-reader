'use client'
import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import type { ChapterMeta, Note, CreateNoteInput } from '@/lib/types'
import { useNotes } from '@/hooks/useNotes'
import SelectionPopup from '@/components/SelectionPopup'
import NoteModal from '@/components/NoteModal'
import ArticleHighlighter from '@/components/ArticleHighlighter'
import NotesSidebar from '@/components/NotesSidebar'

interface ChapterClientProps {
  bookSlug: string
  chapterSlug: string
  meta: ChapterMeta
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

// Notes stored with "book:bookSlug/chapterSlug" key — no DB changes needed.
function chapterNoteKey(bookSlug: string, chapterSlug: string) {
  return `book:${bookSlug}/${chapterSlug}`
}

export default function ChapterClient({
  bookSlug,
  chapterSlug,
  meta,
  children,
}: ChapterClientProps) {
  const noteKey = chapterNoteKey(bookSlug, chapterSlug)
  const { notes, addNote, deleteNote, updateNote } = useNotes(noteKey)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    pending: null,
    editingNote: null,
  })

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

  const handleSaveNewNote = useCallback(
    async (noteContent: string) => {
      if (!modalState.pending) return
      const { selectedText, sectionHeading, charStart, charEnd } = modalState.pending

      const input: CreateNoteInput = {
        article_slug: noteKey,
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
    [modalState.pending, noteKey, addNote],
  )

  const handleEditNote = useCallback((note: Note) => {
    setModalState({ isOpen: true, pending: null, editingNote: note })
  }, [])

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

  const handleModalSave = useCallback(
    (content: string) => {
      if (modalState.editingNote) handleSaveEditedNote(content)
      else handleSaveNewNote(content)
    },
    [modalState.editingNote, handleSaveEditedNote, handleSaveNewNote],
  )

  const handleNoteClick = useCallback((note: Note) => {
    setActiveNoteId(note.id)
    document
      .querySelector(`[data-note-id="${note.id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const isEditing = Boolean(modalState.editingNote)
  const modalSelectedText =
    modalState.editingNote?.selected_text ?? modalState.pending?.selectedText ?? ''
  const modalInitialContent = modalState.editingNote?.note_content ?? ''

  return (
    <div className="flex min-h-screen">
      <NotesSidebar
        notes={notes}
        onNoteClick={handleNoteClick}
        onDeleteNote={deleteNote}
        onEditNote={handleEditNote}
        activeNoteId={activeNoteId}
        articleSlug={noteKey}
      />

      <main className="flex-1 lg:mr-72 px-4 sm:px-8 lg:px-12 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Chapter header */}
          <header className="mb-10 pb-8 border-b border-rule">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-ink-lt mb-5">
              <Link href="/books" className="hover:text-greek transition-colors">
                الكتب
              </Link>
              <span aria-hidden="true">›</span>
              <Link
                href={`/books/${bookSlug}`}
                className="hover:text-greek transition-colors"
              >
                {meta.book_title}
              </Link>
            </nav>

            {meta.author && (
              <span className="inline-block text-xs font-medium bg-modern-light text-modern px-3 py-1 rounded-full mb-4">
                {meta.author}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-4">
              {meta.title}
            </h1>

            {meta.description && (
              <p className="text-base text-ink-mid leading-relaxed mb-4">
                {meta.description}
              </p>
            )}

            {meta.date && (
              <time dateTime={meta.date} className="text-sm text-ink-lt">
                {new Date(meta.date).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}

            <div className="mt-5 flex items-center gap-2 text-xs text-ink-lt bg-surface rounded-lg px-4 py-2.5 border border-rule w-fit">
              <span aria-hidden="true">💡</span>
              <span>حدِّد أيَّ نصٍّ لإضافة ملاحظة</span>
            </div>
          </header>

          {/* Chapter body */}
          <div ref={contentRef} className="article-prose" dir="rtl">
            {children}
          </div>

          <SelectionPopup onAddNote={handleAddNote} articleRef={contentRef} />
          <ArticleHighlighter
            notes={notes}
            articleRef={contentRef}
            onNoteClick={handleNoteClick}
            activeNoteId={activeNoteId}
          />
        </div>
      </main>

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
