-- Passage-level effective dates and skill-level structure for DA PAM 611-21.
--
-- A specification can change mid-edition ("(Effective 202610)"), so a passage carries its own effective window.
-- Enlisted skill levels can say "performs the duties of the preceding skill level"; `cumulative` keeps that
-- relationship so retrieval can include the lower levels.

alter table public.reference_passages add column if not exists effective_from date;
alter table public.reference_passages add column if not exists effective_to   date;
alter table public.reference_passages add column if not exists cumulative     boolean not null default false;
alter table public.reference_passages add column if not exists skill_level    smallint;

comment on column public.reference_passages.effective_from is 'First day this passage applies (from a dated marker such as "Effective 202610"); null = no stated start.';
comment on column public.reference_passages.effective_to   is 'Day this passage stops applying (the next version takes over); null = still in force.';
comment on column public.reference_passages.cumulative     is 'True when the passage says the grade also performs the duties of the lower level(s).';

alter table public.reference_passages drop constraint if exists reference_passages_section_type_check;
alter table public.reference_passages
  add constraint reference_passages_section_type_check
  check (section_type in (
    'general_duties', 'rank_duties', 'assignments', 'training', 'lifelong_learning', 'self_development',
    'credentials', 'development', 'prerequisites', 'promotion_criteria',
    'grades_authorized'    -- officer AOCs: grades the AOC is authorized at / special grading of positions
  ));
