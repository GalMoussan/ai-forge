# AI-Forge Conventions Skill

This skill provides always-on context about AI-Forge's coding patterns and conventions. Apply this knowledge to every task in this codebase.

## Validation Approach

All API inputs validated with Zod before any logic runs:

```typescript
const parsed = Schema.safeParse(body)
if (!parsed.success) {
  return Response.json({ error: parsed.error.flatten() }, { status: 422 })
}
// parsed.data is fully typed here
```

Never validate on the database side alone — always Zod first.

## Import Conventions

```typescript
// Order: React/Next.js → External packages → Internal (@/...)
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { COPY } from '@/lib/copy'
import type { Idea, IdeaCategory } from '@/types/database'
```

## Error Handling

```typescript
// API routes: always { data } or { error }, always human-readable
return Response.json({ error: 'Could not save — please try again' }, { status: 500 })

// Client components: optimistic rollback + COPY error messages
try {
  await apiCall()
} catch {
  rollback()
  showToast(COPY.errors.network)
}
```

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React components | `PascalCase.tsx` | `VoteButton.tsx` |
| Hooks | `use{Name}.ts` | `useRealtimeIdeas.ts` |
| API routes | `route.ts` in kebab dir | `api/ideas/route.ts` |
| Types | `camelCase.ts` | `database.ts` |
| Constants/copy | `camelCase.ts` | `copy.ts` |

## Key Patterns

### Design Tokens (always use classes, never hex values)
```
bg-background    bg-surface    border-border
text-text-primary    text-text-muted    text-accent
bg-cta    bg-cta-hover    text-success    bg-tag-bg
```

### Component Export Pattern
```typescript
// Named export + interface above component — always
export interface ButtonProps { variant?: 'primary' | 'secondary' | 'ghost' }
export function Button({ variant = 'primary' }: ButtonProps) { ... }
```

### Server vs Client Split
- Server Components: data fetching, SEO content, static sections
- Client Components: `'use client'` + interactivity, animations, form state
- Never import Supabase browser client in Server Components

### Copy: Single Source of Truth
All user-facing text comes from `src/lib/copy.ts` (COPY constant).
Never hardcode strings in components.

### Vote Count: Never Touch Directly
`ideas.vote_count` is maintained by a Postgres trigger.
Increment it by inserting into `supports`, not by updating `ideas`.
