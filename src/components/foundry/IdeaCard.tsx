'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { IdeaWithProfile } from '@/types/database'
import { Badge } from '@/components/ui/Badge'
import { VoteButton } from './VoteButton'
import { CommentThread } from './CommentThread'
import { COPY } from '@/lib/copy'

interface IdeaCardProps {
  idea: IdeaWithProfile
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const progressPct = Math.min(100, Math.round((idea.vote_count / idea.vote_threshold) * 100))
  const username = idea.profiles?.username ?? 'Anonymous'
  const initial = username[0]?.toUpperCase() ?? '?'

  return (
    <div className="bg-surface border border-border rounded-xl shadow-card flex flex-col overflow-hidden">
      {/* Clickable card body */}
      <button
        className="flex-1 p-6 text-left hover:bg-gray-50/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-inset"
        onClick={() => setIsExpanded(e => !e)}
        aria-expanded={isExpanded}
        aria-label={`${idea.title} — click to ${isExpanded ? 'collapse' : 'expand'} discussion`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="category">{idea.category}</Badge>
          {idea.status !== 'active' && (
            <Badge variant={idea.status as 'threshold_reached' | 'building' | 'launched'}>
              {idea.status.replace('_', ' ')}
            </Badge>
          )}
        </div>

        <h3 className="font-sans text-heading-md font-semibold text-text-primary mb-2 leading-snug">
          {idea.title}
        </h3>
        <p className="text-body-sm text-text-muted line-clamp-3 mb-4">{idea.description}</p>

        {/* Tags */}
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {idea.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-tag-bg text-cta px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>{COPY.foundry.threshold_label(idea.vote_count, idea.vote_threshold)}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-tag-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cta rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </button>

      {/* Vote button + submitter */}
      <div className="px-6 pb-4 flex items-center justify-between border-t border-border pt-4">
        {/* Submitter */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-tag-bg flex items-center justify-center text-xs font-semibold text-cta" aria-hidden="true">
            {initial}
          </div>
          <span className="text-body-sm text-text-muted">{username}</span>
        </div>
        <VoteButton ideaId={idea.id} initialCount={idea.vote_count} />
      </div>

      {/* Expandable comment thread */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border"
          >
            <CommentThread ideaId={idea.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
