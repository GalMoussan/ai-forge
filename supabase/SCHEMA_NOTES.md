# Schema Notes — AI-Forge

Verified: 2026-02-27
Migration files reviewed:
- `supabase/migrations/20260227000001_initial_schema.sql`
- `supabase/migrations/20260227000002_seed_data.sql`

---

## Tables

### `profiles`
Extends `auth.users` with public display info.

| Column       | Type        | Constraints                              |
|--------------|-------------|------------------------------------------|
| `id`         | UUID        | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `username`   | TEXT        | UNIQUE, nullable                         |
| `avatar_url` | TEXT        | nullable                                 |
| `created_at` | TIMESTAMPTZ | DEFAULT now()                            |

---

### `ideas`
Core foundry items — the proposals users vote on.

| Column          | Type          | Constraints                                              |
|-----------------|---------------|----------------------------------------------------------|
| `id`            | UUID          | PK, DEFAULT gen_random_uuid()                            |
| `created_at`    | TIMESTAMPTZ   | DEFAULT now()                                            |
| `title`         | TEXT          | NOT NULL, CHECK char_length BETWEEN 5 AND 100            |
| `description`   | TEXT          | NOT NULL, CHECK char_length BETWEEN 20 AND 1000          |
| `submitter_id`  | UUID          | FK → `profiles(id)` ON DELETE SET NULL, nullable         |
| `category`      | idea_category | NOT NULL, DEFAULT 'other'                                |
| `status`        | idea_status   | DEFAULT 'active'                                         |
| `vote_count`    | INT           | DEFAULT 0, CHECK >= 0 — TRIGGER-MANAGED, never write directly |
| `backer_count`  | INT           | DEFAULT 0, CHECK >= 0                                    |
| `vote_threshold`| INT           | DEFAULT 500                                              |
| `funding_goal`  | INT           | nullable — cents, Phase 2 only                           |
| `funding_raised`| INT           | DEFAULT 0 — cents                                        |
| `tags`          | TEXT[]        | DEFAULT '{}'                                             |
| `image_url`     | TEXT          | nullable                                                 |

Indexes:
- `ideas_vote_count_idx` ON `vote_count DESC` (primary sort in Foundry)
- `ideas_status_idx` ON `status`
- `ideas_created_at_idx` ON `created_at DESC`

---

### `supports`
Votes (Phase 1) and pledges (Phase 2) per user per idea.

| Column       | Type         | Constraints                              |
|--------------|--------------|------------------------------------------|
| `id`         | UUID         | PK, DEFAULT gen_random_uuid()            |
| `created_at` | TIMESTAMPTZ  | DEFAULT now()                            |
| `idea_id`    | UUID         | NOT NULL, FK → `ideas(id)` ON DELETE CASCADE |
| `user_id`    | UUID         | NOT NULL, FK → `profiles(id)` ON DELETE CASCADE |
| `type`       | support_type | DEFAULT 'vote'                           |
| `amount`     | INT          | nullable — cents, Phase 2 pledges only   |
|              |              | UNIQUE(idea_id, user_id) — one support per user per idea |

Indexes:
- `supports_idea_id_idx` ON `idea_id`
- `supports_user_id_idx` ON `user_id`

---

### `comments`
Threaded discussion on ideas.

| Column       | Type        | Constraints                                          |
|--------------|-------------|------------------------------------------------------|
| `id`         | UUID        | PK, DEFAULT gen_random_uuid()                        |
| `created_at` | TIMESTAMPTZ | DEFAULT now()                                        |
| `idea_id`    | UUID        | NOT NULL, FK → `ideas(id)` ON DELETE CASCADE         |
| `user_id`    | UUID        | NOT NULL, FK → `profiles(id)` ON DELETE CASCADE      |
| `content`    | TEXT        | NOT NULL, CHECK char_length BETWEEN 1 AND 2000       |
| `parent_id`  | UUID        | FK → `comments(id)` ON DELETE CASCADE, nullable (threading) |

Indexes:
- `comments_idea_id_idx` ON `idea_id`
- `comments_parent_id_idx` ON `parent_id`

---

## ENUMs

| Enum             | Values                                                  |
|------------------|---------------------------------------------------------|
| `idea_status`    | `active`, `threshold_reached`, `building`, `launched`   |
| `idea_category`  | `automation`, `creativity`, `productivity`, `analysis`, `other` |
| `support_type`   | `vote`, `pledge`                                        |

---

## Trigger Functions

