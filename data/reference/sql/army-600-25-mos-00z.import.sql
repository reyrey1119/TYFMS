-- Import: army-600-25-mos-00z
-- 2 passages from DA PAM 600-25: Nominative CSM/SGM (MOS 00Z)
-- Imported as review_status='unreviewed'; it is NOT served to users until approved.
begin;
insert into public.reference_sources
  (id, branch, personnel_category, publication_number, title, chapter, career_field, proponent, official_url,
   publication_date, effective_date, last_checked_at, checksum_sha256, ingestion_status, review_status, notes, extraction_tool, import_batch, content_sha256)
values ('c9d0af13-e548-50ae-be44-5411996836cc', 'Army', 'enlisted', 'DA PAM 600-25', 'Nominative CSM/SGM (MOS 00Z)', null, 'mos-00z', null, 'https://api.army.mil/e2/c/downloads/2022/07/12/a7e6965d/mos-00z.pdf',
   '2022-07-12', null, '2026-10-18T00:00:00Z', '2eddf9e5df4b40308d43b64f6587ac6385243447f2353632eca04ff062d653a4', 'extracted', 'unreviewed', 'Date basis: the date is the upload date in the official URL path (…/2022/07/12/…); the PDF prints no date. Imported for 00Z. Duties and prerequisites are NOT imported from this guide (DA PAM 611-21 is the source for them); promotion-board criteria are stored but never shown. LIMITATIONS: Reserve Component chapters and professional-development-model figures are not imported; career-field-wide rank guidance is attached to every MOS of this guide that has its own chapter.', 'pdf-parse 2.4.5', 'army-600-25-mos-00z@2026-10-18', '5623b9741c09600b400f7a58f4b8f7f63e429c7fcd6fbcc27b1c11ed9a160818')
on conflict (id) do update set
  publication_number = excluded.publication_number, title = excluded.title, career_field = excluded.career_field, proponent = excluded.proponent,
  official_url = excluded.official_url, publication_date = excluded.publication_date, last_checked_at = excluded.last_checked_at,
  checksum_sha256 = excluded.checksum_sha256, ingestion_status = 'extracted', notes = excluded.notes,
  extraction_tool = excluded.extraction_tool, import_batch = excluded.import_batch,
  branch = excluded.branch, personnel_category = excluded.personnel_category,
  chapter = excluded.chapter, effective_date = excluded.effective_date,
  content_sha256 = excluded.content_sha256,
  review_status = 'unreviewed', reviewed_by = null, reviewed_at = null;
delete from public.reference_passages where source_id = 'c9d0af13-e548-50ae-be44-5411996836cc';
insert into public.reference_passages
  (id, source_id, branch, personnel_category, occupation_code, occupation_title, section_type, rank_band, components, heading, chapter, body, body_sha256, pdf_page_start, pdf_page_end, printed_page, sort_order, effective_from, effective_to, cumulative, skill_level)
values
  ('fb787ef1-8252-5a25-9cd8-0837f670b696', 'c9d0af13-e548-50ae-be44-5411996836cc', 'Army', 'enlisted', '00Z', null, 'development', 'E-9', null, 'Sergeants Major — overview', 'Chapter 2. MOS 00Z Nominative Sergeant Major', '00Z is the capstone for all MOSs within the Army at the General Officer level. Important assignments are those at the Battalion and Brigade level operations or broadening positions that are necessary in development and eligibility to potentially serve at the nominative level. 00Z is not a guarantee and is only awarded if selected to serve at the nominative level. Once the nominative tour is complete MOS 00Z is revoked and the NCO is reverted back to their original MOS at the E9 level.', '04cd4d20f30a1254b3b1a9ba96991bc1c4260b6308000ea305cac045e75c6922', 2, 2, null, 0, null, null, false, null),
  ('9de85d08-cbd2-56ea-abf7-42ec5e87cd4d', 'c9d0af13-e548-50ae-be44-5411996836cc', 'Army', 'enlisted', '00Z', null, 'development', 'E-9', null, 'Sergeants Major — Command Sergeants Major', 'Chapter 2. MOS 00Z Nominative Sergeant Major', '00Z is the capstone for all MOSs within the Army at the General Officer level. Important assignments are those serving successfully as Battalion and Brigade Command Sergeants Major that are necessary in development and eligibility to potentially serve at the nominative level. 00Z is not a guarantee and is only awarded if selected to serve at the nominative level. Once the nominative tour is complete MOS 00Z is revoked and the NCO is reverted back to their original MOS at the E9 level.
d. Self-development. Civilian education is not a requirement for selection to a nominative position. However, continuing civilian education (completion of bachelors and master’s degree) is encouraged. Degrees enable senior leaders to think at the strategic level, a key goal of the nominative Sergeant Major.', 'ab5ba33248a6157cc981a2bd17fe7c31b4654cd61ebfcf6d08939219d50f6cbf', 2, 2, null, 1, null, null, false, null);
commit;
