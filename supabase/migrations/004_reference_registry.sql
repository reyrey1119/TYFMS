-- Versioned source registry + rank-aware passages for military career references.
--
-- Additive only. It does NOT modify the existing reference tables
-- (mos_reference_enlisted, aoc_reference_officer, navy_rating_reference,
-- usmc_mos_reference, mil_reference_cache); their schemas are not tracked in
-- this repo. The app treats rows in those tables as "unverified" until they are
-- replaced by registry rows imported from a recorded, reviewed publication.
--
-- Run in the Supabase SQL editor. Safe to run more than once.

-- One row per publication (or chapter of one) that passages were extracted from.
create table if not exists public.reference_sources (
  id                 uuid primary key default gen_random_uuid(),
  branch             text not null,
  personnel_category text not null check (personnel_category in ('enlisted', 'warrant', 'officer')),
  publication_number text,                    -- e.g. 'DA PAM 600-25'
  title              text not null,
  chapter            text,                    -- e.g. 'Chapter 4 — MOS 42A'
  career_field       text,                    -- e.g. 'CMF 42'
  proponent          text,
  official_url       text not null check (official_url ~ '^https://'),

  publication_date   date,                    -- date printed on the document
  effective_date     date,                    -- when it took effect, if stated
  last_checked_at    timestamptz,             -- when someone last confirmed it is still current
  uploaded_at        timestamptz not null default now(),  -- when WE ingested it (not the publication date)

  checksum_sha256    text,                    -- of the exact file that was extracted
  ingestion_status   text not null default 'pending' check (ingestion_status in ('pending', 'extracted', 'failed')),
  review_status      text not null default 'unreviewed' check (review_status in ('unreviewed', 'approved', 'rejected')),
  reviewed_by        text,
  reviewed_at        timestamptz,
  superseded_by      uuid references public.reference_sources (id),  -- newer approved source replacing this one
  notes              text                     -- conflicts, access limits, caveats
);

create index if not exists reference_sources_lookup_idx
  on public.reference_sources (branch, personnel_category, review_status);

-- Extracted passages, one per section, with exact page and rank provenance.
create table if not exists public.reference_passages (
  id                 uuid primary key default gen_random_uuid(),
  source_id          uuid not null references public.reference_sources (id) on delete cascade,
  branch             text not null,
  personnel_category text not null check (personnel_category in ('enlisted', 'warrant', 'officer')),
  occupation_code    text not null,           -- exact code, upper-case, no spaces
  occupation_title   text,

  section_type       text not null check (section_type in ('general_duties', 'rank_duties', 'training', 'credentials', 'assignments')),
  -- NULL = applies to every grade. Otherwise 'E-6', 'E-1..E-4', or a comma list 'E-5,E-6'.
  rank_band          text,
  heading            text,                    -- section heading as printed, e.g. 'Staff Sergeant'
  body               text not null,

  pdf_page_start     integer,                 -- PDF page INDEX, not the printed page number
  pdf_page_end       integer,
  printed_page       text,
  sort_order         integer not null default 0
);

create index if not exists reference_passages_lookup_idx
  on public.reference_passages (branch, personnel_category, occupation_code);
create index if not exists reference_passages_source_idx
  on public.reference_passages (source_id);

-- Historical specialty codes. The person's own past code is never overwritten;
-- this only tells the app which current reference to show, and why.
create table if not exists public.reference_code_aliases (
  id                 uuid primary key default gen_random_uuid(),
  branch             text not null,
  personnel_category text not null check (personnel_category in ('enlisted', 'warrant', 'officer')),
  historical_code    text not null,
  current_code       text not null,
  effective_from     date,
  effective_to       date,
  source_id          uuid references public.reference_sources (id),
  note               text,
  unique (branch, personnel_category, historical_code)
);

-- Access: these hold public-domain publications, so approved content is world-
-- readable; only the service role (the import tool) can write.
alter table public.reference_sources      enable row level security;
alter table public.reference_passages     enable row level security;
alter table public.reference_code_aliases enable row level security;

drop policy if exists "approved sources are public" on public.reference_sources;
create policy "approved sources are public" on public.reference_sources
  for select using (review_status = 'approved');

drop policy if exists "passages of approved sources are public" on public.reference_passages;
create policy "passages of approved sources are public" on public.reference_passages
  for select using (exists (
    select 1 from public.reference_sources s
    where s.id = reference_passages.source_id and s.review_status = 'approved'
  ));

drop policy if exists "aliases are public" on public.reference_code_aliases;
create policy "aliases are public" on public.reference_code_aliases
  for select using (true);
