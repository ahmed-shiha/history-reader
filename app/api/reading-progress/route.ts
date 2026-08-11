import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/reading-progress?days=30
// GET /api/reading-progress?book_slug=X&chapter_slug=Y&latest=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const bookSlug    = searchParams.get('book_slug')
    const chapterSlug = searchParams.get('chapter_slug')
    const latest      = searchParams.get('latest') === 'true'
    const days        = parseInt(searchParams.get('days') ?? '60', 10)

    const { data, error } = await getSupabase().rpc('get_reading_progress', {
      p_days:         days,
      p_book_slug:    bookSlug ?? null,
      p_chapter_slug: chapterSlug ?? null,
      p_latest:       latest,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (latest) {
      return NextResponse.json({ record: data?.[0] ?? null })
    }
    return NextResponse.json({ records: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/reading-progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, book_slug, chapter_slug, book_title, chapter_title, words_read, scroll_pct, char_offset, total_chars } = body

    if (!date || !book_slug || !chapter_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await getSupabase().rpc('upsert_reading_progress', {
      p_date:          date,
      p_book_slug:     book_slug,
      p_chapter_slug:  chapter_slug,
      p_book_title:    book_title    ?? '',
      p_chapter_title: chapter_title ?? '',
      p_words_read:    Math.max(0, Math.round(words_read  ?? 0)),
      p_scroll_pct:    Math.min(1, Math.max(0, scroll_pct ?? 0)),
      p_char_offset:   Math.max(0, Math.round(char_offset ?? 0)),
      p_total_chars:   Math.max(0, Math.round(total_chars ?? 0)),
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ record: data }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
