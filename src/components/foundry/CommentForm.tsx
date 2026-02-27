'use client'
import { useState } from 'react'
import type { CommentWithProfile } from '@/types/database'
import { useAuth } from '@/lib/hooks/useAuth'
import { COPY } from '@/lib/copy'

interface CommentFormProps {
  ideaId: string
  parentId: string | null
  onSuccess: (comment: CommentWithProfile) => void
  placeholder?: string
  compact?: boolean
}

export function CommentForm({ ideaId, parentId, onSuccess, placeholder, compact = false }: CommentFormProps) {
  const { user, loading: authLoading } = useAuth()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ph = placeholder ?? COPY.foundry.comments.placeholder

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setIsSubmitting(true)
    setError(null)

    // Optimistic: create a local comment immediately
    const optimisticComment: CommentWithProfile = {
      id: `optimistic-${Date.now()}`,
      created_at: new Date().toISOString(),
      idea_id: ideaId,
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId,
      profiles: {
        username: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      },
    }
    onSuccess(optimisticComment)
    setContent('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: ideaId, content: content.trim(), parent_id: parentId }),
      })
      if (!res.ok) {
        setError(COPY.errors.comment_failed)
      }
    } catch {
      setError(COPY.errors.network)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) return null

  if (!user) {
    return (
      <p className="text-body-sm text-text-muted italic">
        <button
          className="text-cta font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded"
          onClick={() => {/* Auth modal would open here */}}
          aria-label="Sign in to comment"
        >
          Sign in
        </button>
        {' '}to join the discussion — it takes 10 seconds.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={ph}
        rows={compact ? 2 : 3}
        className={`
          w-full rounded-lg border border-border bg-surface text-text-primary text-body-sm
          placeholder:text-text-muted resize-none
          focus:outline-none focus:ring-2 focus:ring-cta focus:border-transparent
          transition-shadow duration-150
          ${compact ? 'px-3 py-2' : 'px-4 py-3'}
        `.trim().replace(/\s+/g, ' ')}
        aria-label="Write a comment"
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as unknown as React.FormEvent)
        }}
      />
      {error && <p className="text-body-sm text-red-500">{error}</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="
            px-4 py-2 bg-cta text-white rounded-lg text-body-sm font-semibold
            hover:bg-cta-hover transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label={COPY.foundry.comments.submit_cta}
        >
          {isSubmitting ? 'Posting...' : COPY.foundry.comments.submit_cta}
        </button>
      </div>
    </form>
  )
}
