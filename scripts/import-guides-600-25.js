#!/usr/bin/env node
/**
 * Imports the DA PAM 600-25 enlisted career progression plans (one bundle per guide) from the downloaded collection.
 *
 *   node scripts/import-guides-600-25.js --corpus <folder holding Enlisted-600-25/> [--only cmf-25] [--out data/reference]
 *
 * Per-guide decisions live in data/reference/guide-manifests/<pdf name>.json (optional): excluded codes, skipped chapters,
 * extra skip-line patterns, date basis. A guide with no usable structure gets a manifest entry saying why, and no bundle.
 * Admin-time only. Bundles are written UNREVIEWED; nothing is served until approved (data/reference/approvals.json).
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { extractPages, toLines } from './lib/pdfLines.js'
import { parseGuideAuto } from './lib/guideAuto.js'
import { stableUuid, importSql } from './lib/bundleSql.js'

const { values } = parseArgs({ options: { corpus: { type: 'string' }, only: { type: 'string' }, out: { type: 'string', default: 'data/reference' }, today: { type: 'string', default: new Date().toISOString().slice(0, 10) } } })
if (!values.corpus) { console.error('Usage: node scripts/import-guides-600-25.js --corpus <folder>'); process.exit(2) }
const audit = JSON.parse(await readFile('data/reference/corpus/source-audit.json', 'utf8'))
const cache = path.join(os.tmpdir(), 'tyfms-corpus-text'); await mkdir(cache, { recursive: true })
const pdfParseVersion = JSON.parse(await readFile(new URL('../node_modules/pdf-parse/package.json', import.meta.url), 'utf8')).version
const MONTH = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' }
function dateFromName(f) {
  const m = f.match(/(\d{1,2})-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*-(\d{2,4})(?!\d)/i)
  if (m) return `${m[3].length === 2 ? '20' + m[3] : m[3]}-${MONTH[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`
  const m2 = f.match(/(\d{1,2})-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*-(\d{4})/i)
  return m2 ? `${m2[3]}-${MONTH[m2[2].toLowerCase()]}-${m2[1].padStart(2, '0')}` : null
}

// ── structure gate ──────────────────────────────────────────────────────────────────────────────────────────────
// A career guide is only as reliable as its rank headings: if one is missed, that rank's text lands in the previous rank. So an
// MOS keeps its rank-specific passages only if (a) the guide's grades cover every grade DA PAM 611-21 lists for the MOS, and
// (b) the chapter had no full-line heading that had to be discarded. Otherwise they are withheld and listed in the report.
const spec = JSON.parse(await readFile('data/reference/bundles/army-611-21-enlisted-ch10c.bundle.json', 'utf8'))
const live = p => (!p.effective_from || p.effective_from <= values.today) && (!p.effective_to || p.effective_to > values.today)
const expected = new Map()
for (const p of spec.passages.filter(p => p.section_type === 'rank_duties' && live(p))) { if (!expected.has(p.occupation_code)) expected.set(p.occupation_code, new Set()); expected.get(p.occupation_code).add(p.rank_band) }
function applyStructureGate(passages, report) {
  const isCmfWide = p => /applies to every MOS/.test(p.heading || '')
  const bandsOf = new Map()
  for (const p of passages) if (p.rank_band && !isCmfWide(p)) { if (!bandsOf.has(p.occupation_code)) bandsOf.set(p.occupation_code, new Set()); bandsOf.get(p.occupation_code).add(p.rank_band) }
  const ambiguousChapter = new Map()
  for (const c of report.chapters) if (c.kind === 'mos' && (c.ambiguous?.length || c.droppedHeadings >= 3)) for (const code of c.codes) ambiguousChapter.set(code, { ...c, ambiguous: c.ambiguous?.length ? c.ambiguous : [{ line: `${c.droppedHeadings} candidate headings did not fit the rank order` }] })
  const gated = []
  const withheld = new Set()
  // A code with rank sections in two or more chapters (variants of the MOS: different units, tracks) cannot be told apart here.
  const chaptersWithRanks = new Map()
  for (const c of report.chapters) if (c.kind === 'mos' && c.ranks.length) for (const code of c.codes) chaptersWithRanks.set(code, [...(chaptersWithRanks.get(code) || []), c.chapter])
  for (const [code, list] of chaptersWithRanks) if (list.length > 1 && bandsOf.has(code)) { withheld.add(code); gated.push({ code, why: `the guide has rank sections for ${code} in several chapters (${list.join(', ')}), which are variants of the MOS that cannot be told apart`, passagesWithheld: passages.filter(p => p.occupation_code === code && p.rank_band && !isCmfWide(p)).length }) }
  for (const [code, bands] of bandsOf) {
    const have = new Set(bands); if (have.has('E-4..E-5')) have.add('E-5')
    const missing = [...(expected.get(code) || [])].filter(b => !have.has(b))
    const amb = ambiguousChapter.get(code)
    if (missing.length || amb) { withheld.add(code); gated.push({ code, why: missing.length ? `the guide has no section for grade(s) ${missing.join(', ')} that DA PAM 611-21 lists for this MOS` : `chapter ${amb.chapter} has full-line rank headings that could not be placed in order: ${amb.ambiguous.map(a => a.line).join('; ')}`, passagesWithheld: passages.filter(p => p.occupation_code === code && p.rank_band && !isCmfWide(p)).length }) }
  }
  return { passages: passages.filter(p => !(withheld.has(p.occupation_code) && p.rank_band && !isCmfWide(p))), gated }
}

const dir = path.join(values.corpus, 'Enlisted-600-25')
const files = (await readdir(dir)).filter(f => f.endsWith('.pdf') && !/board-products/.test(f) && (!values.only || f.includes(values.only))).sort()
await mkdir(path.join(values.out, 'bundles'), { recursive: true }); await mkdir(path.join(values.out, 'sql'), { recursive: true }); await mkdir(path.join(values.out, 'guide-manifests'), { recursive: true })
const summary = []
for (const f of files) {
  const rel = `Enlisted-600-25/${f}`
  const entry = audit.sources.find(s => s.path === rel)
  if (!entry) { console.error('not in the source audit:', rel); continue }
  const mf = await readFile(path.join('data/reference/guide-manifests', f.replace(/\.pdf$/, '.json')), 'utf8').then(JSON.parse).catch(() => ({}))
  if (mf.skipGuide) { summary.push({ file: f, skipped: mf.skipGuide }); continue }
  const buf = await readFile(path.join(dir, f))
  const sha = createHash('sha256').update(buf).digest('hex')
  if (sha !== entry.sha256) throw new Error(`checksum mismatch for ${f}`)
  const cp = path.join(cache, sha + '.json')
  let pages; try { pages = JSON.parse(await readFile(cp, 'utf8')) } catch { pages = await extractPages(buf); await writeFile(cp, JSON.stringify(pages)) }
  const { lines, printedPages } = toLines(pages, { skipLinePatterns: mf.skipLinePatterns || [] })
  const parsed = parseGuideAuto({ lines, source: {}, chapterOverrides: mf.chapters || {}, excludeCodes: mf.excludeCodes || [], chapterFixups: mf.chapterFixups || [] })
  const { report, mosCodes } = parsed
  const gate = applyStructureGate(parsed.passages, report)
  const passages = gate.passages
  report.gated = gate.gated
  if (!passages.length) { summary.push({ file: f, passages: 0, flags: report.flags.length, unassigned: report.unassigned.length }); continue }
  const id = `army-600-25-${f.replace(/\.pdf$/, '')}`
  const sourceId = stableUuid('source|' + id)
  const date = mf.publicationDate || dateFromName(f)
  const titleLines = []; for (const l of lines) { if (/^Chapter\s+1\b/.test(l.text)) break; if (l.page <= 2 && l.text.length > 3) titleLines.push(l.text) }
  const cmf = (f.match(/cmf-(\d+[a-z]?(?:-\d+)?)/i) || [])[1]
  const withIds = passages.map((p, i) => ({ id: stableUuid(`passage|${id}|${i}|${p.occupation_code}|${p.section_type}|${p.rank_band}|${p.heading}`), ...p, printed_page: printedPages[p.pdf_page_start] || null }))
  const bundle = {
    bundle_version: 1, manifest_id: id, import_batch: `${id}@${values.today}`,
    source: {
      id: sourceId, branch: 'Army', personnel_category: 'enlisted', publication_number: 'DA PAM 600-25',
      title: (mf.title || titleLines.slice(0, 3).join(' ')).slice(0, 200) || `Career progression plan ${f}`, chapter: null,
      career_field: mf.career_field || (cmf ? `CMF ${cmf.toUpperCase()}` : f.replace(/\.pdf$/, '')), proponent: mf.proponent || null, official_url: entry.official_url,
      publication_date: date, effective_date: null, last_checked_at: values.today + 'T00:00:00Z', checksum_sha256: sha, extraction_tool: `pdf-parse ${pdfParseVersion}`,
      notes: `Date basis: ${mf.dateBasis || `the ${date} date comes from the official file name and the Army G-1 listing (https://www.army.mil/g-1), checked 2026-10-16; the PDF body may print no date.`} Imported for ${[...new Set(passages.map(p => p.occupation_code))].join(', ')}. Duties and prerequisites are NOT imported from this guide (DA PAM 611-21 is the source for them); promotion-board criteria are stored but never shown. ${(mf.limitations || '')} LIMITATIONS: Reserve Component chapters and professional-development-model figures are not imported; career-field-wide rank guidance is attached to every MOS of this guide that has its own chapter.`.replace(/\s+/g, ' ').trim(),
    },
    passages: withIds,
    report: { pdfPages: pages.length, ...report, byType: Object.fromEntries([...new Set(withIds.map(p => p.section_type))].map(t => [t, withIds.filter(p => p.section_type === t).length])), mosCodes },
  }
  await writeFile(path.join(values.out, 'bundles', `${id}.bundle.json`), JSON.stringify(bundle, null, 1) + '\n')
  await writeFile(path.join(values.out, 'sql', `${id}.import.sql`), importSql(bundle))
  summary.push({ file: f, passages: withIds.length, mos: [...new Set(withIds.map(p => p.occupation_code))].length, flags: report.flags.length, unassigned: report.unassigned.length })
}
console.table(summary)
