import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function isAdmin(request: NextRequest): boolean {
  const token = request.headers.get('x-admin-token')
  return !!process.env.ADMIN_SECRET && token === process.env.ADMIN_SECRET
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  if (!isAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ideaId } = await params
  const supabase = await createClient()

  const { error } = await supabase
    .from('ideas')
    .update({ is_flagged: true, status: 'flagged' })
    .eq('id', ideaId)

  if (error) {
    console.error('[admin] Flag error:', error)
    return Response.json({ error: 'Could not flag idea' }, { status: 500 })
  }

  return Response.json({ flagged: true })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  if (!isAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ideaId } = await params
  const supabase = await createClient()

  const { error } = await supabase
    .from('ideas')
    .update({ is_flagged: false, status: 'active' })
    .eq('id', ideaId)

  if (error) {
    return Response.json({ error: 'Could not unflag idea' }, { status: 500 })
  }

  return Response.json({ unflagged: true })
}
