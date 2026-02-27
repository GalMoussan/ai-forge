import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

const CreateIdeaSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  category: z.enum(['automation', 'creativity', 'productivity', 'analysis', 'other']),
  tags: z.array(z.string().max(50)).max(10).default([]),
})

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const sort = searchParams.get('sort') ?? 'votes'
  const category = searchParams.get('category')

  let query = supabase
    .from('ideas')
    .select('*, profiles(username, avatar_url)')
    .eq('status', 'active')
    .order(sort === 'newest' ? 'created_at' : 'vote_count', { ascending: false })
    .limit(50)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: 'Could not load ideas' }, { status: 500 })
  }

  return Response.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = CreateIdeaSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { data, error } = await supabase
    .from('ideas')
    .insert({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      tags: parsed.data.tags,
      submitter_id: user.id,
    })
    .select('*, profiles(username, avatar_url)')
    .single()

  if (error) {
    console.error('ideas insert:', error)
    return Response.json({ error: 'Could not save — please try again' }, { status: 500 })
  }

  return Response.json({ data }, { status: 201 })
}
