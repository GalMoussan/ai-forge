'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Rocket, TrendingUp, Zap, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RotatingHeadline } from './RotatingHeadline'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Hero section"
    >
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/[0.92]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Animated icon */}
          <motion.div
            animate={shouldReduceMotion ? {} : {
              scale: [1, 1.08, 1],
              rotate: [0, 4, -4, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex justify-center mb-2"
          >
            <div className="w-20 h-20 rounded-2xl bg-cta flex items-center justify-center shadow-cta-glow">
              <span className="text-white font-bold text-4xl leading-none font-serif">A</span>
            </div>
          </motion.div>

          {/* Headline with gradient */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="text-display-lg sm:text-display-xl font-semibold leading-tight text-balance">
              <span className="bg-gradient-to-r from-cta via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Shape the Future
              </span>
              {' '}
              <span className="text-text-primary">of AI —</span>
              {' '}
              <RotatingHeadline />
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-heading-md text-text-muted max-w-2xl mx-auto text-balance"
          >
            Support groundbreaking AI tools that solve real problems. Your backing brings innovation to life.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="primary"
                onClick={() => scrollTo('idea-lab')}
                aria-label="Submit your idea"
              >
                <Rocket className="w-4 h-4 mr-2" aria-hidden="true" />
                Submit Your Idea
              </Button>
            </motion.div>
            <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="ghost"
                onClick={() => scrollTo('foundry')}
                aria-label="Explore ideas"
              >
                <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
                Explore Ideas
              </Button>
            </motion.div>
          </motion.div>

          {/* Live stats */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 pt-10 max-w-md mx-auto"
          >
            {[
              { icon: Zap, value: '1,164', label: 'Builders', color: 'text-yellow-500' },
              { icon: Users, value: '5', label: 'Active Ideas', color: 'text-blue-500' },
              { icon: Sparkles, value: '0', label: 'In Progress', color: 'text-purple-500' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="space-y-1.5">
                <motion.div
                  animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Icon className={`w-6 h-6 mx-auto ${color}`} aria-hidden="true" />
                </motion.div>
                <p className="text-display-md font-semibold text-text-primary tabular-nums">{value}</p>
                <p className="text-body-sm text-text-muted">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-cta/40 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-cta rounded-full"
          />
        </div>
      </motion.div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
    </section>
  )
}
