'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Idea } from '@/types/database'

export function useRealtimeIdeas(initialIdeas: Idea[]) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('ideas-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'ideas' },
        (payload) => {
          setIdeas(current =>
            current.map(idea =>
              idea.id === (payload.new as Idea).id
                ? { ...idea, ...(payload.new as Partial<Idea>) }
                : idea
            )
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ideas' },
        (payload) => {
          setIdeas(current => [payload.new as Idea, ...current])
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'ideas' },
        (payload) => {
          setIdeas(current =>
            current.filter(idea => idea.id !== (payload.old as { id: string }).id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return ideas
}
