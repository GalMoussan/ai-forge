import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { ideaId: string } }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 })
  }

  await supabase
    .from('supports')
    .delete()
    .eq('idea_id', params.ideaId)
    .eq('user_id', user.id)
    .eq('type', 'vote')

  const { data: idea } = await supabase
    .from('ideas')
    .select('vote_count')
    .eq('id', params.ideaId)
    .single()

  return Response.json({ data: { vote_count: idea?.vote_count ?? 0 } })
}
