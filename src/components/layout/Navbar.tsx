'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const NAV_LINKS = [
  { label: 'Home', id: 'hero-section' },
  { label: 'Explore Ideas', id: 'foundry' },
  { label: 'Submit Idea', id: 'idea-lab' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-card'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => scrollTo('hero-section')}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              aria-label="Go to top"
            >
              <div className="w-8 h-8 rounded-lg bg-cta flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm leading-none">A</span>
              </div>
              <span className="font-semibold text-text-primary text-lg tracking-tight">AI-Forge</span>
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-tag-bg rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tag-bg">
                    <User className="w-3.5 h-3.5 text-cta" aria-hidden="true" />
                    <span className="text-xs text-text-muted font-medium">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={signOut}
                    className="p-2 rounded-lg hover:bg-tag-bg text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => scrollTo('idea-lab')}
                  className="px-4 py-2 text-sm font-semibold text-cta border border-cta/30 rounded-lg hover:bg-tag-bg transition-colors"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-tag-bg transition-colors"
              onClick={() => setIsMobileOpen(o => !o)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileOpen ? (
                <X className="w-5 h-5 text-text-muted" />
              ) : (
                <Menu className="w-5 h-5 text-text-muted" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="fixed top-16 left-0 right-0 z-40 bg-background/98 backdrop-blur-md border-b border-border shadow-lg md:hidden"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => { scrollTo(link.id); setIsMobileOpen(false) }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text-primary hover:bg-tag-bg transition-colors"
              >
                {link.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => { signOut(); setIsMobileOpen(false) }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text-primary hover:bg-tag-bg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
