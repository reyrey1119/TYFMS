-- Follow-up to 004. Adds component-specific passages (Active / Reserve / Guard),
-- the section types the real Army career guides use, and content checksums.
--
-- Written as 005 (not an edit of 004) so it is correct whether or not 004 has
-- already been run. Safe to run more than once. Additive: no data is deleted.

-- Which components a passage applies to. NULL = every component. Otherwise a
-- comma list of: active, reserve, guard   e.g. 'reserve,guard'.
alter table public.reference_passages
  add column if not exists components text;

alter table public.reference_passages
  drop constraint if exists reference_passages_components_check;
alter table public.reference_passages
  add constraint reference_passages_components_check
  check (components is null or components ~ '^(active|reserve|guard)(,(active|reserve|guard))*$');

-- Section types, matching how the source documents are actually organised.
-- promotion_criteria is stored for completeness but is never sent to a model
-- or shown in a translation (it describes board selection, not the work).
alter table public.reference_passages
  drop constraint if exists reference_passages_section_type_check;
alter table public.reference_passages
  add constraint reference_passages_section_type_check
  check (section_type in (
    'general_duties',      -- what the specialty does (all grades)
    'rank_duties',         -- what is expected at a grade
    'assignments',         -- operational / generating / broadening / key developmental
    'training',            -- institutional training, PME, functional courses, education
    'lifelong_learning',
    'self_development',
    'credentials',         -- recommended civilian credentials/certifications
    'development',         -- general career-development guidance
    'prerequisites',
    'promotion_criteria',
    'grades_authorized'    -- added with 007; listed here too so re-running 005 after 007 never rejects existing rows
  ));

-- Where in the document this came from, and a fingerprint for review diffs.
alter table public.reference_passages
  add column if not exists chapter text,            -- e.g. 'Chapter 4. MOS 42A'
  add column if not exists body_sha256 text;

-- How the text was extracted (so a re-import with a newer tool is visible).
alter table public.reference_sources
  add column if not exists extraction_tool text,
  add column if not exists import_batch text;

create index if not exists reference_passages_components_idx
  on public.reference_passages (branch, personnel_category, occupation_code, components);
