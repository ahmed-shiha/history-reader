import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import type { Note } from '@/lib/types'

export const dynamic = 'force-dynamic'

type RouteContext = { params: { id: string } }

// DELETE /api/notes/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params

    const { error } = await getSupabase()
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PATCH /api/notes/[id]
// Body: { note_content: string }
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params
    const body: { note_content?: string } = await request.json()

    if (!body.note_content) {
      return NextResponse.json(
        { error: 'Missing required field: note_content' },
        { status: 400 }
      )
    }

    const { data, error } = await getSupabase()
      .from('notes')
      .update({
        note_content: body.note_content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json({ note: data as Note })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