### `handle_new_user()`
- Fires: `AFTER INSERT ON auth.users` (trigger: `on_auth_user_created`)
- Action: Auto-creates a row in `public.profiles` using the new user's `id`, email prefix as `username`, and `avatar_url` from `raw_user_meta_data`.
- Security: `SECURITY DEFINER` — runs with elevated privileges to bypass RLS on insert.

### `increment_vote_count()`
- Fires: `AFTER INSERT ON supports` (trigger: `on_vote_inserted`) — only when `NEW.type = 'vote'`
- Action: Increments `ideas.vote_count` by 1 for the inserted `idea_id`.
- Floor: Not needed on insert (count always goes up).

### `decrement_vote_count()`
- Fires: `AFTER DELETE ON supports` (trigger: `on_vote_deleted`) — only when `OLD.type = 'vote'`
- Action: Decrements `ideas.vote_count` by 1 using `GREATEST(vote_count - 1, 0)` — floored at 0, prevents negative counts.

---

## RLS Policies

### `profiles`
| Policy | Operation | Rule |
|--------|-----------|------|
| Public profiles are viewable by everyone | SELECT | `true` |
| Users can insert their own profile | INSERT | `auth.uid() = id` |
| Users can update their own profile | UPDATE | `auth.uid() = id` |

### `ideas`
| Policy | Operation | Rule |
|--------|-----------|------|
| Ideas are viewable by everyone | SELECT | `true` |
| Authenticated users can create ideas | INSERT | `auth.role() = 'authenticated'` |
| Users can update their own ideas | UPDATE | `auth.uid() = submitter_id` |

Note: No DELETE policy on ideas — deletions are admin-only (no self-serve delete in Phase 1).

### `supports`
| Policy | Operation | Rule |
|--------|-----------|------|
| Supports are viewable by everyone | SELECT | `true` |
| Authenticated users can support ideas | INSERT | `auth.uid() = user_id` |
| Users can remove their own support | DELETE | `auth.uid() = user_id` |

Note: No UPDATE policy on supports — supports are immutable (type cannot change after insert).

### `comments`
| Policy | Operation | Rule |
|--------|-----------|------|
| Comments are viewable by everyone | SELECT | `true` |
| Authenticated users can comment | INSERT | `auth.uid() = user_id` |
| Users can update their own comments | UPDATE | `auth.uid() = user_id` |
| Users can delete their own comments | DELETE | `auth.uid() = user_id` |

---

## Realtime

Enabled via `ALTER PUBLICATION supabase_realtime ADD TABLE`:
- `ideas` — for live vote count updates
- `supports` — for vote state changes
- `comments` — for live comment feeds

---

## Seed Data (`20260227000002_seed_data.sql`)

5 sample ideas inserted with `submitter_id = NULL` (anonymous), pre-populated vote counts:

| Title | Category | Vote Count |
|-------|----------|------------|
| AI Meeting Summarizer | productivity | 342 |
| Personal Brand Voice AI | creativity | 287 |
| Code Review Explainer | automation | 201 |
| AI Research Digest | analysis | 178 |
| Prompt Library Manager | productivity | 156 |

Note: Seed data sets `vote_count` directly (bypasses trigger). This is correct for seeding since no `supports` rows are created for seed votes — the trigger only fires on real `supports` inserts.

---

## Verification Results

All acceptance criteria from T002 are satisfied:

- [x] All 4 tables created: `profiles`, `ideas`, `supports`, `comments`
- [x] All 3 ENUMs created: `idea_status`, `idea_category`, `support_type`
- [x] All indexes created (vote_count DESC, status, created_at, idea_id x2, user_id, parent_id)
- [x] RLS enabled on all 4 tables
- [x] Anonymous SELECT allowed on all tables via `USING (true)` policies
- [x] Anonymous INSERT/UPDATE/DELETE blocked (no policies grant this)
- [x] Authenticated users can INSERT ideas (`auth.role() = 'authenticated'`)
- [x] Authenticated users can INSERT supports (`auth.uid() = user_id`)
- [x] Double-vote blocked by `UNIQUE(idea_id, user_id)` constraint
- [x] Users can DELETE only their own support (`auth.uid() = user_id`)
- [x] `on_vote_inserted` trigger increments `vote_count` on vote insert
- [x] `on_vote_deleted` trigger decrements `vote_count` (floored at 0 via GREATEST)
- [x] `on_auth_user_created` trigger auto-creates profile on signup
- [x] Realtime enabled on `ideas`, `supports`, `comments`
- [x] Seed data: 5 ideas ready for The Foundry

## Issues Found

None. Both migration files are complete, correct, and consistent with the `src/types/database.ts` type definitions. The schema is ready to be applied via Supabase dashboard or CLI.
