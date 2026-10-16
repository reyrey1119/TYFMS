#!/usr/bin/env node
// Accounts for every downloaded source without claiming unreviewed PDFs are
// usable reference data. Offline only; never downloads or changes the database.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({ options: { corpus: { type: 'string' }, out: { type: 'string', default: 'data/reference/corpus' } } })
if (!values.corpus) throw new Error('Usage: node scripts/audit-reference-corpus.js --corpus <downloaded collection folder>')
const inventory = JSON.parse(await readFile(path.join(values.corpus, 'inventory.json'), 'utf8'))
const bundles = await Promise.all((await readdir('data/reference/bundles')).filter(f => f.endsWith('.bundle.json')).map(async f => JSON.parse(await readFile('data/reference/bundles/' + f, 'utf8'))))
const sources = []
for (const entry of inventory) {
  const pdf = await readFile(path.join(values.corpus, entry.relative_path))
  const sha256 = createHash('sha256').update(pdf).digest('hex')
  if (sha256 !== entry.sha256 || !pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error('PDF integrity failure: ' + entry.relative_path)
  const text = await readFile(path.join(values.corpus, entry.relative_path.replace(/\.pdf$/i, '.txt')), 'utf8')
  if (!text.trim()) throw new Error('Empty text: ' + entry.relative_path)
  const matching = bundles.filter(b => b.source.checksum_sha256 === sha256)
  const filename = path.basename(entry.relative_path)
  let disposition = 'pending_mapping_review'
  let note = 'Map exact occupations, grades, components and effective dates; review figures and excluded sections before import.'
  if (/board-products/.test(filename)) {
    disposition = 'promotion_supplement'
    note = 'Keep for provenance and review; promotion-board criteria are not evidence of civilian skills or performed duties.'
  } else if (entry.group === 'Classification-611-21') {
    disposition = 'classification_review'
    note = 'Use to validate codes, titles, grade eligibility and specifications. Do not turn authorization/physical/entry requirements into experience. Check future effective dates.'
  } else if (/slides|career-charts/.test(filename)) {
    disposition = 'figure_review'
    note = 'Slides/charts require visual review; text extraction alone does not verify figure contents or their applicability.'
  } else if (filename === 'ag-da-pam-600-3-25-apr-2024.pdf') {
    disposition = 'older_edition_review'
    note = 'G-1 also links the 26 Jan 2026 AG guide. Compare scope and applicability; do not combine editions as if both were current.'
  } else if (/draft/i.test(filename)) {
    disposition = 'publication_status_review'
    note = 'Officially linked filename contains draft. Verify publication/approval status from the PDF/proponent before treating it as effective guidance.'
  }
  if (matching.length) {
    disposition = 'partially_mapped_not_live_verified'
    note = 'Bundles cover only the occupations listed below. Neither full-document coverage nor database approval/deployment is established by this audit.'
    if (entry.group === 'Classification-611-21') {
      disposition = 'imported_duties_sampled_review'
      note = 'Duties (by skill level or grade) imported from this chapter; verbatim on the cited pages for every passage, visually compared on a sample. Requirements, physical demands, ASIs and standards-of-grade tables are not imported. See data/reference/approvals.json for the review scope.'
    }
  }
  sources.push({
    path: entry.relative_path, group: entry.group, label: entry.label,
    official_url: entry.final_url || entry.url, sha256, bytes: pdf.length,
    downloaded_at: entry.downloaded_at_utc, text_characters: text.length,
    disposition, note,
    bundles: matching.map(b => ({ id: b.manifest_id, passages: b.passages.length, occupations: [...new Set(b.passages.map(p => p.personnel_category + ':' + p.occupation_code))] })),
  })
}
const summary = {
  total_sources: sources.length,
  integrity_checked: sources.length,
  by_group: Object.fromEntries([...new Set(sources.map(s => s.group))].map(g => [g, sources.filter(s => s.group === g).length])),
  by_disposition: Object.fromEntries([...new Set(sources.map(s => s.disposition))].map(g => [g, sources.filter(s => s.disposition === g).length])),
  completeness: 'NOT ESTABLISHED: a downloaded or text-extracted PDF is not a reviewed specialty/rank/component mapping. Live database state is not checked by this command.',
}
await mkdir(values.out, { recursive: true })
await writeFile(path.join(values.out, 'source-audit.json'), JSON.stringify({ summary, sources }, null, 2) + '\n')
const clean = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ')
const rows = sources.map(s => `| ${clean(s.path)} | ${s.disposition} | ${s.bundles.map(b => b.occupations.join(', ')).join('; ') || 'None'} |`)
await writeFile(path.join(values.out, 'source-audit.md'), [
  '# Army source coverage audit', '', summary.completeness, '',
  `${sources.length} PDFs passed file signature and SHA-256 checks against the download inventory. Each has nonempty extracted text. This does not certify the text extraction, source currency, mapping accuracy or live deployment.`, '',
  '| Source | Review disposition | Occupations in existing bundles |', '| --- | --- | --- |', ...rows, '',
].join('\n'))
console.log(JSON.stringify(summary, null, 2))
