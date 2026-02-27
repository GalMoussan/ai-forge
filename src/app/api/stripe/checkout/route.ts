import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const CheckoutSchema = z.object({
  idea_id: z.string().uuid(),
  amount_cents: z.number().int().min(100).max(100000),
})

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== 'true') {
    return Response.json({ error: 'Payments not yet enabled' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json() as unknown
  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 422 })

  // T017 will implement the actual Stripe session creation here
  return Response.json({ error: 'Payment processing not yet activated' }, { status: 503 })
}
