#!/usr/bin/env node
/**
 * Admin-time importer for official career-progression PDFs.
 *
 * This is NOT part of the app. It runs on an administrator's computer, once per
 * newly issued publication, and never during a user's search.
 *
 *   node scripts/import-reference-source.js \
 *        --manifest data/reference/manifests/army-cmf42-dapam600-25-2025-09-30.json \
 *        --pdf ~/Downloads/cmf-42-da-pam-600-25-30-sep-25.pdf
 *
 * Writes (under data/reference/):
 *   bundles/<id>.bundle.json   extracted passages + source row + accounting report
 *   sql/<id>.import.sql        idempotent SQL for the Supabase SQL editor (unreviewed)
 *
 * Safety:
 *   - The PDF must match the SHA-256 recorded in the manifest. A different file
 *     is a different publication/version and needs its own reviewed manifest.
 *   - The PDF is read from a local path you provide; nothing is downloaded here.
 *   - Output is plain text/SQL; nothing in the PDF is ever executed.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { readPdf, extractPages, toLines } from './lib/pdfLines.js'
import { parseGuide } from './lib/careerGuides.js'
import { stableUuid, importSql } from './lib/bundleSql.js'

const { values } = parseArgs({ options: { manifest: { type: 'string' }, pdf: { type: 'string' }, out: { type: 'string', default: 'data/reference' } } })
if (!values.manifest || !values.pdf) {
  console.error('Usage: node scripts/import-reference-source.js --manifest <manifest.json> --pdf <file.pdf>')
  process.exit(2)
}

const MAX_PDF_BYTES = 30 * 1024 * 1024

const manifest = JSON.parse(await readFile(values.manifest, 'utf8'))
const { buffer, sha256 } = await readPdf(values.pdf)
if (buffer.length > MAX_PDF_BYTES) { console.error(`PDF is ${buffer.length} bytes; refusing anything over ${MAX_PDF_BYTES}.`); process.exit(1) }
if (!buffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) { console.error('That file is not a PDF.'); process.exit(1) }
if (sha256 !== manifest.pdf_sha256) {
  console.error(`Checksum mismatch.\n  manifest: ${manifest.pdf_sha256}\n  file:     ${sha256}\nThis is a different file than the one the manifest was reviewed against.`)
  process.exit(1)
}
const url = String(manifest.source.official_url || '')
if (!/^https:\/\/(api|www)\.army\.mil\//.test(url)) { console.error(`official_url must be an https army.mil URL, got: ${url}`); process.exit(1) }

const pages = await extractPages(buffer)
const { lines, printedPages, skipped } = toLines(pages, { skipLinePatterns: manifest.skipLinePatterns || [] })
const { passages, report } = parseGuide({ manifest, lines, printedPages })

const sourceId = stableUuid(`source|${manifest.id}`)
const withIds = passages.map((p, i) => ({ id: stableUuid(`passage|${manifest.id}|${i}|${p.occupation_code}|${p.section_type}|${p.rank_band}|${p.components}|${p.heading}`), ...p }))
const pdfParseVersion = JSON.parse(await readFile(new URL('../node_modules/pdf-parse/package.json', import.meta.url), 'utf8')).version

const bundle = {
  bundle_version: 1,
  manifest_id: manifest.id,
  import_batch: `${manifest.id}@${new Date().toISOString().slice(0, 10)}`,
  source: { id: sourceId, ...manifest.source, checksum_sha256: sha256, extraction_tool: `pdf-parse ${pdfParseVersion}`, chapter: null },
  passages: withIds,
  report: {
    pdfPages: pages.length,
    printedPageNumbers: Object.keys(printedPages).length,
    skippedFigureLines: skipped.length,
    ...report,
    passageCount: withIds.length,
    byType: Object.fromEntries([...new Set(withIds.map(p => p.section_type))].map(t => [t, withIds.filter(p => p.section_type === t).length])),
  },
}

const root = values.out
await mkdir(path.join(root, 'bundles'), { recursive: true })
await mkdir(path.join(root, 'sql'), { recursive: true })
await writeFile(path.join(root, 'bundles', `${manifest.id}.bundle.json`), JSON.stringify(bundle, null, 1) + '\n')
await writeFile(path.join(root, 'sql', `${manifest.id}.import.sql`), importSql(bundle))

console.log(`\n${manifest.id}`)
console.log(`  PDF: ${pages.length} pages, sha256 ${sha256.slice(0, 16)}…  (matches manifest)`)
console.log(`  passages: ${withIds.length}   by type: ${JSON.stringify(bundle.report.byType)}`)
console.log(`  in-scope lines: ${report.consumedLines}/${report.inScopeLines} accounted for`)
console.log(`  skipped chapters/sections: ${report.skippedChapters.length}`)
if (report.flags.length) { console.log(`  FLAGS (${report.flags.length}):`); report.flags.forEach(f => console.log('    - ' + f)) }
if (report.unassigned.length) { console.log(`  UNASSIGNED LINES (${report.unassigned.length}):`); report.unassigned.slice(0, 15).forEach(u => console.log(`    p${u.page}: ${u.text}  [${u.why}]`)) }
const clean = report.flags.length === 0 && report.unassigned.length === 0
console.log(clean ? '  RESULT: clean import — every in-scope line accounted for' : '  RESULT: NEEDS REVIEW — see flags/unassigned above')
process.exit(clean ? 0 : 3)
