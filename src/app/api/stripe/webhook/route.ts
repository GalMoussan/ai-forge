export async function POST() {
  // T018 will implement Stripe webhook processing
  return Response.json({ received: true })
}
