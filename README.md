# AI-Forge

**One-page crowdfunding platform for AI tool ideas — community votes ideas into existence.**

## Stack

- **Frontend:** Next.js 14 App Router + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Next.js API Routes + Supabase Edge Functions
- **Database:** Supabase Postgres (with Realtime subscriptions)
- **Auth:** Supabase Auth (magic link + Google OAuth)
- **Deployment:** Vercel

## Getting Started

```bash
bun install
bun run dev
```

## Structure

```
ai-forge/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Single page: Hero + IdeaLab + Foundry
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── api/             # API route handlers
│   ├── components/
│   │   ├── hero/            # Hero section (rotating headline, CTA)
│   │   ├── idea-lab/        # Idea submission form
│   │   ├── foundry/         # Gallery, cards, vote buttons
│   │   └── ui/              # Design system atoms
│   ├── lib/
│   │   ├── supabase/        # Client + server helpers
│   │   └── hooks/           # Custom React hooks
│   └── types/               # Shared TypeScript types
├── supabase/
│   └── migrations/          # SQL schema migrations
└── public/
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run typecheck` | TypeScript type checking |
| `bun run test` | Run tests |
| `bun run lint` | Lint code |
