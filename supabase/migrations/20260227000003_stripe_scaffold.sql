-- Add pledge_amount column to ideas for Phase 2 payment tracking
alter table public.ideas
  add column if not exists pledge_amount integer default null;

comment on column public.ideas.pledge_amount is 'User pledge amount in cents (Phase 2 only, requires payment activation)';
