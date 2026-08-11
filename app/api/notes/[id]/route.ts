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
    const { error } = await getSupabase().rpc('delete_note', { p_id: id })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
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

    const { data, error } = await getSupabase().rpc('update_note', {
      p_id: id,
      p_note_content: body.note_content ?? '',
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ note: data as Note })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
