# Task Execute — AI-Forge

Execute a task from the AI-Forge task board autonomously.

## Input

Task ID: $ARGUMENTS (e.g., T001, T009)

## Process

### 1. Load Task Spec

Read the task specification from `ai-forge-docs/tasks/`:

| Phase | Path |
|-------|------|
| Phase 1 (T001–T010) | `../ai-forge-docs/tasks/phase-1/T{NNN}-*.md` |
| Phase 2 (T011–T016) | `../ai-forge-docs/tasks/phase-2/T{NNN}-*.md` |
| Phase 3 (T017–T021) | `../ai-forge-docs/tasks/phase-3/T{NNN}-*.md` |

### 2. Check Dependencies

Read `../ai-forge-docs/TASK_BOARD.md` and verify all "Depends On" tasks are marked DONE. If any are not, report which dependencies are missing and stop.

### 3. Understand Context

- Read `../ai-forge-docs/architecture/system-overview.md`
- Read existing code files that will be modified (src/components/, src/app/api/, etc.)
- Read `src/types/database.ts` for type contracts
- Read `src/lib/copy.ts` if the task touches any UI text

### 4. Plan Implementation

Before writing any code, list:
- All files to create or modify
- Build sequence (what to implement first)
- Any ambiguities that need resolution

### 5. Execute

Implement the task following AI-Forge conventions from `.claude/CLAUDE.md`:
- Components: named exports, typed props interface, Tailwind tokens only
- API routes: Zod validation → auth check → Supabase query → `{ data }` or `{ error }`
- Animations: Framer Motion with `useReducedMotion()` check
- Text: all from `src/lib/copy.ts` (COPY constant)

### 6. Verify

```bash
bun run typecheck        # zero TypeScript errors
bun run lint             # zero ESLint errors
bun run test             # related tests pass
```

### 7. Report

Output a summary:
- What was implemented
- Files created/modified
- Decisions made (and why)
- What to test manually
- Branch created: `feat/T{NNN}-{short-name}`

## Important

- Always read the full task spec and all referenced files before writing code
- Follow acceptance criteria exactly — each bullet is a testable requirement
- Don't touch files outside the task's scope
- Branch naming: `feat/T001-scaffold`, `feat/T006-hero`, etc.
- Design tokens: NEVER hardcode `#6366F1` — use `bg-cta` class
