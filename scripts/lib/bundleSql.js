// Bundle → idempotent SQL for the Supabase SQL editor.
//
// Re-running replaces that one source's passages in a single transaction.
// Sources are imported as 'unreviewed' (never served) — approval is a separate,
// deliberate step (see approveSql) done after a person has compared the passages
// with the PDF.

import { createHash } from 'node:crypto'

// Deterministic UUID (v5-style) so re-imports update rows instead of duplicating.
export function stableUuid(name) {
  const h = createHash('sha1').update(`tyfms-reference|${name}`).digest()
  h[6] = (h[6] & 0x0f) | 0x50
  h[8] = (h[8] & 0x3f) | 0x80
  const x = h.subarray(0, 16).toString('hex')
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20, 32)}`
}

// Fingerprint the extraction and its meaning, not just the PDF bytes. A parser or
// rank/component mapping change requires a new review even with the same PDF.
export function bundleContentHash(bundle) {
  return createHash('sha256').update(JSON.stringify({
    source: bundle.source,
    passages: bundle.passages,
  })).digest('hex')
}

const q = v => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const n = v => (v === null || v === undefined ? 'null' : String(Number(v)))

export function importSql(bundle) {
  const s = bundle.source
  const out = []
  out.push(`-- Import: ${bundle.manifest_id}`)
  out.push(`-- ${bundle.passages.length} passages from ${s.publication_number}: ${s.title}`)
  out.push(`-- Imported as review_status='unreviewed'; it is NOT served to users until approved.`)
  out.push('begin;')
  out.push(`insert into public.reference_sources
  (id, branch, personnel_category, publication_number, title, chapter, career_field, proponent, official_url,
   publication_date, effective_date, last_checked_at, checksum_sha256, ingestion_status, review_status, notes, extraction_tool, import_batch, content_sha256)
values (${q(s.id)}, ${q(s.branch)}, ${q(s.personnel_category)}, ${q(s.publication_number)}, ${q(s.title)}, ${q(s.chapter)}, ${q(s.career_field)}, ${q(s.proponent)}, ${q(s.official_url)},
   ${q(s.publication_date)}, ${q(s.effective_date)}, ${q(s.last_checked_at)}, ${q(s.checksum_sha256)}, 'extracted', 'unreviewed', ${q(s.notes)}, ${q(s.extraction_tool)}, ${q(bundle.import_batch)}, ${q(bundleContentHash(bundle))})
on conflict (id) do update set
  publication_number = excluded.publication_number, title = excluded.title, career_field = excluded.career_field, proponent = excluded.proponent,
  official_url = excluded.official_url, publication_date = excluded.publication_date, last_checked_at = excluded.last_checked_at,
  checksum_sha256 = excluded.checksum_sha256, ingestion_status = 'extracted', notes = excluded.notes,
  extraction_tool = excluded.extraction_tool, import_batch = excluded.import_batch,
  branch = excluded.branch, personnel_category = excluded.personnel_category,
  chapter = excluded.chapter, effective_date = excluded.effective_date,
  content_sha256 = excluded.content_sha256,
  review_status = 'unreviewed', reviewed_by = null, reviewed_at = null;`)
  out.push(`delete from public.reference_passages where source_id = ${q(s.id)};`)
  out.push(`insert into public.reference_passages
  (id, source_id, branch, personnel_category, occupation_code, occupation_title, section_type, rank_band, components, heading, chapter, body, body_sha256, pdf_page_start, pdf_page_end, printed_page, sort_order, effective_from, effective_to, cumulative, skill_level)
values`)
  out.push(bundle.passages.map(p =>
    `  (${q(p.id)}, ${q(s.id)}, ${q(p.branch)}, ${q(p.personnel_category)}, ${q(p.occupation_code)}, ${q(p.occupation_title)}, ${q(p.section_type)}, ${q(p.rank_band)}, ${q(p.components)}, ${q(p.heading)}, ${q(p.chapter)}, ${q(p.body)}, ${q(p.body_sha256)}, ${n(p.pdf_page_start)}, ${n(p.pdf_page_end)}, ${q(p.printed_page)}, ${n(p.sort_order)}, ${q(p.effective_from)}, ${q(p.effective_to)}, ${p.cumulative ? 'true' : 'false'}, ${n(p.skill_level)})`
  ).join(',\n') + ';')
  out.push('commit;')
  return out.join('\n') + '\n'
}

// Run this only after a person has compared the passages with the PDF.
export function approveSql(bundle, reviewer) {
  return `-- Approve ${bundle.manifest_id}. Run only after reviewing the extraction against the PDF.
update public.reference_sources
set review_status = 'approved', reviewed_by = ${q(reviewer)}, reviewed_at = now(), last_checked_at = coalesce(last_checked_at, now())
where id = ${q(bundle.source.id)}
  and content_sha256 = ${q(bundleContentHash(bundle))}
returning id, title, content_sha256, review_status;
`
}
