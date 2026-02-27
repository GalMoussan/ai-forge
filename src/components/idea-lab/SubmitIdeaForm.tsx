'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, type SelectOption } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/lib/hooks/useAuth'
import { COPY } from '@/lib/copy'
import type { IdeaCategory } from '@/types/database'

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'automation', label: 'Automation' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'other', label: 'Other' },
]

interface FormState {
  title: string
  description: string
  category: string
}

function validate(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {}
  if (form.title.length < 5) errors.title = 'Title must be at least 5 characters'
  if (form.title.length > 100) errors.title = 'Title must be 100 characters or less'
  if (form.description.length < 20) errors.description = 'Description must be at least 20 characters'
  if (!form.category) errors.category = 'Please select a category'
  return errors
}

export function SubmitIdeaForm() {
  const { user } = useAuth()

  const [form, setForm] = useState<FormState>({ title: '', description: '', category: '' })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showAuthGate, setShowAuthGate] = useState(false)

  const addTag = useCallback((raw: string) => {
    const trimmed = raw.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
    }
    setTagInput('')
  }, [tags])

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }, [tagInput, addTag])

  const handleTagBlur = useCallback(() => {
    if (tagInput.trim()) {
      addTag(tagInput)
    }
  }, [tagInput, addTag])

  const handleTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Auto-add on comma
    if (value.endsWith(',')) {
      addTag(value.slice(0, -1))
    } else {
      setTagInput(value)
    }
  }, [addTag])

  const removeTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }, [])

  const handleFieldChange = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) {
          setErrors(prev => {
            const next = { ...prev }
            delete next[field]
            return next
          })
        }
      },
    [errors]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSubmitError(null)

      // Validate
      const validationErrors = validate(form)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      // Auth gate
      if (!user) {
        setShowAuthGate(true)
        return
      }

      setLoading(true)
      try {
        const response = await fetch('/api/ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            category: form.category as IdeaCategory,
            tags,
          }),
        })

        if (response.ok) {
          setSubmitted(true)
          // Reset form
          setForm({ title: '', description: '', category: '' })
          setTags([])
          setTagInput('')
          setErrors({})
          setShowAuthGate(false)
        } else if (response.status === 401) {
          setShowAuthGate(true)
        } else {
          setSubmitError(COPY.errors.submission_failed)
        }
      } catch {
        setSubmitError(COPY.errors.network)
      } finally {
        setLoading(false)
      }
    },
    [form, tags, user]
  )

  // Success state
  if (submitted) {
    return (
      <div
        className="rounded-xl border border-border bg-surface p-8 text-center space-y-3 animate-in fade-in duration-500"
        role="status"
        aria-live="polite"
      >
        <p className="text-display-sm font-semibold text-success">
          {COPY.ideaLab.form.success_heading}
        </p>
        <p className="text-body-lg text-text-muted">
          {COPY.ideaLab.form.success_body}
        </p>
        <Button
          variant="secondary"
          onClick={() => setSubmitted(false)}
          aria-label="Submit another idea"
        >
          Submit Another Idea
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Submit your AI tool idea"
      className="space-y-5"
    >
      {/* Auth gate banner */}
      {showAuthGate && (
        <div
          className="rounded-lg border border-cta/30 bg-tag-bg px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
          role="alert"
          aria-live="assertive"
        >
          <p className="flex-1 text-body-sm text-accent">
            {COPY.auth.prompt_submit}
          </p>
          <Button
            type="button"
            variant="primary"
            aria-label="Sign in to submit your idea"
            onClick={() => {
              // Auth UI handled in a future task — prompt user
              setShowAuthGate(false)
            }}
          >
            {COPY.auth.nav_sign_in}
          </Button>
        </div>
      )}

      {/* Global submit error */}
      {submitError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-body-sm text-red-700"
          role="alert"
          aria-live="polite"
        >
          {submitError}
        </div>
      )}

      {/* Title */}
      <Input
        label={COPY.ideaLab.form.title_label}
        placeholder={COPY.ideaLab.form.title_placeholder}
        value={form.title}
        onChange={handleFieldChange('title')}
        error={errors.title}
        disabled={loading}
        required
        maxLength={100}
        aria-label={COPY.ideaLab.form.title_label}
      />

      {/* Description */}
      <Textarea
        label={COPY.ideaLab.form.description_label}
        placeholder={COPY.ideaLab.form.description_placeholder}
        value={form.description}
        onChange={handleFieldChange('description')}
        error={errors.description}
        disabled={loading}
        required
        maxLength={1000}
        rows={5}
        aria-label={COPY.ideaLab.form.description_label}
      />

      {/* Category + Tags row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <Select
          label={COPY.ideaLab.form.category_label}
          options={CATEGORY_OPTIONS}
          placeholder="Select a category"
          value={form.category}
          onChange={handleFieldChange('category')}
          error={errors.category}
          disabled={loading}
          required
          aria-label={COPY.ideaLab.form.category_label}
        />

        {/* Tags input */}
        <div className="flex flex-col gap-1.5">
          <Input
            label={COPY.ideaLab.form.tags_label}
            placeholder={COPY.ideaLab.form.tags_placeholder}
            value={tagInput}
            onChange={handleTagChange}
            onKeyDown={handleTagKeyDown}
            onBlur={handleTagBlur}
            disabled={loading}
            aria-label={COPY.ideaLab.form.tags_label}
            hint="Press Enter or comma to add a tag"
          />
        </div>
      </div>

      {/* Tag chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Added tags">
          {tags.map(tag => (
            <span key={tag} role="listitem" className="inline-flex items-center gap-1">
              <Badge variant="category">
                {tag}
              </Badge>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                disabled={loading}
                aria-label={`Remove tag ${tag}`}
                className="text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        isLoading={loading}
        disabled={loading}
        className="w-full"
        aria-label={COPY.ideaLab.form.submit_cta}
      >
        {COPY.ideaLab.form.submit_cta}
      </Button>
    </form>
  )
}
