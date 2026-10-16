#!/usr/bin/env node
// Re-links data/reference/corpus/source-audit.{json,md} to the CURRENT bundles after an import, without needing the
// original download inventory. Uses the same disposition rules as audit-reference-corpus.js for imported sources.
import { readFile, writeFile, readdir } from 'node:fs/promises'

const audit = JSON.parse(await readFile('data/reference/corpus/source-audit.json', 'utf8'))
const bundles = await Promise.all((await readdir('data/reference/bundles')).filter(f => f.endsWith('.bundle.json')).map(async f => JSON.parse(await readFile('data/reference/bundles/' + f, 'utf8'))))
for (const s of audit.sources) {
  const matching = bundles.filter(b => b.source.checksum_sha256 === s.sha256)
  s.bundles = matching.map(b => ({ id: b.manifest_id, passages: b.passages.length, occupations: [...new Set(b.passages.map(p => p.personnel_category + ':' + p.occupation_code))] }))
  if (!matching.length) continue
  if (s.group === 'Classification-611-21') {
    s.disposition = 'imported_duties_sampled_review'
    s.note = 'Duties (by skill level or grade) imported from this chapter; verbatim on the cited pages for every passage, visually compared on a sample. Requirements, physical demands, ASIs and standards-of-grade tables are not imported. See data/reference/approvals.json for the review scope.'
  } else {
    s.disposition = 'partially_mapped_not_live_verified'
    s.note = 'Bundles cover only the occupations listed below. Neither full-document coverage nor database approval/deployment is established by this audit.'
  }
}
audit.summary.by_disposition = Object.fromEntries([...new Set(audit.sources.map(s => s.disposition))].map(g => [g, audit.sources.filter(s => s.disposition === g).length]))
await writeFile('data/reference/corpus/source-audit.json', JSON.stringify(audit, null, 2) + '\n')
const clean = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ')
const rows = audit.sources.map(s => `| ${clean(s.path)} | ${s.disposition} | ${s.bundles.map(b => b.occupations.length > 12 ? `${b.occupations.length} codes (${b.id})` : b.occupations.join(', ')).join('; ') || 'None'} |`)
await writeFile('data/reference/corpus/source-audit.md', [
  '# Army source coverage audit', '', audit.summary.completeness, '',
  `${audit.sources.length} PDFs passed file signature and SHA-256 checks against the download inventory. Each has nonempty extracted text. This does not certify the text extraction, source currency, mapping accuracy or live deployment.`, '',
  '| Source | Review disposition | Occupations in existing bundles |', '| --- | --- | --- |', ...rows, '',
].join('\n'))
console.log(JSON.stringify(audit.summary.by_disposition, null, 1))
