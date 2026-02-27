export type BadgeVariant = 'category' | 'active' | 'threshold_reached' | 'building' | 'launched'

export interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  category: 'bg-tag-bg text-cta',
  active: 'bg-tag-bg text-cta',
  threshold_reached: 'bg-emerald-50 text-emerald-700',
  building: 'bg-amber-50 text-amber-700',
  launched: 'bg-green-50 text-success',
}

export function Badge({ children, variant = 'category', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        text-body-sm font-medium rounded-full px-3 py-1
        ${variantClasses[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  )
}
