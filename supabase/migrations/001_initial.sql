-- ============================================================
-- TYFMS — Initial schema
-- Run this in your Supabase project's SQL editor
-- ============================================================

-- Profiles table (mentor / mentee networking)
create table if not exists public.profiles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null unique,
  name       text not null,
  branch     text not null,
  mos        text not null,
  role       text not null check (role in ('Mentor', 'Mentee', 'Both')),
  bio        text,
  contact    text not null,
  created_at timestamptz not null default now()
);

-- Goals table (per-user progress tracking)
create table if not exists public.goals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  title      text not null,
  category   text not null default 'Career',
  done       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---- Row-Level Security ----
alter table public.profiles enable row level security;
alter table public.goals    enable row level security;

-- Profiles: publicly readable; owners can insert / update / delete
create policy "profiles_select_all"
  on public.profiles for select using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- Goals: users see and manage only their own rows
create policy "goals_all_own"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
