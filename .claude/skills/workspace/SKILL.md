# AI-Forge Workspace Skill

This skill provides always-on context about AI-Forge's project structure, build system, and code organization.

## Project Layout

```
AiForge/
├── ai-forge/                    ← Code repository (git)
│   ├── .claude/
│   │   ├── CLAUDE.md            ← Project conventions (start here)
│   │   ├── agents/              ← ui-agent, backend-agent, copy-agent, scaffold-agent
│   │   ├── commands/            ← /task-execute, /build-component, /design-schema
│   │   └── skills/              ← This file + ai-forge-conventions
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         ← Single page (Hero + IdeaLab + Foundry)
│   │   │   ├── layout.tsx       ← Root layout + metadata
│   │   │   ├── globals.css      ← Tailwind base + design tokens
│   │   │   └── api/             ← Route handlers
│   │   │       ├── ideas/route.ts
│   │   │       ├── supports/route.ts
│   │   │       └── comments/route.ts
│   │   ├── components/
│   │   │   ├── hero/            ← HeroSection, RotatingHeadline, HeroStats
│   │   │   ├── idea-lab/        ← IdeaLabSection, SubmitIdeaForm
│   │   │   ├── foundry/         ← FoundrySection, FoundryGallery, IdeaCard, VoteButton
│   │   │   │                       CommentThread, CommentItem, CommentForm, CategoryFilter
│   │   │   └── ui/              ← Button, Card, Badge, Input, Textarea, Select (atoms)
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts    ← Browser client (Client Components only)
│   │   │   │   └── server.ts    ← Server client (API routes + Server Components)
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useRealtimeIdeas.ts
│   │   │   │   └── useVote.ts
│   │   │   └── copy.ts          ← All marketing copy (COPY constant)
│   │   └── types/
│   │       └── database.ts      ← All TypeScript types (source of truth)
│   ├── supabase/migrations/     ← SQL schema + seed files
│   └── public/                  ← Static assets
└── ai-forge-docs/               ← Documentation repository (git)
    ├── PLAN.md                  ← Architecture and phase outline
    ├── TASK_BOARD.md            ← All tasks with status tracking
    └── tasks/phase-{N}/         ← Individual task specs (T001–T021)
```

## Build Order

When implementing a new feature:
1. Check/update `src/types/database.ts` if new DB columns
2. Write/update Supabase migration if schema changes
3. Write API route in `src/app/api/`
4. Write custom hooks in `src/lib/hooks/` if needed
5. Build UI components consuming the hook/data

## Key Commands

```bash
bun run dev          # Start dev server → localhost:3000
bun run typecheck    # TypeScript check (run before committing)
bun run test         # Vitest unit tests
bun run test:e2e     # Playwright E2E (requires dev server)
bun run build        # Production build
bun run lint         # ESLint check
```

## Adding New Code

### New component
→ Add to appropriate section folder: `hero/`, `idea-lab/`, `foundry/`, or `ui/`
→ Named export with typed props interface
→ Add to section's `index.ts` barrel if it exists

### New API route
→ Create `src/app/api/{resource}/route.ts`
→ Validate input with Zod, check auth, query Supabase, return `{ data }` or `{ error }`

### New database column
→ Create new migration in `supabase/migrations/TIMESTAMP_description.sql`
→ Update `src/types/database.ts` to match
→ Never modify existing migration files

### New env variable
→ Add to `.env.example` with a descriptive comment
→ Use `NEXT_PUBLIC_` prefix only if it must be accessible in browser code
