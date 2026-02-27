# AI-Forge — Project Conventions

## Stack
- **Framework**: Next.js 14 App Router (TypeScript, strict mode)
- **Styling**: Tailwind CSS — use design tokens from `tailwind.config.ts`
- **Animation**: Framer Motion — all entrance animations, hover states, vote interactions
- **Database**: Supabase Postgres — all queries go through `src/lib/supabase/`
- **Auth**: Supabase Auth (magic link + Google OAuth)
- **Realtime**: Supabase Realtime channels for vote counts + new ideas
- **Deployment**: Vercel

## Design Tokens (never hardcode these)
```
Background: #FAFAF8    → bg-background
Surface:    #FFFFFF    → bg-surface
Border:     #E8E8E4    → border-border
Text:       #0A0A0A    → text-text-primary
Muted:      #6B7280    → text-text-muted
Accent:     #1A1A2E    → text-accent
CTA:        #6366F1    → bg-cta / text-cta
Success:    #10B981    → text-success
Tag bg:     #F0F0F9    → bg-tag-bg
```

## Typography Rules
- Hero h1 ONLY: `font-serif` (Instrument Serif)
- All other text: `font-sans` (Inter)
- CTA buttons: `font-semibold` — never serif
- Data/numbers: `tabular-nums`

## Component Rules
- Named exports only (no default exports from components)
- Props interface above the component: `interface ComponentNameProps { ... }`
- Co-locate component test file: `ComponentName.test.tsx` in same directory
- Accessibility: every interactive element needs `aria-label`
- No inline styles except for dynamic values impossible in Tailwind

## File Structure
```
src/
├── app/
│   ├── page.tsx          # Single page layout
│   ├── layout.tsx        # Root layout with metadata
│   ├── globals.css       # Tailwind base + custom tokens
│   └── api/
│       ├── ideas/route.ts
│       ├── supports/route.ts
│       └── comments/route.ts
├── components/
│   ├── hero/             # HeroSection, RotatingHeadline
│   ├── idea-lab/         # IdeaLabSection, SubmitIdeaForm
│   ├── foundry/          # FoundrySection, IdeaCard, VoteButton, CommentThread
│   └── ui/               # Button, Badge, Card, Input, Textarea (atoms)
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client (cookies)
│   └── hooks/
│       ├── useIdeas.ts
│       ├── useVote.ts
│       └── useAuth.ts
└── types/
    └── database.ts       # All DB types — source of truth
```

## API Route Pattern
```typescript
// Always validate with zod, always return { data, error }
export async function POST(request: Request) {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return Response.json({ error: parsed.error }, { status: 422 })
  // ...
  return Response.json({ data: result })
}
```

## Supabase Rules
- Use `createClient()` from `@/lib/supabase/server` in Server Components + API routes
- Use `createClient()` from `@/lib/supabase/client` in Client Components only
- Never use service role key in client-side code
- vote_count is maintained by Postgres trigger — never update it directly

## Motion Patterns
```typescript
// Standard entrance animation
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
// Always wrap with useReducedMotion() check
```

## Agents
| Agent | Model | Responsibility |
|-------|-------|---------------|
| `ui-agent` | sonnet | React components, Tailwind, Framer Motion |
| `backend-agent` | sonnet | Supabase, API routes, RLS, realtime |
| `copy-agent` | haiku | All marketing copy → `src/lib/copy.ts` |
| `scaffold-agent` | haiku | Config files, boilerplate, setup |

## Commands
| Command | Description |
|---------|-------------|
| `/task-execute T001` | Execute a task from the task board |
| `/build-component VoteButton` | Scaffold a new React component |
| `/design-schema CreateIdea` | Design a Zod validation schema |
| `bun run dev` | Start dev server (localhost:3000) |
| `bun run typecheck` | Type check without building |
| `bun run test` | Run Vitest unit tests |
| `bun run test:e2e` | Run Playwright E2E tests |
| `bun run build` | Production build |
