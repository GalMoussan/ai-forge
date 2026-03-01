'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion, motion, AnimatePresence } from 'framer-motion'
import { useVote } from '@/lib/hooks/useVote'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAnalytics } from '@/lib/analytics'
import { COPY } from '@/lib/copy'

interface VoteButtonProps {
  ideaId: string
  initialCount: number
  category: string
}

export function VoteButton({ ideaId, initialCount, category }: VoteButtonProps) {
  const shouldReduceMotion = useReducedMotion()
  const { user } = useAuth()
  const track = useAnalytics()
  // For initial voted state: in a real app you'd check if user has already voted
  // We optimistically start as false; the API handles idempotent deduplication
  const { count, voted, toggle, isLoading } = useVote({
    ideaId,
    initialCount,
    initialVoted: false,
  })

  const prevVotedRef = useRef(false)
  useEffect(() => {
    if (!prevVotedRef.current && voted) {
      track('vote', { idea_id: ideaId, category })
    }
    prevVotedRef.current = voted
  }, [voted, ideaId, category, track])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Don't expand card
    if (!user) return // Auth gate handled by parent prompt
    toggle()
  }

  if (!user) {
    return (
      <button
        onClick={(e) => { e.stopPropagation() }}
        className="text-body-sm text-cta font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded"
        aria-label="Sign in to vote"
      >
        {COPY.auth.prompt_vote}
      </button>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      aria-label={voted ? COPY.foundry.voted_label : COPY.foundry.vote_cta}
      aria-pressed={voted}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-body-sm font-semibold
        transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta
        disabled:opacity-50 disabled:cursor-not-allowed
        ${voted
          ? 'bg-cta text-white shadow-cta-glow'
          : 'bg-tag-bg text-cta border border-cta/20 hover:bg-cta/10'
        }
      `.trim().replace(/\s+/g, ' ')}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="tabular-nums"
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <span>{voted ? COPY.foundry.voted_label : COPY.foundry.vote_cta}</span>
    </motion.button>
  )
}
