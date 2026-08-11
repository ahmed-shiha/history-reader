import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/reading-progress?days=30
// GET /api/reading-progress?book_slug=X&chapter_slug=Y&latest=true  → single most-recent record
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const bookSlug    = searchParams.get('book_slug')
    const chapterSlug = searchParams.get('chapter_slug')
    const latest      = searchParams.get('latest') === 'true'

    // ── Latest record for a specific chapter ──────────────────────
    if (latest && bookSlug && chapterSlug) {
      const { data, error } = await getSupabase()
        .from('reading_progress')
        .select('*')
        .eq('book_slug', bookSlug)
        .eq('chapter_slug', chapterSlug)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ record: data })
    }

    // ── Last N days (stats page) ──────────────────────────────────
    const days = parseInt(searchParams.get('days') ?? '60', 10)
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString().slice(0, 10)

    const { data, error } = await getSupabase()
      .from('reading_progress')
      .select('*')
      .gte('date', sinceStr)
      .order('date', { ascending: false })
      .order('updated_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ records: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/reading-progress
// Body: { date, book_slug, chapter_slug, book_title, chapter_title, words_read, scroll_pct, char_offset?, total_chars? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, book_slug, chapter_slug, book_title, chapter_title, words_read, scroll_pct, char_offset, total_chars } = body

    if (!date || !book_slug || !chapter_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      date,
      book_slug,
      chapter_slug,
      book_title:    book_title    ?? '',
      chapter_title: chapter_title ?? '',
      words_read:    Math.max(0, Math.round(words_read ?? 0)),
      scroll_pct:    Math.min(1, Math.max(0, scroll_pct ?? 0)),
      char_offset:   Math.max(0, Math.round(char_offset ?? 0)),
      total_chars:   Math.max(0, Math.round(total_chars ?? 0)),
      updated_at:    new Date().toISOString(),
    }

    const { data, error } = await getSupabase()
      .from('reading_progress')
      .upsert(payload, { onConflict: 'date,book_slug,chapter_slug' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ record: data }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
