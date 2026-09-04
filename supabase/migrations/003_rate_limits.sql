-- ============================================================
-- TYFMS — Rate limiting for the public AI endpoints
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ============================================================

create table if not exists public.rate_limits (
  key          text primary key,
  count        int  not null default 0,
  window_start timestamptz not null default now()
);

-- No RLS policies are added on purpose: this table is only ever touched
-- through check_rate_limit() below (SECURITY DEFINER) via the service-role
-- key, never read/written directly by client code.
alter table public.rate_limits enable row level security;

-- Atomic check-and-increment. Returns true if the caller is still under
-- p_max_count within the trailing p_window_seconds window; false if the
-- caller should be told to slow down. Safe under concurrent requests —
-- the whole read-modify-write happens inside one statement.
create or replace function public.check_rate_limit(
  p_key text,
  p_window_seconds int,
  p_max_count int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case
      when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
        then 1
      else public.rate_limits.count + 1
    end,
    window_start = case
      when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
        then now()
      else public.rate_limits.window_start
    end
  returning count into v_count;

  return v_count <= p_max_count;
end;
$$;

-- Periodic cleanup so the table doesn't grow forever. Safe to run manually
-- any time, or wire up as a Supabase cron / pg_cron job later:
--   select cron.schedule('rate_limits_cleanup', '0 * * * *',
--     $$delete from public.rate_limits where window_start < now() - interval '1 day'$$);
create or replace function public.cleanup_rate_limits() returns void
language sql
security definer
set search_path = public
as $$
  delete from public.rate_limits where window_start < now() - interval '1 day';
$$;
