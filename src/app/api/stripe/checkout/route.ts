import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const CheckoutSchema = z.object({
  idea_id: z.string().uuid(),
  amount_cents: z.number().int().min(100).max(100000),
})

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== 'true') {
    return Response.json({ error: 'Payments not yet enabled' }, { status: 503 })
  }

  if (!stripe) {
    return Response.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json() as unknown
  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 422 })

  const { idea_id, amount_cents } = parsed.data

  const { data: idea } = await supabase
    .from('ideas')
    .select('id, title')
    .eq('id', idea_id)
    .single()

  if (!idea) return Response.json({ error: 'Idea not found' }, { status: 404 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-forge.app'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: amount_cents,
          product_data: {
            name: `Back "${idea.title}"`,
            description: 'AI-Forge community pledge — charged only if funding goal is reached.',
          },
        },
      },
    ],
    metadata: {
      idea_id,
      user_id: user.id,
    },
    success_url: `${siteUrl}/?pledge=success&idea=${idea_id}`,
    cancel_url: `${siteUrl}/?pledge=cancelled&idea=${idea_id}`,
  })

  return Response.json({ url: session.url })
}
