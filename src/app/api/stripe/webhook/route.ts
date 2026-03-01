import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!stripe) {
    return Response.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: `Webhook signature verification failed: ${msg}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    await handleCheckoutComplete(session)
  }

  return Response.json({ received: true })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { idea_id, user_id } = session.metadata ?? {}
  const amountTotal = session.amount_total ?? 0

  if (!idea_id || !user_id) return

  const supabase = createServiceClient()

  // Fetch current idea state
  const { data: idea } = await supabase
    .from('ideas')
    .select('funding_raised, funding_goal, backer_count, status')
    .eq('id', idea_id)
    .single()

  if (!idea) return

  const newFundingRaised = ((idea.funding_raised as number) ?? 0) + amountTotal
  const newBackerCount = ((idea.backer_count as number) ?? 0) + 1
  const hitThreshold =
    idea.funding_goal &&
    newFundingRaised >= (idea.funding_goal as number) &&
    idea.status === 'active'

  // Insert support record (idempotent: unique stripe_session_id will fail silently on duplicate)
  await supabase.from('supports').insert({
    idea_id,
    user_id,
    type: 'pledge' as const,
    amount: amountTotal,
    stripe_session_id: session.id,
  }).select()

  // Update idea funding totals
  await supabase
    .from('ideas')
    .update({
      funding_raised: newFundingRaised,
      backer_count: newBackerCount,
      ...(hitThreshold ? { status: 'threshold_reached' as const } : {}),
    })
    .eq('id', idea_id)
}
