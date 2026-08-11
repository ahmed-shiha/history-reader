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

    const { data, error } = await getSupabase().rpc('get_notes', {
      p_article_slug: articleSlug ?? null,
      p_sort: sort,
    })

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

    const { data, error } = await getSupabase().rpc('insert_note', {
      p_article_slug:   body.article_slug,
      p_selected_text:  body.selected_text,
      p_note_content:   body.note_content  ?? '',
      p_section_heading: body.section_heading ?? null,
      p_char_start:     body.char_start ?? null,
      p_char_end:       body.char_end   ?? null,
      p_color:          body.color      ?? 'amber',
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ note: data as Note }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
