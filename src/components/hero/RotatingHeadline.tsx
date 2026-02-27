'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { COPY } from '@/lib/copy'

export function RotatingHeadline() {
  const shouldReduceMotion = useReducedMotion()
  const words = COPY.hero.headline.rotating
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [shouldReduceMotion, words.length])

  if (shouldReduceMotion) {
    return (
      <span className="font-serif italic text-cta">{words[0]}</span>
    )
  }

  return (
    <span className="inline-block relative min-w-[200px]" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="font-serif italic text-cta inline-block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
