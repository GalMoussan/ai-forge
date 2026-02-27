'use client'

import { motion } from 'framer-motion'

export interface CardProps {
  children: React.ReactNode
  interactive?: boolean
  className?: string
  onClick?: () => void
}

export function Card({ children, interactive = false, className = '', onClick }: CardProps) {
  const baseClasses = 'bg-surface border border-border rounded-xl p-6 shadow-card'
  const interactiveClasses = interactive
    ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-[3px] transition-all duration-200'
    : ''

  return (
    <motion.div
      className={`${baseClasses} ${interactiveClasses} ${className}`.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
    >
      {children}
    </motion.div>
  )
}
