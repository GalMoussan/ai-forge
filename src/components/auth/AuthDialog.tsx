'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Chrome, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

interface AuthDialogProps {
  open: boolean
  onClose: () => void
}

type Tab = 'magic' | 'google'
type Step = 'input' | 'sent'

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  const { signInWithMagicLink, signInWithGoogle } = useAuth()
  const [tab, setTab] = useState<Tab>('magic')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<Step>('input')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setEmail('')
    setStep('input')
    setError(null)
    setLoading(false)
    setTab('magic')
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await signInWithMagicLink(email.trim())
    setLoading(false)
    if (error) {
      setError('Could not send the link — please check your email address.')
    } else {
      setStep('sent')
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) {
      setError('Google sign-in failed. Please try again.')
      setLoading(false)
    }
    // On success, the page will redirect — no need to close
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Sign in to AI-Forge"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
          >
            <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-tag-bg transition-colors"
                aria-label="Close sign-in dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="w-10 h-10 rounded-xl bg-cta flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg leading-none">A</span>
                </div>
                <h2 className="text-heading-lg font-semibold text-text-primary">
                  Welcome to AI-Forge
                </h2>
                <p className="text-body-sm text-text-muted mt-1">
                  Sign in to submit ideas and vote on the ones you love.
                </p>
              </div>

              {/* Success state */}
              {step === 'sent' ? (
                <div className="text-center space-y-3 py-4">
                  <CheckCircle className="w-12 h-12 text-success mx-auto" />
                  <p className="font-semibold text-text-primary">Check your email</p>
                  <p className="text-body-sm text-text-muted">
                    We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.
                  </p>
                  <button
                    onClick={reset}
                    className="text-body-sm text-cta hover:underline mt-2"
                  >
                    Use a different email
                  </button>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex gap-1 p-1 bg-tag-bg rounded-lg mb-5">
                    {(['magic', 'google'] as Tab[]).map(t => (
                      <button
                        key={t}
                        onClick={() => { setTab(t); setError(null) }}
                        className={`flex-1 py-2 px-3 rounded-md text-body-sm font-medium transition-colors ${
                          tab === t
                            ? 'bg-surface text-text-primary shadow-card'
                            : 'text-text-muted hover:text-text-primary'
                        }`}
                      >
                        {t === 'magic' ? 'Magic Link' : 'Google'}
                      </button>
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                      {error}
                    </p>
                  )}

                  {/* Magic link tab */}
                  {tab === 'magic' && (
                    <form onSubmit={handleMagicLink} className="space-y-3">
                      <div>
                        <label
                          htmlFor="auth-email"
                          className="block text-body-sm font-medium text-text-primary mb-1.5"
                        >
                          Email address
                        </label>
                        <input
                          id="auth-email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          autoFocus
                          disabled={loading}
                          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-text-primary text-body-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta transition-colors disabled:opacity-50"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !email.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cta text-white font-semibold text-body-sm rounded-lg hover:bg-cta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                        {loading ? 'Sending…' : 'Send Magic Link'}
                      </button>
                    </form>
                  )}

                  {/* Google tab */}
                  {tab === 'google' && (
                    <button
                      onClick={handleGoogle}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border bg-surface text-text-primary font-semibold text-body-sm rounded-lg hover:bg-tag-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Chrome className="w-4 h-4 text-text-muted" />
                      )}
                      {loading ? 'Redirecting…' : 'Continue with Google'}
                    </button>
                  )}

                  <p className="text-xs text-text-muted text-center mt-4">
                    No password needed. Your data stays private.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
