'use client'
import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { IdeaWithProfile } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { VoteButton } from './VoteButton'
import { PledgeButton } from './PledgeButton'
import { CommentThread } from './CommentThread'
import { useAnalytics } from '@/lib/analytics'
import { COPY } from '@/lib/copy'

interface IdeaDrawerProps {
  idea: IdeaWithProfile | null
  onClose: () => void
}

export function IdeaDrawer({ idea, onClose }: IdeaDrawerProps) {
  const shouldReduceMotion = useReducedMotion()
  const track = useAnalytics()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!idea) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [idea, handleKeyDown])

  useEffect(() => {
    if (idea) {
      track('view_idea', { idea_id: idea.id, title: idea.title })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea?.id])

  const progressPct = idea
    ? Math.min(100, Math.round((idea.vote_count / idea.vote_threshold) * 100))
    : 0

  const drawerTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, damping: 30, stiffness: 300 }

  const drawerInitial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, x: 40 }

  const drawerAnimate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, x: 0 }

  const drawerExit = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, x: 40 }

  const backdropTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2 }

  const progressTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: 'easeOut' as const, delay: 0.2 }

  return (
    <AnimatePresence>
      {idea && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={idea.title}
            initial={drawerInitial}
            animate={drawerAnimate}
            exit={drawerExit}
            transition={drawerTransition}
            className="fixed right-0 top-0 h-full w-full max-w-lg z-50 bg-surface shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <Badge variant="category">{idea.category}</Badge>
                {idea.status !== 'active' && (
                  <Badge variant={idea.status as 'threshold_reached' | 'building' | 'launched'}>
                    {idea.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-tag-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
                aria-label="Close drawer"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6">
                {/* Title */}
                <h2 className="font-sans text-display-md font-bold text-text-primary mb-3 leading-tight">
                  {idea.title}
                </h2>

                {/* Full description */}
                <p className="text-body-lg text-text-muted leading-relaxed mb-5">
                  {idea.description}
                </p>

                {/* Tags */}
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {idea.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-tag-bg text-cta px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress + vote */}
                <div className="bg-background rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-body-sm text-text-muted">
                        {COPY.foundry.threshold_label(idea.vote_count, idea.vote_threshold)}
                      </p>
                      <p className="text-xs text-text-muted">{progressPct}% to threshold</p>
                    </div>
                    <VoteButton ideaId={idea.id} initialCount={idea.vote_count} category={idea.category} />
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cta rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={progressTransition}
                    />
                  </div>
                  {process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true' && (
                    <div className="mt-4">
                      <PledgeButton ideaId={idea.id} />
                    </div>
                  )}
                </div>

                {/* Submitter */}
                {idea.profiles?.username && (
                  <div className="flex items-center gap-2 mb-5 text-body-sm text-text-muted">
                    <div
                      className="w-7 h-7 rounded-full bg-tag-bg flex items-center justify-center text-xs font-semibold text-cta"
                      aria-hidden="true"
                    >
                      {idea.profiles.username[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span>Submitted by {idea.profiles.username}</span>
                  </div>
                )}
              </div>

              {/* Comment thread */}
              <div className="border-t border-border">
                <CommentThread ideaId={idea.id} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
