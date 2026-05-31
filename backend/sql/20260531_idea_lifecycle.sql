-- Idea lifecycle fields for the museum resurrection flow and curator seed.
-- Run this in Supabase SQL editor before using seed/revive/die-again in production.

create extension if not exists pgcrypto;

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  idea_hash text not null,
  nome text not null,
  categoria text not null,
  empolgacao integer not null,
  motivo text not null,
  survival_percentage integer not null default 0,
  cause_of_death_summary text,
  ai_verdict text,
  honor_count integer not null default 0,
  status text not null default 'abandoned',
  user_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists ideas_user_hash_unique
  on public.ideas (user_id, idea_hash);

create table if not exists public.idea_events (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references public.ideas(id) on delete cascade,
  user_id text,
  type text not null,
  points integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.ideas
  add column if not exists revival_attempts integer not null default 0,
  add column if not exists last_revived_at timestamptz,
  add column if not exists died_again_at timestamptz,
  add column if not exists death_count integer not null default 0,
  add column if not exists last_death_reason text,
  add column if not exists source text not null default 'usuario',
  add column if not exists is_seed boolean not null default false;

update public.ideas
set status = 'abandoned'
where status = 'active';
