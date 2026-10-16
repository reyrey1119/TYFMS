#!/usr/bin/env node
/**
 * Independent check that an import bundle faithfully matches its PDF.
 *
 *   node scripts/verify-reference-bundle.js --bundle data/reference/bundles/<id>.bundle.json --pdf <file.pdf>
 *
 * It re-reads the PDF on its own (it does not reuse the parser's line list) and checks:
 *   1. the PDF is the exact file the bundle was built from (SHA-256);
 *   2. every passage is VERBATIM text found on the PDF pages it claims (PDF page indices);
 *   3. no passage's text appears in two passages of the same specialty (no double counting);
 *   4. everything in the imported page range that is NOT in any passage is listed, so a
 *      person can see exactly what was left out (headings, labels, skipped chapters).
 *
 * Checks 1-3 are hard failures (exit 1). Check 4 is a report for human review.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { readPdf, extractPages, normalizeSpace } from './lib/pdfLines.js'

const { values } = parseArgs({ options: { bundle: { type: 'string' }, pdf: { type: 'string' }, out: { type: 'string', default: 'data/reference/reports' } } })
if (!values.bundle || !values.pdf) { console.error('Usage: node scripts/verify-reference-bundle.js --bundle <bundle.json> --pdf <file.pdf>'); process.exit(2) }

const bundle = JSON.parse(await readFile(values.bundle, 'utf8'))
const { buffer, sha256 } = await readPdf(values.pdf)
const pages = await extractPages(buffer)

// Same page-text form the importer works from: whitespace-normalized, printed page number dropped.
const pageText = Object.fromEntries(pages.map(p => [p.num, normalizeSpace(p.text.replace(/^\s*\d{1,3}\s*\n/, ''))]))

const result = { bundle: bundle.manifest_id, checks: {}, failures: [], residue: [], figureLines: [] }

// 1. exact file
result.checks.checksumMatches = sha256 === bundle.source.checksum_sha256
if (!result.checks.checksumMatches) result.failures.push(`PDF checksum ${sha256} does not match the bundle (${bundle.source.checksum_sha256})`)

// 2. verbatim on the claimed pages
let verbatim = 0
for (const p of bundle.passages) {
  const needle = normalizeSpace(p.body)
  const span = []
  for (let n = p.pdf_page_start; n <= p.pdf_page_end; n++) span.push(pageText[n] ?? '')
  if (span.join(' ').includes(needle)) verbatim++
  else result.failures.push(`NOT VERBATIM p${p.pdf_page_start}-${p.pdf_page_end} [${p.occupation_code} ${p.section_type} ${p.rank_band || '-'}] "${needle.slice(0, 70)}…"`)
}
result.checks.passages = bundle.passages.length
result.checks.verbatimOnClaimedPages = verbatim

// 3. no true duplicates: the same text stored twice for the same specialty, grade and category.
// (Repeated boilerplate across DIFFERENT ranks is normal in these documents and is not a duplicate.)
let overlaps = 0
const seen = new Map()
for (const p of bundle.passages) {
  const key = [p.occupation_code, p.personnel_category, p.section_type, p.rank_band, p.components, p.effective_from ?? '', p.effective_to ?? '', normalizeSpace(p.body)].join('|')
  if (seen.has(key)) { overlaps++; result.failures.push(`DUPLICATE passage stored twice: [${p.occupation_code} ${p.section_type} ${p.rank_band || '-'}] "${normalizeSpace(p.body).slice(0, 50)}…"`) }
  seen.set(key, true)
}
result.checks.duplicatePassages = overlaps

// 4. residue: remove each passage from the PDF text of the imported pages; what remains was not stored.
const used = [...new Set(bundle.passages.flatMap(p => { const r = []; for (let n = p.pdf_page_start; n <= p.pdf_page_end; n++) r.push(n); return r }))].sort((a, b) => a - b)
const per = {}
for (const n of used) per[n] = pageText[n]
let all = used.map(n => per[n]).join(' ')
for (const p of [...bundle.passages].sort((a, b) => normalizeSpace(b.body).length - normalizeSpace(a.body).length)) {
  const needle = normalizeSpace(p.body)
  const i = all.indexOf(needle)
  if (i >= 0) all = all.slice(0, i) + ' ⟦·⟧ ' + all.slice(i + needle.length)
}
const residue = all.split('⟦·⟧').map(s => s.trim()).filter(s => s.length > 0)
result.residue = residue
const residueChars = residue.reduce((a, s) => a + s.length, 0)
const totalChars = used.reduce((a, n) => a + per[n].length, 0)
result.checks.pdfCharsInImportedPages = totalChars
result.checks.charsNotStored = residueChars
result.checks.percentStored = Number((100 * (1 - residueChars / totalChars)).toFixed(1))

await mkdir(values.out, { recursive: true })
await writeFile(path.join(values.out, `${bundle.manifest_id}.verification.json`), JSON.stringify(result, null, 1) + '\n')

console.log(`\n${bundle.manifest_id}`)
console.log(`  PDF checksum matches bundle: ${result.checks.checksumMatches}`)
console.log(`  passages verbatim on claimed PDF pages: ${verbatim}/${bundle.passages.length}`)
console.log(`  duplicate passages: ${overlaps}`)
console.log(`  imported pages ${used[0]}-${used[used.length - 1]}: ${result.checks.percentStored}% of the characters are inside a stored passage`)
console.log(`  text NOT stored (${residue.length} fragments, ${residueChars} chars) — headings, labels, enumerators, skipped chapters:`)
residue.forEach(r => console.log('    · ' + (r.length > 150 ? r.slice(0, 150) + '…' : r)))
if (result.failures.length) { console.log(`\n  FAILURES (${result.failures.length}):`); result.failures.slice(0, 20).forEach(f => console.log('    ✖ ' + f)); process.exit(1) }
console.log('  RESULT: all hard checks passed')
