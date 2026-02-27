'use client'

import { COPY } from '@/lib/copy'

// In production this would query Supabase for aggregates.
// For Phase 1 we use the seed data counts as initial values.
const INITIAL_STATS = { builders: 1164, ideas: 5, building: 0 }

export function HeroStats() {
  const stats = INITIAL_STATS
  return (
    <div className="flex items-center gap-6 text-body-sm text-text-muted" role="status" aria-label="Platform statistics">
      <span>
        <span className="font-semibold tabular-nums text-text-primary">{stats.builders.toLocaleString()}</span>
        {' '}{COPY.hero.stats.builders_label}
      </span>
      <span className="text-border select-none" aria-hidden="true">·</span>
      <span>
        <span className="font-semibold tabular-nums text-text-primary">{stats.ideas}</span>
        {' '}{COPY.hero.stats.ideas_label}
      </span>
      <span className="text-border select-none" aria-hidden="true">·</span>
      <span>
        <span className="font-semibold tabular-nums text-text-primary">{stats.building}</span>
        {' '}{COPY.hero.stats.building_label}
      </span>
    </div>
  )
}
