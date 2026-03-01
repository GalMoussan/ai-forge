'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function LiveBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    const userId = crypto.randomUUID()

    const channel = supabase.channel('foundry-presence', {
      config: { presence: { key: userId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setCount(Object.keys(state).length)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: Date.now() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (count < 2) return null

  return (
    <span
      className="inline-flex items-center gap-1.5 text-body-sm text-text-muted"
      aria-label={`${count} people currently viewing`}
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      {count} watching
    </span>
  )
}
