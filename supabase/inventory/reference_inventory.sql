-- READ-ONLY inventory of the military reference tables as they exist in the
-- live Supabase project. Changes nothing. Paste each block into the Supabase
-- SQL editor and send the results back; they are how the coverage inventory in
-- docs/reference-sources.md gets its real numbers.

-- 1) Which reference tables exist, and how many rows each holds.
select
  t.table_name,
  (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from public.%I', t.table_name), false, true, '')))[1]::text::int as row_count
from information_schema.tables t
where t.table_schema = 'public'
  and t.table_name in (
    'mos_reference_enlisted', 'aoc_reference_officer', 'navy_rating_reference',
    'usmc_mos_reference', 'mil_reference_cache',
    'reference_sources', 'reference_passages', 'reference_code_aliases'
  )
order by t.table_name;

-- 2) The real column layout of each (so migrations never guess).
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'mos_reference_enlisted', 'aoc_reference_officer', 'navy_rating_reference',
    'usmc_mos_reference', 'mil_reference_cache'
  )
order by table_name, ordinal_position;

-- 3) Row-level policies on them (is anything writable by the public key?).
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in (
    'mos_reference_enlisted', 'aoc_reference_officer', 'navy_rating_reference',
    'usmc_mos_reference', 'mil_reference_cache'
  )
order by tablename, policyname;

-- ── 4) How do the LEGACY rows store rank sections? (read-only) ───────────────
-- The legacy tables have no rank column. These show whether rank-specific text
-- was kept at all, or flattened into one duties/goals blob. Send me the output.
-- (If a table or column name differs from your project, just tell me the error.)

select 'mos_reference_enlisted' as table_name, mos_code as code, title,
       length(duties) as duties_chars, length(goals) as goals_chars,
       left(duties, 300) as duties_start, left(goals, 300) as goals_start
from public.mos_reference_enlisted
where mos_code in ('42A', '36B', '25U', '91X')
order by mos_code;

select mos_code,
       (coalesce(duties, '') ~* 'staff sergeant|sergeant first class|master sergeant|sergeant major') as rank_names_in_duties,
       (coalesce(goals,  '') ~* 'staff sergeant|sergeant first class|master sergeant|sergeant major') as rank_names_in_goals,
       (coalesce(duties, '') ~* 'basic leader course|advanced leader course|senior leader course|sergeants major academy') as pme_in_duties
from public.mos_reference_enlisted
where mos_code in ('42A', '36B');

select 'aoc_reference_officer' as table_name, aoc_code as code, title,
       length(characteristics) as characteristics_chars, length(development) as development_chars,
       left(characteristics, 300) as characteristics_start, left(development, 300) as development_start
from public.aoc_reference_officer
where aoc_code in ('36A', '42B', '42H')
order by aoc_code;

-- Any duplicate codes (they would break exact-match lookups)?
select 'mos_reference_enlisted' as table_name, mos_code as code, count(*) from public.mos_reference_enlisted group by mos_code having count(*) > 1
union all
select 'aoc_reference_officer', aoc_code, count(*) from public.aoc_reference_officer group by aoc_code having count(*) > 1;

-- Is the old rank-less cache table still holding rows? (the app no longer reads it)
select count(*) as cached_rows, min(fetched_at) as oldest, max(fetched_at) as newest from public.mil_reference_cache;
