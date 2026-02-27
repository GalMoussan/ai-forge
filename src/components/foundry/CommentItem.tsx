'use client'
import { useState } from 'react'
import type { CommentWithProfile } from '@/types/database'
import { CommentForm } from './CommentForm'
import { COPY } from '@/lib/copy'

interface CommentItemProps {
  comment: CommentWithProfile
  onReply: (reply: CommentWithProfile) => void
  isReply?: boolean
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function CommentItem({ comment, onReply, isReply = false }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const username = comment.profiles?.username ?? 'Anonymous'
  const initial = username[0]?.toUpperCase() ?? '?'
  const relativeTime = getRelativeTime(comment.created_at)

  const handleReplySuccess = (reply: CommentWithProfile) => {
    onReply(reply)
    setShowReplyForm(false)
  }

  return (
    <div className={isReply ? 'ml-8 pl-4 border-l-2 border-border' : ''}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-tag-bg flex items-center justify-center text-xs font-semibold text-cta flex-shrink-0"
          aria-hidden="true"
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-body-sm font-semibold text-text-primary">@{username}</span>
            <span className="text-xs text-text-muted">{relativeTime}</span>
          </div>

          {/* Content */}
          <p className="text-body-sm text-text-primary leading-relaxed mb-2">{comment.content}</p>

          {/* Reply button (only on root comments) */}
          {!isReply && (
            <button
              onClick={() => setShowReplyForm(v => !v)}
              className="text-xs text-text-muted hover:text-cta font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded"
              aria-label={`Reply to ${username}`}
            >
              {COPY.foundry.comments.reply_cta}
            </button>
          )}

          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                ideaId={comment.idea_id}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
                placeholder={`Reply to @${username}...`}
                compact
              />
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={() => {}} // One level deep only
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
