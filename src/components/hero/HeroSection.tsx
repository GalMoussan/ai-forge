'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { COPY } from '@/lib/copy'
import { Button } from '@/components/ui/Button'
import { RotatingHeadline } from './RotatingHeadline'
import { HeroStats } from './HeroStats'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      className="relative min-h-[90vh] flex flex-col"
      aria-label="Hero section"
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-accent text-heading-md">{COPY.nav.logo}</span>
          <span className="hidden sm:inline text-text-muted text-body-sm">{COPY.nav.tagline}</span>
        </div>
        <Button
          variant="secondary"
          onClick={() => scrollTo('idea-lab')}
          aria-label="Sign in to AI-Forge"
        >
          {COPY.auth.nav_sign_in}
        </Button>
      </nav>

      {/* Hero content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-8"
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Headline */}
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
            className="space-y-2"
          >
            <h1 className="text-display-lg sm:text-display-xl font-semibold text-accent leading-tight text-balance">
              {COPY.hero.headline.static_prefix}{' '}
              <RotatingHeadline />
              {' '}{COPY.hero.headline.static_suffix}
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            variants={shouldReduceMotion ? {} : itemVariants}
            className="text-heading-md text-text-muted max-w-xl mx-auto text-balance"
          >
            {COPY.hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="primary"
              onClick={() => scrollTo('foundry')}
              aria-label={COPY.hero.cta_primary}
            >
              {COPY.hero.cta_primary}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollTo('foundry')}
              aria-label={COPY.hero.cta_secondary}
            >
              {COPY.hero.cta_secondary} →
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
            className="flex justify-center pt-4"
          >
            <HeroStats />
          </motion.div>
        </motion.div>
      </div>

      {/* Thin gradient line decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
    </section>
  )
}
