# Build Component — AI-Forge

Scaffold a React component following AI-Forge's frontend conventions.

## Input

Component name + optional description: $ARGUMENTS
Examples: `VoteButton`, `IdeaCard "Shows idea title, description, vote count and vote CTA"`

## Process

### 1. Understand Requirements

Determine from the name and context:
- Which section does this belong to? (`hero/`, `idea-lab/`, `foundry/`, `ui/`)
- Server Component (no interactivity, data fetching) or Client Component (`'use client'`)?
- What data/props does it need?

### 2. Explore Existing Patterns

Read files in `src/components/` to match established patterns:
- How are props interfaces structured?
- What Tailwind classes are used for similar elements?
- What Framer Motion patterns are in use?

Also read `src/lib/copy.ts` for the COPY constant structure.

### 3. Scaffold the Component

Create `src/components/{section}/{ComponentName}.tsx`:

```tsx
// Client Component template
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { COPY } from '@/lib/copy'
// import { Button } from '@/components/ui/Button'

export interface ComponentNameProps {
  // required props first, optional last
}

export function ComponentName({ }: ComponentNameProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* component content */}
    </motion.div>
  )
}
```

### 4. Conventions to Follow

- Named export only — no default export
- Props interface immediately above component
- All colors via Tailwind token classes (never hex values)
- All display text from `COPY` constant (never hardcoded strings)
- Every interactive element has `aria-label`
- `useReducedMotion()` always wraps Framer Motion variants

### 5. Integration

- Add to section's `index.ts` barrel if one exists
- Note what page/component should import this
- If it fetches data: confirm whether RSC or SWR pattern is appropriate

## Output

- The component file at `src/components/{section}/{ComponentName}.tsx`
- Brief integration note (where to use it, what to pass as props)
