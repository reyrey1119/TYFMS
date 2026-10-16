#!/usr/bin/env node
// Writes a human-readable, passage-by-passage listing of a bundle so a person can
// read it against the PDF before approving the source.
//   node scripts/review-listing.js data/reference/bundles/<id>.bundle.json
import { readFile, writeFile, mkdir } from 'node:fs/promises'
const [,, bundlePath] = process.argv
const b = JSON.parse(await readFile(bundlePath, 'utf8'))
const L = [`# Review listing — ${b.manifest_id}`, '', `Source: ${b.source.publication_number} — ${b.source.title}`, `Official URL: ${b.source.official_url}`, `Publication date: ${b.source.publication_date}  ·  PDF SHA-256: ${b.source.checksum_sha256}`, `Passages: ${b.passages.length}   ·   PDF page numbers below are PDF page INDICES.`, '', '## Not imported (skipped on purpose)', '']
for (const s of b.report.skippedChapters) L.push(`- PDF pp. ${s.pdfPages}: ${s.chapter} — ${s.reason}`)
if (b.report.notes?.length) L.push('', ...b.report.notes)
L.push('', '## Passages', '', '| # | PDF pages | type | grade | component | heading | starts with |', '|--|--|--|--|--|--|--|')
b.passages.forEach((p, i) => L.push(`| ${i} | ${p.pdf_page_start}${p.pdf_page_end > p.pdf_page_start ? '–' + p.pdf_page_end : ''} | ${p.section_type} | ${p.rank_band || 'all'} | ${p.components || 'all'} | ${(p.heading || '').replace(/\|/g, '/')} | ${p.body.slice(0, 110).replace(/\s+/g, ' ').replace(/\|/g, '/')} |`))
await mkdir('data/reference/reports', { recursive: true })
const out = `data/reference/reports/${b.manifest_id}.passages.md`
await writeFile(out, L.join('\n') + '\n')
console.log('wrote', out)
