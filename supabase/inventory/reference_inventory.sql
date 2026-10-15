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
