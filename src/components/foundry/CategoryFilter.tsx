'use client'
import type { IdeaCategory } from '@/types/database'

type FilterValue = IdeaCategory | 'all'
const CATEGORIES: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Automation', value: 'automation' },
  { label: 'Creativity', value: 'creativity' },
  { label: 'Productivity', value: 'productivity' },
  { label: 'Analysis', value: 'analysis' },
  { label: 'Other', value: 'other' },
]

interface CategoryFilterProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter ideas by category">
      {CATEGORIES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          aria-pressed={active === value}
          className={`
            px-4 py-1.5 rounded-full text-body-sm font-medium transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta
            ${active === value
              ? 'bg-cta text-white shadow-sm'
              : 'bg-tag-bg text-cta hover:bg-cta/10'
            }
          `.trim().replace(/\s+/g, ' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
