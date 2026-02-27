import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

const CreateCommentSchema = z.object({
  idea_id: z.string().uuid(),
  content: z.string().min(1).max(2000),
  parent_id: z.string().uuid().nullable().optional(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = CreateCommentSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      idea_id: parsed.data.idea_id,
      content: parsed.data.content,
      parent_id: parsed.data.parent_id ?? null,
      user_id: user.id,
    })
    .select('*, profiles(username, avatar_url)')
    .single()

  if (error) {
    return Response.json({ error: 'Could not post comment' }, { status: 500 })
  }

  return Response.json({ data }, { status: 201 })
}
