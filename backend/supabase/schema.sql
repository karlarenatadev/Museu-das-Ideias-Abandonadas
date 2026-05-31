  -- Museu das Ideias Abandonadas - Supabase schema
-- Run this in the Supabase SQL editor before enabling persistence.

create extension if not exists "pgcrypto";

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  idea_hash text not null,
  nome text not null,
  categoria text not null,
  empolgacao integer not null check (empolgacao between 1 and 5),
  motivo text not null,
  survival_percentage integer not null check (survival_percentage between 0 and 100),
  cause_of_death_summary text not null,
  ai_verdict text not null,
  honor_count integer not null default 0,
  resurrection_count integer not null default 0,
  status text not null default 'active' check (status in ('active', 'archived')),
  user_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists ideas_user_hash_active_idx
  on public.ideas (user_id, idea_hash)
  where status = 'active';

create index if not exists ideas_user_status_created_idx
  on public.ideas (user_id, status, created_at desc);

create table if not exists public.idea_events (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  user_id text,
  type text not null,
  points integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idea_events_idea_created_idx
  on public.idea_events (idea_id, created_at desc);

create index if not exists idea_events_user_created_idx
  on public.idea_events (user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ideas_set_updated_at on public.ideas;
create trigger ideas_set_updated_at
before update on public.ideas
for each row
execute function public.set_updated_at();
