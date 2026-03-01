'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

interface PledgeButtonProps {
  ideaId: string
  defaultAmountCents?: number
}

export function PledgeButton({ ideaId, defaultAmountCents = 500 }: PledgeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== 'true') return null

  async function handlePledge() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: ideaId, amount_cents: defaultAmountCents }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Failed to start checkout')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handlePledge}
        disabled={loading}
        aria-label="Pledge to back this idea"
        className="w-full"
      >
        {loading ? 'Redirecting…' : `Pledge $${(defaultAmountCents / 100).toFixed(0)}`}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
