import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: { ideaId: string } }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)')
    .eq('idea_id', params.ideaId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })

  if (error) {
    return Response.json({ error: 'Could not load comments' }, { status: 500 })
  }

  // Fetch replies for each root comment
  const withReplies = await Promise.all(
    (data ?? []).map(async (comment) => {
      const { data: replies } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true })
      return { ...comment, replies: replies ?? [] }
    })
  )

  return Response.json({ data: withReplies })
}
