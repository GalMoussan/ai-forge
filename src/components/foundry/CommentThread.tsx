'use client'
import { useState, useEffect, useCallback } from 'react'
import type { CommentWithProfile } from '@/types/database'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { COPY } from '@/lib/copy'

interface CommentThreadProps {
  ideaId: string
}

export function CommentThread({ ideaId }: CommentThreadProps) {
  const [comments, setComments] = useState<CommentWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchComments = useCallback(async () => {
    if (hasFetched) return
    setLoading(true)
    try {
      const res = await fetch(`/api/comments/${ideaId}`)
      if (res.ok) {
        const json = await res.json() as { data: CommentWithProfile[] }
        setComments(json.data ?? [])
      }
    } finally {
      setLoading(false)
      setHasFetched(true)
    }
  }, [ideaId, hasFetched])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleNewComment = (comment: CommentWithProfile) => {
    setComments(prev => [...prev, comment])
  }

  const handleNewReply = (reply: CommentWithProfile, parentId: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies ?? []), reply] }
          : c
      )
    )
  }

  const heading = COPY.foundry.comments.heading(comments.length)

  return (
    <div className="p-6 bg-background/50">
      <h4 className="text-body-sm font-semibold text-text-primary mb-4">{heading}</h4>

      {loading && (
        <p className="text-body-sm text-text-muted py-4">
          <span className="inline-block w-4 h-4 border-2 border-cta border-t-transparent rounded-full animate-spin mr-2 align-middle" />
          Loading discussion...
        </p>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-body-sm text-text-muted italic mb-6">{COPY.foundry.comments.empty}</p>
      )}

      {!loading && comments.length > 0 && (
        <div className="space-y-4 mb-6">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(reply) => handleNewReply(reply, comment.id)}
            />
          ))}
        </div>
      )}

      <CommentForm
        ideaId={ideaId}
        parentId={null}
        onSuccess={handleNewComment}
        placeholder={COPY.foundry.comments.placeholder}
      />
    </div>
  )
}
