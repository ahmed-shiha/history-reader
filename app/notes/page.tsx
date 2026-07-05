'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import type { Note } from '@/lib/types'

// ─── Source label helpers ─────────────────────────────────────────────────────
// Book chapter keys use the format: "book:bookSlug/chapterSlug"
function isBookKey(slug: string) {
  return slug.startsWith('book:')
}

function getSourceLabel(slug: string): string {
  if (isBookKey(slug)) {
    // "book:to-explain-the-world/chapter-1" → "chapter-1"
    const rest = slug.replace(/^book:/, '')
    const parts = rest.split('/')
    return parts[parts.length - 1] ?? rest
  }
  return slug
}

function getSourceHref(slug: string): string {
  if (isBookKey(slug)) {
    // "book:to-explain-the-world/chapter-1" → "/books/to-explain-the-world/chapter-1"
    return `/books/${slug.replace(/^book:/, '')}`
  }
  return `/articles/${slug}`
}

function getSourceIcon(slug: string): string {
  return isBookKey(slug) ? '📚' : '📄'
}

function slugToAnchor(heading: string | null): string {
  if (!heading) return ''
  return (
    '#' +
    heading
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w؀-ۿ-]/g, '')
  )
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

// ─── Fetcher ──────────────────────────────────────────────────────────────────
const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((d) => d.notes as Note[])

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-paper border border-rule rounded-xl p-4 animate-pulse space-y-3">
      <div className="h-3 bg-rule rounded w-1/3" />
      <div className="h-12 bg-yellow-50 rounded border-r-2 border-yellow-200" />
      <div className="space-y-1.5">
        <div className="h-3 bg-rule rounded w-full" />
        <div className="h-3 bg-rule rounded w-4/5" />
      </div>
      <div className="h-3 bg-rule rounded w-1/4" />
    </div>
  )
}

// ─── Individual note card ─────────────────────────────────────────────────────
function NoteCard({
  note,
  onDelete,
}: {
  note: Note
  onDelete: (id: string) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const articleAnchor =
    getSourceHref(note.article_slug) + slugToAnchor(note.section_heading)

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(note.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <article className="bg-paper border border-rule rounded-xl p-4 hover:border-ink-lt transition-colors">
      {/* Section heading */}
      {note.section_heading && (
        <p className="text-xs text-greek font-medium mb-2 flex items-center gap-1">
          <span aria-hidden="true">📍</span>
          {note.section_heading}
        </p>
      )}

      {/* Highlighted selected text */}
      <blockquote
        dir="rtl"
        className="border-r-4 border-yellow-400 bg-yellow-50 pr-3 py-2 rounded-l text-sm text-ink-mid leading-relaxed mb-3"
      >
        {note.selected_text}
      </blockquote>

      {/* Note content */}
      <p className="text-sm text-ink leading-relaxed mb-3">{note.note_content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-rule/60">
        <time className="text-xs text-ink-lt" dateTime={note.created_at}>
          {formatArabicDate(note.created_at)}
        </time>

        <div className="flex items-center gap-2">
          <Link
            href={articleAnchor}
            className="text-xs text-greek hover:underline flex items-center gap-1"
          >
            <span aria-hidden="true">↗</span>
            <span>اذهب إلى المقالة</span>
          </Link>

          <button
            onClick={handleDelete}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              confirmDelete
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'text-ink-lt hover:text-red-500'
            }`}
            aria-label="حذف الملاحظة"
          >
            {confirmDelete ? '⚠️ تأكيد الحذف' : '🗑️'}
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NotesPage() {
  const [sort, setSort] = useState<'desc' | 'asc'>('desc')

  const { data: notes, isLoading, mutate } = useSWR<Note[]>(
    `/api/notes?sort=${sort}`,
    fetcher,
  )

  const grouped = useMemo(() => {
    if (!notes) return {}
    return notes.reduce<Record<string, Note[]>>((acc, note) => {
      const key = note.article_slug
      if (!acc[key]) acc[key] = []
      acc[key].push(note)
      return acc
    }, {})
  }, [notes])

  const totalCount = notes?.length ?? 0

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Page header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-ink mb-1">
              جميع الملاحظات
            </h1>
            {!isLoading && (
              <p className="text-sm text-ink-lt">
                {totalCount === 0
                  ? 'لا توجد ملاحظات بعد'
                  : `${totalCount} ملاحظة`}
              </p>
            )}
          </div>

          {/* Sort toggle */}
          <div className="flex items-center gap-1 bg-surface rounded-lg p-1 border border-rule">
            <button
              onClick={() => setSort('desc')}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                sort === 'desc'
                  ? 'bg-white shadow-sm text-ink font-medium border border-rule'
                  : 'text-ink-lt hover:text-ink'
              }`}
            >
              الأحدث أولاً
            </button>
            <button
              onClick={() => setSort('asc')}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                sort === 'asc'
                  ? 'bg-white shadow-sm text-ink font-medium border border-rule'
                  : 'text-ink-lt hover:text-ink'
              }`}
            >
              الأقدم أولاً
            </button>
          </div>
        </div>
      </header>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && totalCount === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-ink-mid leading-relaxed text-base mb-6">
            لا توجد ملاحظات بعد
            <br />
            <span className="text-ink-lt text-sm">
              ابدأ بقراءة مقالة وميِّز ما يُثير اهتمامك
            </span>
          </p>
          <Link
            href="/"
            className="inline-block bg-greek text-paper text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-greek/90 transition-colors"
          >
            استعرض المقالات
          </Link>
        </div>
      )}

      {/* Notes grouped by article */}
      {!isLoading && totalCount > 0 && (
        <div className="space-y-10">
          {Object.entries(grouped).map(([slug, articleNotes]) => (
            <section key={slug}>
              {/* Source section header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-base" aria-hidden="true">
                  {getSourceIcon(slug)}
                </span>
                <Link
                  href={getSourceHref(slug)}
                  className="text-base font-bold text-ink hover:text-greek transition-colors"
                >
                  {getSourceLabel(slug)}
                </Link>
                <span className="text-xs text-ink-lt bg-surface px-2 py-0.5 rounded-full border border-rule">
                  {articleNotes.length} ملاحظة
                </span>
              </div>

              <div className="space-y-3">
                {articleNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
