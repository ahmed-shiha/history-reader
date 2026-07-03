'use client'
import useSWR from 'swr'
import type { Note, CreateNoteInput } from '@/lib/types'

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((d) => d.notes as Note[])

export function useNotes(articleSlug?: string) {
  const url = articleSlug
    ? `/api/notes?article_slug=${encodeURIComponent(articleSlug)}`
    : '/api/notes'

  const { data, error, isLoading, mutate } = useSWR<Note[]>(url, fetcher)

  async function addNote(input: CreateNoteInput): Promise<Note | null> {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const json = await res.json()
      if (json.note) {
        await mutate()
        return json.note as Note
      }
      return null
    } catch (err) {
      console.error('[useNotes] addNote error:', err)
      return null
    }
  }

  async function deleteNote(id: string): Promise<void> {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      await mutate()
    } catch (err) {
      console.error('[useNotes] deleteNote error:', err)
    }
  }

  async function updateNote(id: string, note_content: string): Promise<void> {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_content }),
      })
      await mutate()
    } catch (err) {
      console.error('[useNotes] updateNote error:', err)
    }
  }

  return {
    notes: data ?? [],
    isLoading,
    error,
    addNote,
    deleteNote,
    updateNote,
  }
}
