-- An extraction is versioned separately from its source PDF: rank/component
-- mappings and parser corrections can change while the PDF checksum stays fixed.
alter table public.reference_sources
  add column if not exists content_sha256 text;

comment on column public.reference_sources.content_sha256 is
  'SHA-256 of the imported source metadata and passages. Approval SQL targets this exact extraction; cache keys include it.';

-- Existing approvals lack an extraction fingerprint. Review the newly generated
-- imports before approving again; never silently bless a pre-migration mapping.
update public.reference_sources
set review_status = 'unreviewed', reviewed_by = null, reviewed_at = null
where content_sha256 is null and review_status = 'approved';
