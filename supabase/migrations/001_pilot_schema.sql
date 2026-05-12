create extension if not exists pgcrypto;

create table if not exists public.pilot_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  age integer not null check (age between 10 and 25),
  grade integer not null check (grade between 1 and 12),
  created_at timestamptz not null default now()
);

create table if not exists public.pilot_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.pilot_users(id) on delete cascade,
  question_id text not null,
  variant_chosen text not null,
  response_time_ms integer not null check (response_time_ms >= 0),
  answered_at timestamptz not null default now()
);

create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.pilot_users(id) on delete cascade,
  age_group text not null default '15-17',
  tariff text not null default 'pro',
  scores jsonb not null default '{}'::jsonb,
  behavioral jsonb not null default '{}'::jsonb,
  shein_anchors jsonb not null default '{}'::jsonb,
  report jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

alter table public.pilot_users enable row level security;
alter table public.pilot_answers enable row level security;
alter table public.diagnostic_sessions enable row level security;

create policy "pilot users can insert own profile"
on public.pilot_users for insert
to authenticated
with check (id = auth.uid());

create policy "pilot users can read own profile"
on public.pilot_users for select
to authenticated
using (id = auth.uid());

create policy "pilot users can insert own answers"
on public.pilot_answers for insert
to authenticated
with check (user_id = auth.uid());

create policy "pilot users can read own answers"
on public.pilot_answers for select
to authenticated
using (user_id = auth.uid());

create policy "pilot users can insert own sessions"
on public.diagnostic_sessions for insert
to authenticated
with check (user_id = auth.uid());

create policy "pilot users can read own sessions"
on public.diagnostic_sessions for select
to authenticated
using (user_id = auth.uid());

grant usage on schema public to authenticated;
grant select, insert on public.pilot_users to authenticated;
grant select, insert on public.pilot_answers to authenticated;
grant select, insert on public.diagnostic_sessions to authenticated;
