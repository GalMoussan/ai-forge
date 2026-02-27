# Design Schema — AI-Forge

Design a Zod validation schema for API input, following AI-Forge's validation conventions.

## Input

Schema name + context: $ARGUMENTS
Examples: `CreateComment`, `UpdateProfile`, `FilterIdeas`

## Process

### 1. Understand Requirements

Determine:
- What data is being validated? (API request body, query params, form data)
- Which API route will use this? (`src/app/api/...`)
- What are the constraints? (length limits, enum values, required vs optional)

### 2. Explore Existing Patterns

Read `src/types/database.ts` for the source-of-truth column definitions.
Read existing API routes in `src/app/api/` to see how schemas are currently written.

### 3. Design the Schema

```typescript
// Always: Zod schema → inferred type → named export
import { z } from 'zod'
import type { IdeaCategory } from '@/types/database'

// Validation schema for API input
export const CreateIdeaSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  category: z.enum(['automation', 'creativity', 'productivity', 'analysis', 'other']),
  tags: z.array(z.string().max(30)).max(10).default([]),
})

// Infer TypeScript type from schema
export type CreateIdeaInput = z.infer<typeof CreateIdeaSchema>
```

### 4. Usage in API Route

```typescript
const parsed = CreateIdeaSchema.safeParse(body)
if (!parsed.success) {
  return Response.json({ error: parsed.error.flatten() }, { status: 422 })
}
// parsed.data is now typed as CreateIdeaInput
```

### 5. Conventions to Follow

- Schema name: `{Verb}{Noun}Schema` (CreateIdea, UpdateProfile, FilterIdeas)
- Type name: `{Verb}{Noun}Input` (inferred from schema)
- Error messages: human-readable, start with capital letter
- Enums: match exactly the database `idea_category` and `idea_status` enums
- Never include `id` or `created_at` in input schemas (DB-generated)
- Never include `vote_count` in input schemas (trigger-managed)

## Output

- Zod schema definition
- Inferred TypeScript type
- Usage example in an API route
- Note on which routes should import this schema
