'use client'

import { useState, useCallback } from 'react'

interface UseVoteOptions {
  ideaId: string
  initialCount: number
  initialVoted: boolean
}

export function useVote({ ideaId, initialCount, initialVoted }: UseVoteOptions) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(initialVoted)
  const [isLoading, setIsLoading] = useState(false)

  const toggle = useCallback(async () => {
    if (isLoading) return

    // Optimistic update
    const previousCount = count
    const previousVoted = voted
    setCount(c => voted ? c - 1 : c + 1)
    setVoted(v => !v)
    setIsLoading(true)

    try {
      const res = voted
        ? await fetch(`/api/supports/${ideaId}`, { method: 'DELETE' })
        : await fetch('/api/supports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea_id: ideaId }),
          })

      if (!res.ok) {
        // Rollback
        setCount(previousCount)
        setVoted(previousVoted)
      } else {
        const json = await res.json() as { data?: { vote_count: number } }
        if (json.data?.vote_count !== undefined) {
          setCount(json.data.vote_count)
        }
      }
    } catch {
      // Network error: rollback
      setCount(previousCount)
      setVoted(previousVoted)
    } finally {
      setIsLoading(false)
    }
  }, [ideaId, voted, count, isLoading])

  return { count, voted, toggle, isLoading }
}
