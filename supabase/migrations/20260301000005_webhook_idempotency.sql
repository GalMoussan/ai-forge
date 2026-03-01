-- Add stripe_session_id to supports for webhook idempotency
alter table public.supports
  add column if not exists stripe_session_id text unique;

comment on column public.supports.stripe_session_id is
  'Stripe Checkout Session ID — prevents duplicate webhook processing';
