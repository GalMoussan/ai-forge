import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

const VoteSchema = z.object({
  idea_id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = VoteSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { error } = await supabase
    .from('supports')
    .insert({ idea_id: parsed.data.idea_id, user_id: user.id, type: 'vote' })

  // Handle duplicate vote gracefully (idempotent)
  if (error && error.code !== '23505') {
    return Response.json({ error: 'Could not record your support' }, { status: 500 })
  }

  // Return updated vote count
  const { data: idea } = await supabase
    .from('ideas')
    .select('vote_count')
    .eq('id', parsed.data.idea_id)
    .single()

  return Response.json({ data: { vote_count: idea?.vote_count ?? 0 } })
}
