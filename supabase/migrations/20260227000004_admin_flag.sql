-- Add flagging capability to ideas
alter table public.ideas
  add column if not exists is_flagged boolean not null default false;

-- Add 'flagged' to the status enum
alter type public.idea_status add value if not exists 'flagged';

comment on column public.ideas.is_flagged is 'Set to true by admin to hide spam/inappropriate ideas';

-- Update RLS: hide flagged ideas from public reads
drop policy if exists "Ideas are viewable by everyone" on public.ideas;

create policy "Ideas are viewable by everyone"
  on public.ideas for select
  using (is_flagged = false);
