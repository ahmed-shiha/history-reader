import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import type { Note, CreateNoteInput } from '@/lib/types'

export const dynamic = 'force-dynamic'

// GET /api/notes
// GET /api/notes?article_slug=xxx
// GET /api/notes?article_slug=xxx&sort=asc
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const articleSlug = searchParams.get('article_slug')
    const sort = searchParams.get('sort') === 'asc' ? 'asc' : 'desc'

    let query = getSupabase()
      .from('notes')
      .select('*')
      .order('created_at', { ascending: sort === 'asc' })

    if (articleSlug) {
      query = query.eq('article_slug', articleSlug)
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ notes: data as Note[] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/notes
export async function POST(request: NextRequest) {
  try {
    const body: CreateNoteInput = await request.json()

    if (!body.article_slug || !body.selected_text) {
      return NextResponse.json(
        { error: 'Missing required fields: article_slug, selected_text' },
        { status: 400 }
      )
    }

    const { data, error } = await getSupabase()
      .from('notes')
      .insert({
        article_slug:    body.article_slug,
        selected_text:   body.selected_text,
        note_content:    body.note_content    ?? '',
        section_heading: body.section_heading ?? null,
        char_start:      body.char_start      ?? null,
        char_end:        body.char_end        ?? null,
        color:           body.color           ?? 'amber',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ note: data as Note }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
