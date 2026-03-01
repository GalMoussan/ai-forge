import { NextRequest } from 'next/server'
import { resend, FROM_EMAIL } from '@/lib/email'

export const runtime = 'nodejs'

function verifyWebhookSecret(request: NextRequest): boolean {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '')
  return !!process.env.SUPABASE_WEBHOOK_SECRET && secret === process.env.SUPABASE_WEBHOOK_SECRET
}

interface WebhookPayload {
  type: string
  record: {
    id: string
    title: string
    status: string
    submitter_id: string | null
  }
  old_record: {
    status: string
  }
}

export async function POST(request: NextRequest) {
  if (!verifyWebhookSecret(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await request.json() as WebhookPayload

  if (
    payload.type !== 'UPDATE' ||
    payload.record.status !== 'threshold_reached' ||
    payload.old_record?.status === 'threshold_reached'
  ) {
    return Response.json({ skipped: true })
  }

  if (!resend || !payload.record.submitter_id) {
    console.log('[email] Skipped — no resend client or no submitter_id')
    return Response.json({ skipped: true })
  }

  console.log(`[email] Threshold reached for: "${payload.record.title}" (${payload.record.id})`)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ['builder@example.com'], // TODO: fetch actual email via service role key
      subject: `Your idea "${payload.record.title}" is gaining momentum!`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
          <h2 style="color: #0A0A0A; margin-bottom: 16px;">Your idea is taking off!</h2>
          <p style="color: #6B7280; line-height: 1.6; margin-bottom: 24px;">
            Your AI tool idea <strong style="color: #0A0A0A;">"${payload.record.title}"</strong>
            has reached its vote threshold on AI-Forge.
          </p>
          <a href="https://ai-forge.app/#foundry"
             style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px;
                    border-radius: 8px; text-decoration: none; font-weight: 600;">
            See it on AI-Forge →
          </a>
        </div>
      `,
    })
  } catch (err) {
    console.error('[email] Send failed:', err)
  }

  return Response.json({ sent: true })
}
