'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function CtaSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative py-32 px-6 overflow-hidden" aria-label="Call to action">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1699570047113-16fdf623e83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
      </div>

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto text-center space-y-6"
      >
        <h2 className="text-display-md font-semibold text-text-primary text-balance">
          Together, We Build the Future
        </h2>
        <p className="text-heading-md text-text-muted text-balance">
          Every great tool starts with a single idea. What will yours be?
        </p>
        <motion.div
          whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block pt-2"
        >
          <Button
            variant="primary"
            onClick={() => scrollTo('idea-lab')}
            aria-label="Submit your idea"
          >
            <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
            Start Your Journey
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
